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
import { getFanEngagementVariant } from "@/lib/presentation";
import { formatRelativeTime } from "@/lib/utils";
import type { FanListItemDto } from "@/services/fans-types";

type FanTableProps = {
  fans: FanListItemDto[];
};

export function FanTable({ fans }: FanTableProps) {
  return (
    <>
      <div className="space-y-3 p-4 md:hidden">
        {fans.map((fan) => (
          <article
            key={fan.id}
            className="border-border/70 bg-background/45 rounded-2xl border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <Link
                  href={fan.href}
                  className="text-foreground hover:text-primary inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {fan.name}
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <p className="text-muted-foreground text-xs">
                  {fan.notes
                    ? "Relationship notes saved"
                    : "No relationship notes yet"}
                </p>
              </div>
              <Badge variant={getFanEngagementVariant(fan.engagementScore)}>
                {fan.engagementScore}
              </Badge>
            </div>
            <div className="text-muted-foreground mt-4 grid gap-2 text-sm">
              <p>{fan.email ?? "Email not set"}</p>
              <p>{fan.handle ?? "Handle not set"}</p>
              <p>{fan.city ?? "City not set"}</p>
            </div>
            {fan.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {fan.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
            <p className="text-muted-foreground mt-3 text-xs">
              Updated {formatRelativeTime(fan.updatedAt)}
            </p>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fan</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Handle</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fans.map((fan) => (
              <TableRow key={fan.id}>
                <TableCell>
                  <div className="space-y-1">
                    <Link
                      href={fan.href}
                      className="text-foreground hover:text-primary inline-flex items-center gap-1 font-medium transition-colors"
                    >
                      {fan.name}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {fan.notes
                        ? "Relationship notes saved"
                        : "No relationship notes yet"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{fan.email ?? "Not set"}</TableCell>
                <TableCell>{fan.handle ?? "Not set"}</TableCell>
                <TableCell>{fan.city ?? "Not set"}</TableCell>
                <TableCell>
                  {fan.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {fan.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    "No tags"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getFanEngagementVariant(fan.engagementScore)}>
                    {fan.engagementScore}
                  </Badge>
                </TableCell>
                <TableCell>{formatRelativeTime(fan.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
