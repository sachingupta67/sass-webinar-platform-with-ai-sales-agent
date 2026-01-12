import UserInfoCard from "@/components/ReusableComponents/UserInfoCard";
import { Badge } from "@/components/ui/badge";
import { Attendee } from "@/lib/generated/prisma/client";

type Props = {
  title: string;
  count: number;
  users: Attendee[];
  tags: string[];
};
const PipelineLayout = (props: Props) => {
  const { title, count, users, tags } = props;
  console.log("props:::", props);
  return (
    <div className="shrink-0 w-87.5 p-5 border border-border bg-background/10 rounded-xl backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="font-medium">{title}</h2>
        <Badge variant="secondary">{count}</Badge>
      </div>
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
        {users.map((user, index) => {
          return <UserInfoCard key={index} customer={user} tags={tags} />;
        })}
      </div>
    </div>
  );
};

export default PipelineLayout;
