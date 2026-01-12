import PageHeader from "@/components/ReusableComponents/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LayoutDashboard, Users, Webcam } from "lucide-react";
// import { MOCK_LEAD_DATA } from "./__tests__/data";
import { getRandomBadgeStyle } from "@/lib/utils";

const LeadPage = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<Webcam className="w-3 h-3" />}
        mainIcon={<Users className="w-12 h-12" />}
        rightIcon={<LayoutDashboard className="w-4 h-4" />}
        heading="Keep track of all of your customers"
        placeholder="Search Name, Tag or email"
      />
      <Table className="border rounded-lg overflow-hidden">
        <TableHeader className="bg-accent-secondary">
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-4 font-semibold">Name</TableHead>
            <TableHead className="py-4 font-semibold">Email</TableHead>
            <TableHead className="py-4 font-semibold">Phone</TableHead>
            <TableHead className="py-4 font-semibold text-right">
              Tags
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {leadData?.map((lead, i) => (
            <TableRow
              key={i}
              className="
                border-b last:border-b-0
                even:bg-muted/40
                hover:bg-muted/60
                transition-colors
              "
            >
              <TableCell className="py-4 font-medium">{lead.name}</TableCell>

              <TableCell className="py-4 text-muted-foreground">
                {lead.email}
              </TableCell>

              <TableCell className="py-4">{lead.phone}</TableCell>

              <TableCell className="py-4">
                <div className="flex justify-end gap-2 flex-wrap">
                  {lead?.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className={`text-xs px-2 py-0.5 rounded-md ${getRandomBadgeStyle()}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadPage;
