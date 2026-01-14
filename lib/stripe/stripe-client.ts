import { loadStripe } from "@stripe/stripe-js";

const getPublishableKey = () => {
  // Prefer the correctly named env var
  const key =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY ??
    "";

  if (!key) {
    // Fail fast with a clear message instead of letting Stripe receive an empty string
    throw new Error(
      "Stripe publishable key is not set. Please define NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment."
    );
  }

  return key;
};

export const useStripeElements = (connectedAccountId = "") => {
  const publishableKey = getPublishableKey();

  if (connectedAccountId) {
    const StripePromise = async () => {
      return await loadStripe(publishableKey, {
        stripeAccount: connectedAccountId,
      });
    };
    return { StripePromise };
  }

  const StripePromise = async () => {
    return await loadStripe(publishableKey);
  };

  return {
    StripePromise,
  };
};
