import { useStripeElements } from "@/lib/stripe/stripe-client";
import { Elements } from "@stripe/react-stripe-js";
type Props = {
  children?: React.ReactNode;
};

const StripeElements = (props: Props) => {
  const { StripePromise } = useStripeElements();
  const promise = StripePromise();

  const { children } = props;
  return promise && <Elements stripe={promise}>{children}</Elements>;
};

export default StripeElements;
