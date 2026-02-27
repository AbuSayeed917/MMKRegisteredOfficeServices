import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendPaymentReceivedEmail, sendPaymentFailedEmail } from "@/lib/email";
import type Stripe from "stripe";

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events for payment lifecycle.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const subscriptionId = session.metadata?.subscriptionId;

  if (!userId || !subscriptionId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  const now = new Date();
  const endDate = new Date(now);
  endDate.setFullYear(endDate.getFullYear() + 1); // 12-month term

  const nextPaymentDate = new Date(endDate);

  // Determine payment method
  const paymentMethodType =
    session.payment_method_types?.[0] === "bacs_debit"
      ? "BACS_DIRECT_DEBIT"
      : "CARD";

  // Update subscription to PENDING_APPROVAL (payment received, awaiting admin review)
  await db.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "PENDING_APPROVAL",
      startDate: now,
      endDate,
      nextPaymentDate,
      paymentMethod: paymentMethodType as "CARD" | "BACS_DIRECT_DEBIT",
      stripeCustomerId: session.customer as string,
    },
  });

  // Create payment record
  await db.payment.create({
    data: {
      subscriptionId,
      userId,
      amount: session.amount_total || 7500,
      currency: session.currency || "gbp",
      status: "SUCCEEDED",
      paymentMethod: paymentMethodType as "CARD" | "BACS_DIRECT_DEBIT",
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: now,
    },
  });

  // Create notification for user
  await db.notification.create({
    data: {
      userId,
      type: "PAYMENT_RECEIVED",
      title: "Payment Confirmed",
      message:
        "Your payment of £75.00 has been received. Your application is now under review by our admin team.",
    },
  });

  // Notify admins
  const admins = await db.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
  });

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { businessProfile: true },
  });

  for (const admin of admins) {
    await db.notification.create({
      data: {
        userId: admin.id,
        type: "NEW_APPLICATION",
        title: "New Application — Payment Received",
        message: `${user?.businessProfile?.companyName || user?.email} has paid £75.00 and submitted their application with KYC documents. Please review and approve or reject.`,
      },
    });
  }

  // Send payment confirmation email
  if (user) {
    const companyName = user.businessProfile?.companyName || user.email;
    sendPaymentReceivedEmail(
      user.email,
      companyName,
      `£${((session.amount_total || 7500) / 100).toFixed(2)}`,
      now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      endDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    ).catch((e) => console.warn("Payment email failed:", e));
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Update any pending payment records
  if (paymentIntent.id) {
    await db.payment.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
        status: "PENDING",
      },
      data: {
        status: "SUCCEEDED",
        paidAt: new Date(),
      },
    });
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata?.userId;

  if (paymentIntent.id) {
    await db.payment.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      data: {
        status: "FAILED",
      },
    });
  }

  if (userId) {
    // Increment retry count on subscription
    const subscription = await db.subscription.findUnique({
      where: { userId },
    });

    if (subscription) {
      const newRetryCount = subscription.retryCount + 1;

      // Get user for email
      const failedUser = await db.user.findUnique({
        where: { id: userId },
        include: { businessProfile: true },
      });
      const failedCompanyName =
        failedUser?.businessProfile?.companyName || failedUser?.email || "your company";

      // Suspend after 3 failed retries (21 days)
      if (newRetryCount >= 3) {
        await db.subscription.update({
          where: { id: subscription.id },
          data: {
            status: "SUSPENDED",
            retryCount: newRetryCount,
          },
        });

        await db.notification.create({
          data: {
            userId,
            type: "ACCOUNT_SUSPENDED",
            title: "Account Suspended",
            message:
              "Your subscription has been suspended due to repeated payment failures. Please update your payment method to reactivate.",
          },
        });
      } else {
        await db.subscription.update({
          where: { id: subscription.id },
          data: { retryCount: newRetryCount },
        });

        await db.notification.create({
          data: {
            userId,
            type: "PAYMENT_FAILED",
            title: "Payment Failed",
            message: `Your payment attempt failed. We will retry automatically. Attempt ${newRetryCount} of 3.`,
          },
        });
      }

      // Send payment failed email
      if (failedUser) {
        sendPaymentFailedEmail(
          failedUser.email,
          failedCompanyName,
          newRetryCount
        ).catch((e) => console.warn("Payment failed email error:", e));
      }
    }
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  if (charge.payment_intent) {
    await db.payment.updateMany({
      where: {
        stripePaymentIntentId: charge.payment_intent as string,
      },
      data: {
        status: "REFUNDED",
      },
    });
  }
}
