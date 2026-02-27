import Stripe from "stripe";

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
    stripeAccount: process.env.STRIPE_ACCOUNT_ID || undefined,
  });
}

// Lazy initialization — only throws when actually used, not at import/build time
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripeClient();
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
