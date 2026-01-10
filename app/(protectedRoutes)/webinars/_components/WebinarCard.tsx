import { Webinar } from "@/lib/generated/prisma/client";
import { format } from "date-fns";
import { Calendar, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  webinar: Webinar;
};

const WebinarCard = (props: Props) => {
  const { webinar } = props;

  return (
    <div className="flex gap-3 flex-col items-start w-full">
      <Link href={`/live-webinar/${webinar?.id}`} className="w-full max-w-100">
        <Image
          className="rounded-md w-100"
          height={100}
          width={400}
          alt="webinar"
          src="/darkthumbnail.png"
        />
      </Link>
      <div className="w-full flex justify-between gap-3 items-center">
        <Link
          href={`/live-webinar/${webinar?.id}`}
          className="flex flex-col gap-2 items-start"
        >
          <div>
            <p className="text-sm text-primary font-semibold">
              {webinar.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {webinar.description}
            </p>
          </div>
          <div className="flex gap-2 justify-start items-center ">
            <div className="flex gap-2 items-center text-xs text-muted-foreground ">
              <Calendar size={15} />
              <p>{format(new Date(webinar?.startTime), "dd MMM yyyy")}</p>
            </div>
          </div>
        </Link>
        <Link
          href={`/webinar/${webinar?.id}/pipeline`}
          className="flex px-4 py-2 rounded-md border-[0.5px] border-border bg-secondary"
        >
          <LayoutDashboard className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default WebinarCard;
