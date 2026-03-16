"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckSquare2, Link2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTaskAction } from "@/app/actions/task-actions";
import { FieldError } from "@/components/shared/field-error";
import { FieldHint } from "@/components/shared/field-hint";
import { FormCallout } from "@/components/shared/form-callout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  taskPriorityLabels,
  taskPriorityValues,
  taskRelatedTypeLabels,
  taskRelatedTypeValues,
  taskStatusLabels,
  taskStatusValues
} from "@/lib/domain-config";
import { taskFormSchema, type TaskFormValues } from "@/lib/validations/tasks";

const defaultValues: TaskFormValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: "MEDIUM",
  status: "TODO",
  relatedType: "",
  relatedId: ""
};

export function TaskForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createTaskAction(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      form.reset(defaultValues);
      router.refresh();
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add task</CardTitle>
        <CardDescription>
          Operational tasks can optionally point at a release, campaign, content
          item, or fan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="task-composer" className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="Finalize distributor metadata"
              {...form.register("title")}
            />
            <FieldHint>
              Write the next concrete action the team can complete.
            </FieldHint>
            <FieldError message={form.formState.errors.title?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              rows={4}
              {...form.register("description")}
            />
            <FieldHint>
              Optional context, dependencies, or delivery notes for whoever owns
              the task.
            </FieldHint>
            <FieldError message={form.formState.errors.description?.message} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-status">Status</Label>
              <Select id="task-status" {...form.register("status")}>
                {taskStatusValues.map((value) => (
                  <option key={value} value={value}>
                    {taskStatusLabels[value]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Use status to keep the queue honest and readable on the
                dashboard.
              </FieldHint>
              <FieldError message={form.formState.errors.status?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select id="task-priority" {...form.register("priority")}>
                {taskPriorityValues.map((value) => (
                  <option key={value} value={value}>
                    {taskPriorityLabels[value]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Priority helps the weekly queue sort itself when deadlines stack
                up.
              </FieldHint>
              <FieldError message={form.formState.errors.priority?.message} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due date</Label>
              <Input
                id="task-due-date"
                type="date"
                {...form.register("dueDate")}
              />
              <FieldHint>
                Leave blank if the task matters but does not have a fixed
                deadline yet.
              </FieldHint>
              <FieldError message={form.formState.errors.dueDate?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-related-type">Related type</Label>
              <Select id="task-related-type" {...form.register("relatedType")}>
                <option value="">No link</option>
                {taskRelatedTypeValues.map((value) => (
                  <option key={value} value={value}>
                    {taskRelatedTypeLabels[value]}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Optional reference so the task can point back to the relevant
                record type.
              </FieldHint>
              <FieldError
                message={form.formState.errors.relatedType?.message}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-related-id">Related record ID</Label>
            <Input
              id="task-related-id"
              placeholder="Paste the linked record ID if you want a hard reference"
              {...form.register("relatedId")}
            />
            <FieldHint>
              Only needed when you want the task to reference a specific record.
            </FieldHint>
            <FieldError message={form.formState.errors.relatedId?.message} />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <CheckSquare2 className="size-4" />
            )}
            {isPending ? "Saving task..." : "Create task"}
          </Button>
          <FormCallout
            title="Flexible linking for MVP operations"
            description="Tasks stay lightweight on purpose. You can leave them standalone or tie them back to a release, campaign, content item, or fan record when it helps."
            icon={Link2}
          />
        </form>
      </CardContent>
    </Card>
  );
}
