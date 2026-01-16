"use client";

import { registerAttendee } from "@/actions/attendance";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  CallStatusEnum,
  WebinarStatusEnum,
} from "@/lib/generated/prisma/enums";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Label } from "recharts";
import { toast } from "sonner";

type Props = {
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
  onRegistered?: () => void;
};
const WaitlistComponent = (props: Props) => {
  const router = useRouter();
  const { webinarId, webinarStatus, onRegistered } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { setAttendee } = useAttendeeStore();

  const buttonText = () => {
    switch (webinarStatus) {
      case WebinarStatusEnum.LIVE:
        return "Join  Webinar";
      case WebinarStatusEnum.SCHEDULED:
        return "Get Reminder";

      case WebinarStatusEnum.WAITING_ROOM:
        return "Get Reminder";

      default:
        return "Register";
    }
  };

  const submitButtonText = () => {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {webinarStatus === WebinarStatusEnum.LIVE
            ? "Joining..."
            : "Registering..."}
        </>
      );
    }
    if (submitted) {
      return webinarStatus === WebinarStatusEnum.LIVE
        ? "Your are all set to join"
        : "You have successfully joined the waitlist";
    }

    return webinarStatus === WebinarStatusEnum.LIVE
      ? "Join Now"
      : "Join Waitlist";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await registerAttendee({
        email,
        name,
        webinarId,
      });
      if (!res.success) {
        throw new Error(res.message || "Something went wrong");
      }
      if (res.data?.user) {
        setAttendee({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          callStatus: CallStatusEnum.PENDING,
        });
      }
      toast.success(
        webinarStatus === WebinarStatusEnum.LIVE
          ? "Successfully joined the webinar"
          : "Succesfully registerd to the webinar"
      );
      setEmail("");
      setName("");
      setSubmitted(true);

      setTimeout(() => {
        setIsOpen(false);
        if (webinarStatus === WebinarStatusEnum.LIVE) {
          router.refresh();
        }
        if (onRegistered) {
          onRegistered();
        }
      }, 1500);
    } catch (error) {
      console.error("Error registering for webinar:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${
            webinarStatus === WebinarStatusEnum.LIVE
              ? "bg-red-600 hover:bg-red-700"
              : "bg-primary hover:bg-primary/90"
          } rouned-md px-4 py-2 text-primary-foreground text-sm font-semibold`}
        >
          {webinarStatus === WebinarStatusEnum.LIVE && (
            <span className="mr-2 h-2 w-2 bg-white rounded-full animate-pulse"></span>
          )}
          {buttonText()}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="border-0 bg-transparent"
        showCloseButton={false}
      >
        <DialogHeader className="justify-center items-center border border-input rounded-xl p-4 bg-background">
          <DialogTitle className="text-center text-lg  font-semibold mb-4">
            {webinarStatus === WebinarStatusEnum.LIVE
              ? "Join the Webinar"
              : "Join the Waitlist"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {!submitted && (
            <React.Fragment>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </React.Fragment>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || submitted}
            className="w-full"
          >
            {submitButtonText()}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistComponent;
// 4:59:24
