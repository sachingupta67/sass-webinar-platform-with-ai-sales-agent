import { getWebinarAttendance } from "@/actions/webinar";
import PageHeader from "@/components/ReusableComponents/PageHeader";
import { AttendedTypeEnum } from "@/lib/generated/prisma/enums";
import { HomeIcon, LayoutDashboard, Users } from "lucide-react";
import React from "react";
import PipelineLayout from "./_components/PipelineLayout";
import { formatColumnTitle } from "./_components/PipelineLayout/utils";

type Props = {
  params: Promise<{ webinarId: string }>;
};

const WebinarPipelinePage = async (props: Props) => {
  const { webinarId } = await props.params;
  const pipelineData = await getWebinarAttendance(webinarId);
  if (!pipelineData.data) {
    return (
      <div className="text-3xl h-100 flex justify-center items-center">
        No Pipelines found
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col gap-8 ">
      <PageHeader
        leftIcon={<Users className="w-3 h-3" />}
        mainIcon={<LayoutDashboard className="w-12 h-12" />}
        rightIcon={<HomeIcon className="w-4 h-4" />}
        heading="Keep track of all of your customers"
        placeholder="Search Name, Tag or email"
      />
      <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6">
        {Object.entries(pipelineData.data).map(([columnType, columnData]) => (
          <PipelineLayout
            key={columnType}
            title={formatColumnTitle(columnType as AttendedTypeEnum)}
            count={columnData.count}
            users={columnData.users}
            tags={columnData.webinarTags}
          />
        ))}
      </div>
    </div>
  );
};

export default WebinarPipelinePage;
