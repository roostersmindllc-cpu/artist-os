"use client";

import { Compass, Keyboard, PlusSquare } from "lucide-react";

import { DialogShell } from "@/components/ui/dialog-shell";

type KeyboardShortcutsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const navigationShortcuts = [
  { keys: ["G", "D"], label: "Go to dashboard" },
  { keys: ["G", "R"], label: "Go to releases" },
  { keys: ["G", "M"], label: "Go to campaigns" },
  { keys: ["G", "C"], label: "Go to content" },
  { keys: ["G", "F"], label: "Go to fans" },
  { keys: ["G", "T"], label: "Go to tasks" },
  { keys: ["G", "A"], label: "Go to analytics" },
  { keys: ["G", "S"], label: "Go to settings" }
] as const;

const creationShortcuts = [
  { keys: ["N", "R"], label: "Add release" },
  { keys: ["N", "P"], label: "Schedule post" },
  { keys: ["N", "F"], label: "Add fan" },
  { keys: ["N", "A"], label: "Log analytics" },
  { keys: ["?"], label: "Open this shortcuts sheet" },
  { keys: ["Esc"], label: "Close an open sheet or modal" }
] as const;

function KeyCaps({ keys }: { keys: readonly string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {keys.map((key) => (
        <span
          key={key}
          className="inline-flex min-w-9 items-center justify-center rounded-xl border border-border/70 bg-background/80 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm"
        >
          {key}
        </span>
      ))}
    </div>
  );
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange
}: KeyboardShortcutsDialogProps) {
  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Keyboard shortcuts"
      description="Artist OS now has a lightweight keyboard layer for fast navigation and quick capture."
      icon={Keyboard}
      size="md"
    >
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-border/70 bg-background/45 p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
              <Compass className="size-4" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-semibold">Navigation</h3>
              <p className="text-sm text-muted-foreground">
                Press G, then a letter, to jump between core workspaces.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {navigationShortcuts.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/80 p-3"
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <KeyCaps keys={item.keys} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-border/70 bg-background/45 p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
              <PlusSquare className="size-4" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-semibold">Quick add</h3>
              <p className="text-sm text-muted-foreground">
                Press N, then a letter, to capture new work without leaving your current page.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {creationShortcuts.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/80 p-3"
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <KeyCaps keys={item.keys} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogShell>
  );
}
