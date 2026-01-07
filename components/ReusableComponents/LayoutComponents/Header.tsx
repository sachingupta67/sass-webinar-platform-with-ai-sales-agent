"use client";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/generated/prisma/client";
import { ArrowLeft, ZapIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import PurpleIcon from "../PurpleIcon";
import CreateWebinarButton from "../CreateWebinarButton";

type Props = { user: User };
// TODO: Stripe subscription , Assistant , User, Leads , Webinars

const Header = (props: Props) => {
  const { user } = props;
  const pathName = usePathname();
  const router = useRouter();
  return (
    <div className="w-full px-4 pt-10 sticky top-10 mb-10 z-10 flex justify-between items-center flex-wrap gap-4 bg-background ">
      {pathName.includes("pipeline") ? (
        <Button
          className="bg-primary/10 border border-border rounded-xl"
          variant="outline"
          onClick={() => router.push("/webinar")}
        >
          <ArrowLeft /> Back to Webinars
        </Button>
      ) : (
        <div className="px-4 py-2 flex justify-center text-bold items-center rounded-xl bg-background border border-border text-primary capitalize">
          {pathName.split("/")[1]}
        </div>
      )}
      {/* Build Stripe Subscription and create webinar button */}
      <div className="flex gap-6 items-center flex-wrap">
        <PurpleIcon>
          <ZapIcon className="w-4 h-4" />
        </PurpleIcon>
        <CreateWebinarButton />
      </div>
    </div>
  );
};

export default Header;
