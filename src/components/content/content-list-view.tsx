import Link from "next/link";

import { ContentAgendaList } from "@/components/content/content-agenda-list";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  contentFormatLabels,
  contentPlatformLabels,
  contentStatusLabels
} from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { formatDate } from "@/lib/utils";
import type { ContentPlannerItemDto } from "@/services/content-types";

type ContentListViewProps = {
  items: ContentPlannerItemDto[];
};

export function ContentListView({ items }: ContentListViewProps) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Context</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Link href={item.href}>{item.title}</Link>
                </TableCell>
                <TableCell>{contentPlatformLabels[item.platform]}</TableCell>
                <TableCell>{contentFormatLabels[item.format]}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.status)}>
                    {contentStatusLabels[item.status]}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(item.dueDate)}</TableCell>
                <TableCell>{item.campaign?.name ?? item.release?.title ?? "Standalone"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden">
        <ContentAgendaList
          items={items}
          emptyTitle="No content in this range"
          emptyDescription="Adjust filters or add a new item to populate the planner."
        />
      </div>
    </>
  );
}
