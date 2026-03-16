import Link from "next/link";

import { TaskForm } from "@/components/forms/task-form";
import { TaskList } from "@/components/tasks/task-list";
import { DataTableCard } from "@/components/shared/data-table-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getTasksForUser } from "@/services/tasks-service";

export default async function TasksPage() {
  const user = await requireUser();
  const tasks = await getTasksForUser(user.id);

  return (
    <PageContainer
      title="Tasks"
      description="Tasks stay generic, but can point back to the release system through related type and record ID."
      eyebrow="Execution flow"
    >
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <TaskForm />
        <DataTableCard
          title="Task list"
          description="See status, priority, and related record context in one operational queue."
          hasData={tasks.length > 0}
          emptyState={
            <EmptyState
              title="No tasks yet"
              description="Create a task to keep day-to-day release operations visible and traceable."
              action={
                <Link
                  href="#task-composer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-2xl"
                  )}
                >
                  Create task
                </Link>
              }
            />
          }
        >
          <TaskList tasks={tasks} />
        </DataTableCard>
      </div>
    </PageContainer>
  );
}
