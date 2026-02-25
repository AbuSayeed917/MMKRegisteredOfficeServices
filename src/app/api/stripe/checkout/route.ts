import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session for the £75/year registered office service.
 */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user + subscription
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        businessProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.subscription) {
      return NextResponse.json(
        { error: "No subscription record found" },
        { status: 400 }
      );
    }

    // Don't allow checkout if already active
    if (user.subscription.status === "ACTIVE") {
      return NextResponse.json(
        { error: "Subscription is already active" },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.subscription.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
          companyName: user.businessProfile?.companyName || "",
          crn: user.businessProfile?.crn || "",
        },
      });
      stripeCustomerId = customer.id;

      await db.subscription.update({
        where: { id: user.subscription.id },
        data: { stripeCustomerId },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      payment_method_types: ["card", "bacs_debit"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Registered Office Service",
              description:
                "Annual registered office address service at MMK Accountants, Luton",
            },
            unit_amount: 7500, // £75.00 in pence
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        subscriptionId: user.subscription.id,
      },
      success_url: `${baseUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/payment/cancel`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
