"use client";

import { usePathname } from "next/navigation";
import React from "react";
type Props = {};

const Sidebar: React.FC<Props> = (props) => {
  const pathname = usePathname();
  return (
    <div className="w-18 sm:w-28  h-screen sticky top-0 py-10 px-2 sm:px-6 border bg-background border-border flex flex-col items-center justify-center gap-10">
      Sidebar
    </div>
  );
};

export default Sidebar;
