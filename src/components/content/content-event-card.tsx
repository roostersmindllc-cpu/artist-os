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
  INSTAGRAM: "border-fuchsia-300/60 bg-fuchsia-200/55 text-foreground",
  TIKTOK: "border-primary/40 bg-primary/15 text-foreground",
  YOUTUBE: "border-rose-300/60 bg-rose-200/55 text-foreground",
  X: "border-black/12 bg-black/8 text-foreground",
  EMAIL: "border-amber-300/60 bg-amber-200/55 text-foreground",
  OTHER: "border-black/12 bg-background/80 text-foreground"
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
          "overflow-hidden border-2 border-black/12 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-0.5 hover:border-primary/30",
          compact ? "rounded-xl" : "rounded-2xl"
        )}
      >
        <CardContent className={cn(compact ? "space-y-2 p-3" : "space-y-3 p-4")}>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
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
