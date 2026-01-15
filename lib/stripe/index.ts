import Stripe from "stripe";

// export const stripe = new Stripe(
//   (process.env.STRIPE_SECRET_KEY as string) ?? "",
//   {
//     apiVersion: "2025-12-15.clover",
//     appInfo: {
//       name: "DevStreak Spotlight",
//       version: "0.1.0",
//     },
//   },
// );

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
