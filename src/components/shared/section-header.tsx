import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  size?: "page" | "section";
  tone?: "default" | "inverse";
  className?: string;
};

export function SectionHeader({
  title,
  description,
  eyebrow,
  actions,
  size = "section",
  tone = "default",
  className
}: SectionHeaderProps) {
  const TitleTag = size === "page" ? "h1" : "h2";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.28em]",
              tone === "inverse" ? "text-primary" : "text-primary/80"
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <TitleTag
          className={cn(
            "font-heading font-semibold tracking-tight",
            tone === "inverse" ? "text-white" : "text-foreground",
            size === "page" ? "text-4xl sm:text-5xl" : "text-2xl"
          )}
        >
          {title}
        </TitleTag>
        {description ? (
          <p
            className={cn(
              "max-w-3xl",
              tone === "inverse" ? "text-white/70" : "text-muted-foreground",
              size === "page" ? "text-sm sm:text-base" : "text-sm"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="w-full md:w-auto md:shrink-0">{actions}</div> : null}
    </div>
  );
}
