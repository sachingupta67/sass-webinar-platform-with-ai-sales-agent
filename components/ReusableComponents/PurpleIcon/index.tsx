import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const PurpleIcon = (props: Props) => {
  return (
    <div className={cn("px-4 py-2 iconBackground text-white", props.className)}>
      {props.children}
    </div>
  );
};

export default PurpleIcon;
