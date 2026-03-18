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
import {
  releaseStatusLabels,
  releaseTypeLabels,
  releaseStatusValues,
  releaseTypeValues
} from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { getReleaseRoute } from "@/services/releases-helpers";

type ReleaseTableItem = {
  id: string;
  title: string;
  slug: string;
  type: (typeof releaseTypeValues)[number];
  status: (typeof releaseStatusValues)[number];
  releaseDate: Date | null;
  distributor: string | null;
  updatedAt: Date;
  _count: {
    tracks: number;
    campaigns: number;
    contentItems: number;
  };
};

type ReleaseTableProps = {
  releases: ReleaseTableItem[];
};

export function ReleaseTable({ releases }: ReleaseTableProps) {
  return (
    <>
      <div className="space-y-3 p-4 md:hidden">
        {releases.map((release) => (
          <article
            key={release.id}
            className="rounded-[1.7rem] border-2 border-black/12 bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <Link
                  href={getReleaseRoute(release.id)}
                  className="text-foreground hover:text-primary inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {release.title}
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <p className="text-muted-foreground text-xs">{release.slug}</p>
              </div>
              <Badge variant={getStatusVariant(release.status)}>
                {releaseStatusLabels[release.status]}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">{releaseTypeLabels[release.type]}</Badge>
              <Badge variant="outline">{formatDate(release.releaseDate)}</Badge>
            </div>
            <div className="text-muted-foreground mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p>
                {release._count.tracks} track
                {release._count.tracks === 1 ? "" : "s"} •{" "}
                {release._count.campaigns} campaign
                {release._count.campaigns === 1 ? "" : "s"}
              </p>
              <p>{release.distributor ?? "Distributor not set"}</p>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Updated {formatRelativeTime(release.updatedAt)}
            </p>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Release</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Linked</TableHead>
              <TableHead>Distributor</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releases.map((release) => (
              <TableRow key={release.id}>
                <TableCell>
                  <div className="space-y-1">
                    <Link
                      href={getReleaseRoute(release.id)}
                      className="text-foreground hover:text-primary inline-flex items-center gap-1 font-medium transition-colors"
                    >
                      {release.title}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {release.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{releaseTypeLabels[release.type]}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(release.status)}>
                    {releaseStatusLabels[release.status]}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(release.releaseDate)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {release._count.tracks} track
                  {release._count.tracks === 1 ? "" : "s"}
                  <br />
                  {release._count.campaigns} campaign
                  {release._count.campaigns === 1 ? "" : "s"}
                  <br />
                  {release._count.contentItems} content item
                  {release._count.contentItems === 1 ? "" : "s"}
                </TableCell>
                <TableCell>{release.distributor ?? "Not set"}</TableCell>
                <TableCell>{formatRelativeTime(release.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
