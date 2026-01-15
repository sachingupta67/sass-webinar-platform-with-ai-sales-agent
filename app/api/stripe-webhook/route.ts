import { updateSubscription } from "@/actions/stripe";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SUBSCRIPTION_EVENTS = new Set([
  "invoice.created",
  "invoice.finalized",
  "invoice.paid",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const getStripeEvent = async (
  body: string,
  sig: string | null,
): Promise<Stripe.Event> => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    throw new Error("Stripe signature or webhook secret is missing");
  }
  return stripe.webhooks.constructEvent(body, sig, webhookSecret);
};
export async function POST(req: NextRequest) {
  console.log("Recieved stripe webhook event");
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
  try {
    const stripeEvent = await getStripeEvent(body, signature);
    if (!STRIPE_SUBSCRIPTION_EVENTS.has(stripeEvent.type)) {
      console.log("Unhandled irrelevant event!", stripeEvent.type);
      return NextResponse.json(
        {
          received: true,
        },
        {
          status: 200,
        },
      );
    }

    const event = stripeEvent.data.object as Stripe.Subscription;
    const metadata = event.metadata;
    if (
      metadata.connectedAccountPayments ||
      metadata.connectedAccountSubscriptions
    ) {
      console.log("Skipping connected account subscription event");
      return NextResponse.json(
        {
          message: "Skipping connected accounts subscription events",
        },
        {
          status: 200,
        },
      );
    }

    switch (stripeEvent.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await updateSubscription(event);
        console.log("CREATED FROM WEBHOOK ", event);
        return NextResponse.json({ received: true }, { status: 200 });
      default:
        console.log("Unhandled relevant event!", stripeEvent.type);
        return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (err: any) {
    console.log("Webbook processing error:::::", err);
    return new NextResponse(`Webhook Error:${err.message}`, {
      status: err.statusCode || 500,
    });
  }
}

// 4:16:13
