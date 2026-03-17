"use client";

import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DialogShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  icon?: LucideIcon;
  size?: "md" | "lg" | "xl";
};

const dialogWidthClasses = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl"
} as const;

export function DialogShell({
  open,
  onOpenChange,
  title,
  description,
  children,
  icon: Icon,
  size = "lg"
}: DialogShellProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-shell-title"
        className={cn(
          "relative z-10 flex max-h-[min(92vh,860px)] w-full flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-popover/96 shadow-2xl",
          dialogWidthClasses[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {Icon ? (
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
                <Icon className="size-5" />
              </span>
            ) : null}
            <div className="min-w-0 space-y-1">
              <h2
                id="dialog-shell-title"
                className="font-heading text-xl font-semibold tracking-tight"
              >
                {title}
              </h2>
              {description ? (
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Close dialog"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
