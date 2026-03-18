import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import {
  artistOsSurfaceVariants,
  artistOsWhiteBoardBodyClassName
} from "@/components/shared/artist-os-surfaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string | null;
  action?: ReactNode;
  icon?: LucideIcon;
  variant?: "inline" | "card";
};

export function EmptyState({
  title,
  description,
  actionLabel = "Add your first item",
  action,
  icon: Icon = Sparkles,
  variant = "inline"
}: EmptyStateProps) {
  const content = (
    <div
      className={cn(
        artistOsSurfaceVariants({ tone: "whiteBoard" }),
        artistOsWhiteBoardBodyClassName,
        "relative overflow-hidden rounded-[1.9rem] p-6"
      )}
    >
      <div className="relative flex flex-col items-start gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-black/12 bg-black text-white shadow-sm">
          <Icon className="size-5" />
        </span>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Next best move
          </p>
          <h3 className="font-heading text-3xl font-semibold">{title}</h3>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {action
          ? action
          : actionLabel ? (
              <Button variant="outline" disabled>
                {actionLabel}
              </Button>
            ) : null}
      </div>
    </div>
  );

  if (variant === "card") {
    return (
      <Card className="border-dashed border-black/12 bg-card/90">
        <CardContent className="p-6">{content}</CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[1.9rem] border border-dashed border-black/12 bg-background/55 p-6"
      )}
    >
      {content}
    </div>
  );
}
