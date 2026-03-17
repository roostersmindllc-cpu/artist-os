import Link from "next/link";
import { ArrowRight, CheckSquare } from "lucide-react";

import { DashboardWidgetShell } from "@/components/dashboard/dashboard-widget-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { taskPriorityLabels, taskRelatedTypeLabels, taskStatusLabels } from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { cn } from "@/lib/utils";

type TasksDueTodayListProps = {
  totalCount: number;
  items: Array<{
    id: string;
    title: string;
    priority: keyof typeof taskPriorityLabels;
    status: keyof typeof taskStatusLabels;
    dueDate: Date | null;
    relatedType: keyof typeof taskRelatedTypeLabels | null;
  }>;
};

export function TasksDueTodayList({
  totalCount,
  items
}: TasksDueTodayListProps) {
  return (
    <DashboardWidgetShell
      title="Tasks due today"
      description="The work that should be closed or moved forward before the day is over."
      icon={CheckSquare}
      countLabel={`${totalCount} due`}
    >
      <div className="flex-1 space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/70 bg-background/45 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.relatedType
                      ? `${taskRelatedTypeLabels[item.relatedType]} task`
                      : "General task"}
                  </p>
                  <p className="text-sm text-muted-foreground">Due today</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Badge variant={getStatusVariant(item.priority)}>
                    {taskPriorityLabels[item.priority]}
                  </Badge>
                  <Badge variant={getStatusVariant(item.status)}>
                    {taskStatusLabels[item.status]}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="Nothing due today"
            description="The task list is clear for today. Pull forward something from the week or log the next priority."
            action={
              <Link
                href="/tasks"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
              >
                Open tasks
              </Link>
            }
          />
        )}
      </div>

      {items.length > 0 ? (
        <Link
          href="/tasks"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-auto rounded-2xl border-border/70"
          )}
        >
          Open task list
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </DashboardWidgetShell>
  );
}
