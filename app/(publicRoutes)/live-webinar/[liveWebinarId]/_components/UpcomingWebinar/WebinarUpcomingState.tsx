"use client";
import { type User, type Webinar } from "@/lib/generated/prisma/client";
import { WebinarStatusEnum } from "@/lib/generated/prisma/enums";
import React, { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import Image from "next/image";
import WaitlistComponent from "./WaitlistComponent";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarIcon, Clock, Loader2 } from "lucide-react";
import { changeWebinarStatus } from "@/actions/webinar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getWebinarInitials } from "@/lib/utils";
type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = (props: Props) => {
  const { webinar, currentUser } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartWebinar = async () => {
    setLoading(true);
    console.log("Start webinar");
    try {
      const res = await changeWebinarStatus(webinar.id, "LIVE");
      if (!res.success) {
        throw new Error(res.message || "Something went wrong");
      }
      toast.success("Webinar started successfully");
      router.refresh();
    } catch (error) {
      console.error("Error starting webinar:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderWebinarAction = () => {
    switch (webinar.webinarStatus) {
      case WebinarStatusEnum.SCHEDULED:
        return (
          <WaitlistComponent
            webinarId={webinar.id}
            webinarStatus={WebinarStatusEnum.SCHEDULED}
          />
        );
      case WebinarStatusEnum.WAITING_ROOM:
        if (currentUser?.id === webinar.presenterId) {
          return (
            <Button
              className="w-full max-w-[300px] font-semibold"
              onClick={handleStartWebinar}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting...
                </>
              ) : (
                "Start Webinar"
              )}
            </Button>
          );
        }
        return (
          <WaitlistComponent
            webinarId={webinar.id}
            webinarStatus={WebinarStatusEnum.WAITING_ROOM}
          />
        );
      case WebinarStatusEnum.LIVE:
        return (
          <WaitlistComponent
            webinarId={webinar.id}
            webinarStatus={WebinarStatusEnum.LIVE}
          />
        );
      case WebinarStatusEnum.CANCELLED:
        return <p className="text-center text-red-500">Webinar Cancelled</p>;
      default:
        return <Button>Ended</Button>;
    }
  };
  return (
    <div className="w-full min-h-screen mx-auto max-w-[400px] flex flex-col justify-center items-center gap-8 py-20">
      <div className="space-y-6">
        <p className="text-3xl font-semibold text-primary text-center">
          Seems like you are little early
        </p>
        <CountdownTimer
          targetDate={new Date(webinar.startTime)}
          className="text-center"
          webinarId={webinar.id}
          webinarStatus={webinar.webinarStatus}
        />
      </div>
      <div className="space-y-6 w-full h-full flex justify-center items-center flex-col">
        <div className="w-full max-w-md aspect-4/3 relative rounded-4xl overflow-hidden mb-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-6xl font-extrabold tracking-wider text-white">
            {getWebinarInitials(webinar.title)}
          </span>
        </div>
        {renderWebinarAction()}
      </div>

      <div className="text-center space-y-4 ">
        <h3 className="text-2xl font-semibold text-primary">{webinar.title}</h3>
        <p className="text-muted-foreground text-xs">{webinar.description}</p>
        <div className="w-full justify-center flex gap-2 flex-wrap items-center">
          <Button
            variant="outline"
            className="rounded-md bg-secondary backdrop-blur-2xl"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(webinar.startTime), "dd MMM yyyy")}
          </Button>

          <Button
            variant="outline"
            className="rounded-md bg-secondary backdrop-blur-2xl"
          >
            <Clock className="mr-2 h-4 w-4" />
            {format(new Date(webinar.startTime), "hh:mm a")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebinarUpcomingState;
