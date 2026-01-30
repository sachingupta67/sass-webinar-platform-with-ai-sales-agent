"use client";

import type { User, Webinar } from "@/lib/generated/prisma/client";
import { WebinarStatusEnum } from "@/lib/generated/prisma/enums";
import React, { useEffect } from "react";
import WebinarUpcomingState from "./UpcomingWebinar/WebinarUpcomingState";
import { usePathname, useRouter } from "next/navigation";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { toast } from "sonner";
import WaitlistComponent from "./UpcomingWebinar/WaitlistComponent";
import LiveStreamState from "./LiveWebinar/LiveStreamState";
import { WebinarWithPresenter } from "@/lib/types";

type Props = {
  apiKey: string;
  token: string;
  callId: string;
  user: User | null;
  error: string | undefined;
  webinar: WebinarWithPresenter;
};
const RenderWebinar = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { attendee } = useAttendeeStore();
  const { apiKey, token, callId, user, webinar, error } = props;

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push(pathname);
    }
  }, [error]);
  // TODO : build waiting room and live webinar

  const renderWebinarStatus = () => {
    switch (webinar.webinarStatus) {
      case WebinarStatusEnum.SCHEDULED:
        console.log("Webinar is scheduled");
        return (
          <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
        );
      case WebinarStatusEnum.WAITING_ROOM:
        console.log("Webinar is waiting room");
        return (
          <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
        );
      case WebinarStatusEnum.LIVE:
        console.log("Webinar is live");
        return (
          // TODO : Add Livestream component and webinar stuff
          <React.Fragment>
            {user?.id === webinar.presenterId ? (
              <LiveStreamState
                apiKey={apiKey}
                token={token}
                callId={callId}
                webinar={webinar}
                user={user}
              />
            ) : attendee ? (
              // <Participant apiKey={apiKey} token={token} callId={callId} />
              "Live Stream State for Participant"
            ) : (
              <WebinarUpcomingState
                webinar={webinar}
                currentUser={user || null}
              />
            )}
          </React.Fragment>
        );
      case WebinarStatusEnum.CANCELLED:
        console.log("Webinar is cancelled");
        return (
          <div className="flex justify-center items-center h-full w-full">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-primary">
                {webinar?.title}
              </h3>
              <p className="text-muted-foreground text-xs">
                This webinar has been cancelled. Please check back later for
                more information.
              </p>
            </div>
          </div>
        );
      default:
        console.log("Webinar is default");
        return (
          <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
        );
    }
  };

  return <React.Fragment>{renderWebinarStatus()}</React.Fragment>;
};

export default RenderWebinar;
