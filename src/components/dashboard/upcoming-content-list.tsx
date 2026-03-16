import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  contentFormatLabels,
  contentPlatformLabels,
  contentStatusLabels
} from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { cn, formatDate } from "@/lib/utils";

type UpcomingContentListProps = {
  items: Array<{
    id: string;
    title: string;
    platform: keyof typeof contentPlatformLabels;
    format: keyof typeof contentFormatLabels;
    status: keyof typeof contentStatusLabels;
    dueDate: Date;
    campaign: {
      id: string;
      name: string;
    } | null;
    release: {
      id: string;
      title: string;
    } | null;
  }>;
};

export function UpcomingContentList({ items }: UpcomingContentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming content</CardTitle>
        <CardDescription>
          The next pieces of promo work across campaigns and release moments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-background/45 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                      <CalendarDays className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {contentPlatformLabels[item.platform]} - {contentFormatLabels[item.format]}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Due {formatDate(item.dueDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.campaign?.name ?? item.release?.title ?? "Standalone content"}
                  </p>
                </div>
                <Badge variant={getStatusVariant(item.status)}>
                  {contentStatusLabels[item.status]}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No upcoming content"
            description="Add a content item to make the release calendar visible from the dashboard."
            action={
              <Link
                href="/content"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
              >
                View content
              </Link>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
