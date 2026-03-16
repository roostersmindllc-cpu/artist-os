import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  contentFormatLabels,
  contentPlatformLabels,
  contentStatusLabels
} from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { cn, formatDate } from "@/lib/utils";
import type { ContentPlannerItemDto } from "@/services/content-types";

const platformToneClasses = {
  INSTAGRAM: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  TIKTOK: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  YOUTUBE: "bg-red-500/10 text-red-700 dark:text-red-300",
  X: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  EMAIL: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  OTHER: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300"
} as const;

type ContentEventCardProps = {
  item: ContentPlannerItemDto;
  variant?: "compact" | "default";
  className?: string;
};

export function ContentEventCard({
  item,
  variant = "default",
  className
}: ContentEventCardProps) {
  const compact = variant === "compact";

  return (
    <Link href={item.href} className={cn("block", className)}>
      <Card
        className={cn(
          "overflow-hidden border-border/70 bg-card/90 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-primary/30",
          compact ? "rounded-xl" : "rounded-2xl"
        )}
      >
        <CardContent className={cn(compact ? "space-y-2 p-3" : "space-y-3 p-4")}>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                platformToneClasses[item.platform]
              )}
            >
              {contentPlatformLabels[item.platform]}
            </span>
            <Badge variant={getStatusVariant(item.status)}>
              {contentStatusLabels[item.status]}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className={cn("font-medium text-foreground", compact ? "text-sm" : "text-base")}>
              {item.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {contentFormatLabels[item.format]} - Due {formatDate(item.dueDate)}
            </p>
          </div>
          {!compact ? (
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{item.campaign?.name ?? "No linked campaign"}</p>
              <p>{item.release?.title ?? "No linked release"}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
