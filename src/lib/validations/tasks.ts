import { z } from "zod";

import {
  taskPriorityValues,
  taskRelatedTypeValues,
  taskStatusValues
} from "@/lib/domain-config";
import {
  emptyToNull,
  isValidDateInput,
  optionalText,
  stringToDate
} from "@/lib/validations/shared";

export const taskFormSchema = z.object({
  title: z.string().trim().min(2, "Task title is required."),
  description: optionalText,
  dueDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || isValidDateInput(value), "Enter a valid due date."),
  priority: z.enum(taskPriorityValues),
  status: z.enum(taskStatusValues),
  relatedType: z.enum(taskRelatedTypeValues).optional().or(z.literal("")),
  relatedId: z.string().trim().max(120).optional().or(z.literal(""))
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export function normalizeTaskInput(values: TaskFormValues) {
  return {
    title: values.title,
    description: emptyToNull(values.description),
    dueDate: values.dueDate ? stringToDate(values.dueDate) : null,
    priority: values.priority,
    status: values.status,
    relatedType: values.relatedType ? values.relatedType : null,
    relatedId: emptyToNull(values.relatedId)
  };
}

