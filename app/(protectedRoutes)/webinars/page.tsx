import { onAuthenticateUser } from "@/actions/auth";
import { getWebinarsByPresentedId } from "@/actions/webinar";
import PageHeader from "@/components/ReusableComponents/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Webinar } from "@/lib/generated/prisma/client";
import { HomeIcon, Users, Webcam } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import WebinarCard from "./_components/WebinarCard";

const WebinarPage = async () => {
  const checkUser = await onAuthenticateUser();
  if (!checkUser.user) {
    redirect("/");
  }
  const webinars = await getWebinarsByPresentedId(checkUser?.user?.id);
  const now = new Date();
  const upcomingWebinars = Array.isArray(webinars)
    ? webinars.filter((webinar) => new Date(webinar.startTime) > now)
    : [];
  const endedWebinars = Array.isArray(webinars)
    ? webinars.filter((webinar) => new Date(webinar.startTime) <= now)
    : [];

  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<HomeIcon className="w-3 h-3" />}
        mainIcon={<Webcam className="w-12 h-12" />}
        rightIcon={<Users className="w-4 h-4" />}
        heading="The home to all your webinars"
        placeholder="Search options..."
      >
        <TabsList className="bg-transparent space-x-3">
          <TabsTrigger
            value="all"
            className="bg-secondary opacity-50 data-[state=active]:opacity-100 px-8 py-4"
          >
            All
          </TabsTrigger>

          <TabsTrigger
            value="upcoming"
            className="bg-secondary opacity-50 data-[state=active]:opacity-100 px-8 py-4"
          >
            Upcoming
          </TabsTrigger>

          <TabsTrigger
            value="ended"
            className="bg-secondary opacity-50 data-[state=active]:opacity-100 px-8 py-4"
          >
            Ended
          </TabsTrigger>
        </TabsList>
      </PageHeader>
      <TabsContent
        value="all"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-center place-content-start gap-x-6 gap-y-10"
      >
        {Array.isArray(webinars) && webinars.length > 0 ? (
          webinars.map((webinar: Webinar, i: number) => {
            return <WebinarCard key={i} webinar={webinar} />;
          })
        ) : (
          <div className="w-full h-50 flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No Webinar found
          </div>
        )}
      </TabsContent>
      <TabsContent
        value="upcoming"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-center place-content-start gap-x-6 gap-y-10"
      >
        {upcomingWebinars.length > 0 ? (
          upcomingWebinars.map((webinar: Webinar, i: number) => {
            return <WebinarCard key={i} webinar={webinar} />;
          })
        ) : (
          <div className="w-full h-50 flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No Upcoming Webinars
          </div>
        )}
      </TabsContent>
      <TabsContent
        value="ended"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-center place-content-start gap-x-6 gap-y-10"
      >
        {endedWebinars.length > 0 ? (
          endedWebinars.map((webinar: Webinar, i: number) => {
            return <WebinarCard key={i} webinar={webinar} />;
          })
        ) : (
          <div className="w-full h-50 flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No Ended Webinars
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default WebinarPage;
