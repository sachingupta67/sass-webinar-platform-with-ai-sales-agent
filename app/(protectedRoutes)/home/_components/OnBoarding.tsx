"use client";

import PurpleIcon from "@/components/ReusableComponents/PurpleIcon";
import { onBoardingSteps } from "@/lib/data";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

const OnBoarding = () => {
  return (
    <div className="flex flex-col gap-1 items-start justify-start ">
      {onBoardingSteps.map((step, index) => {
        return (
          <Link
            key={index}
            href={step.link}
            className="flex items-center gap-2"
          >
            <CheckCircleIcon className="w-4 h-4" />
            <p className="text-base text-foreground">{step.title}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default OnBoarding;
