import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

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
    <div className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(233,76,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.12),transparent_34%),rgba(255,255,255,0.32)] p-6 dark:bg-[radial-gradient(circle_at_top_left,rgba(233,76,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.1),transparent_34%),rgba(9,20,34,0.38)]">
      <div className="relative flex flex-col items-start gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
          <Icon className="size-5" />
        </span>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Next best move
          </p>
          <h3 className="font-heading text-lg font-semibold">{title}</h3>
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
      <Card className="border-dashed border-border/70 bg-card/80">
        <CardContent className="p-6">{content}</CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/70 bg-background/35 p-6"
      )}
    >
      {content}
    </div>
  );
}
