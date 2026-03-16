import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { campaignStatusLabels, releaseTypeLabels } from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";
import { getCampaignRoute } from "@/services/campaigns-helpers";
import type { CampaignListItemDto } from "@/services/campaigns-types";

type CampaignTableProps = {
  campaigns: CampaignListItemDto[];
};

export function CampaignTable({ campaigns }: CampaignTableProps) {
  return (
    <>
      <div className="space-y-3 p-4 md:hidden">
        {campaigns.map((campaign) => (
          <article
            key={campaign.id}
            className="border-border/70 bg-background/45 rounded-2xl border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <Link
                  href={getCampaignRoute(campaign.id)}
                  className="text-foreground hover:text-primary inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {campaign.name}
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <p className="text-muted-foreground text-sm">
                  {campaign.objective}
                </p>
              </div>
              <Badge variant={getStatusVariant(campaign.status)}>
                {campaignStatusLabels[campaign.status]}
              </Badge>
            </div>
            <div className="text-muted-foreground mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p>{formatCurrency(campaign.budget)}</p>
              <p>
                {formatDate(campaign.startDate)}
                {campaign.endDate ? ` - ${formatDate(campaign.endDate)}` : ""}
              </p>
              <p>
                {campaign.release
                  ? `${campaign.release.title} (${releaseTypeLabels[campaign.release.type]})`
                  : "Not linked to a release"}
              </p>
              <p>{campaign.contentItemsCount} content item(s)</p>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Updated {formatRelativeTime(campaign.updatedAt)}
            </p>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Window</TableHead>
              <TableHead>Linked release</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div className="space-y-1">
                    <Link
                      href={getCampaignRoute(campaign.id)}
                      className="text-foreground hover:text-primary inline-flex items-center gap-1 font-medium transition-colors"
                    >
                      {campaign.name}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                    <p className="text-muted-foreground text-sm">
                      {campaign.objective}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(campaign.status)}>
                    {campaignStatusLabels[campaign.status]}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(campaign.budget)}</TableCell>
                <TableCell>
                  {formatDate(campaign.startDate)}
                  {campaign.endDate ? ` - ${formatDate(campaign.endDate)}` : ""}
                </TableCell>
                <TableCell>
                  {campaign.release ? (
                    <div className="space-y-1">
                      <p className="text-foreground font-medium">
                        {campaign.release.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {releaseTypeLabels[campaign.release.type]}
                      </p>
                    </div>
                  ) : (
                    "Not linked"
                  )}
                </TableCell>
                <TableCell>{campaign.contentItemsCount}</TableCell>
                <TableCell>{formatRelativeTime(campaign.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
