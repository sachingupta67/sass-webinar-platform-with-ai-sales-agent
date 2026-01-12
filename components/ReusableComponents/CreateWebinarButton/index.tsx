import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useWebinarStore } from "@/store/useWebinarStore";
import { DialogTitle } from "@radix-ui/react-dialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import MultiStepForm from "./MultiStepForm";
import BasicInfoStep from "./BasicInfoStep";
import CTAStep from "./CTAStep";
import AdditionalInfoStep from "./AdditionalInfoStep";
import Stripe from "stripe";

type Props = {
  stripeProducts: Stripe.Product[] | [];
};
function CreateWebinarButton(props: Props) {
  const { stripeProducts } = props;
  const {
    isComplete,
    isModalOpen,
    isSubmitting,
    setComplete,
    setModalOpen,
    setSubmitting,
  } = useWebinarStore();

  const [webinarLink, setWebinarLink] = useState("");

  const steps = [
    {
      id: "basicInfo",
      title: "Basic Information",
      description: "Please fill out the standard info needed for your webinar",
      component: <BasicInfoStep />,
    },
    {
      id: "cta",
      title: "CTA",
      description:
        "Please provide the end-point for your customers through your webinar",
      component: <CTAStep assistants={[]} stripeProducts={stripeProducts} />,
    },

    {
      id: "additionalInfo",
      title: "Additional Information",
      description:
        "Please fill out information about additional option if necessary ",
      component: <AdditionalInfoStep />,
    },
  ];

  const handleComplete = (webinarId: string) => {
    setComplete(true);

    // once done with steps user will get webinar link
    setWebinarLink(
      `${process.env.NEXT_PUBLIC_BASE_URL}/live-webinar/${webinarId}`,
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-xl flex gap-2 items-center hover:cursor-pointer px-4 py-2 border border-border bg-primary/10 backdrop-blur-sm text-sm font-normal text-primary hover:bg-primary-20"
          onClick={() => setModalOpen(true)}
        >
          <PlusIcon />
          Create Webinar
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-225 p-0 bg-transparent border-none">
        {isComplete ? (
          <div className="bg-muted text-primary rounded-lg overflow-hidden">
            <DialogTitle>Create Webinar</DialogTitle>
            {/* SuccessStep */}
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only ">Create Webinar</DialogTitle>
            <MultiStepForm steps={steps} onComplete={handleComplete} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateWebinarButton;
