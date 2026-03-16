import type { LucideIcon } from "lucide-react";

type FormCalloutProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function FormCallout({ title, description, icon: Icon }: FormCalloutProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-background/45 p-4 text-sm text-muted-foreground">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <div className="space-y-1">
          <p className="font-medium text-foreground">{title}</p>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
