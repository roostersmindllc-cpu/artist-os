import { format, subDays } from "date-fns";
import { z } from "zod";

import { metricNameValues, metricSourceValues } from "@/lib/domain-config";
import {
  isValidDateInput,
  parseOptionalJson,
  stringToDate
} from "@/lib/validations/shared";

export const analyticsFormSchema = z.object({
  recordedAt: z
    .string()
    .min(1, "Recorded date is required.")
    .refine(isValidDateInput, "Enter a valid date."),
  source: z.enum(metricSourceValues),
  metricName: z.enum(metricNameValues),
  metricValue: z.number().min(0, "Metric value cannot be negative."),
  metadata: z.string().trim().max(2000).optional().or(z.literal(""))
});

export type AnalyticsFormValues = z.infer<typeof analyticsFormSchema>;

export const analyticsFiltersSchema = z
  .object({
    source: z.enum(metricSourceValues).optional(),
    metricName: z.enum(metricNameValues).optional(),
    from: z.string().optional().or(z.literal("")),
    to: z.string().optional().or(z.literal(""))
  })
  .superRefine((values, context) => {
    if (values.from && !isValidDateInput(values.from)) {
      context.addIssue({
        code: "custom",
        path: ["from"],
        message: "Enter a valid start date."
      });
    }

    if (values.to && !isValidDateInput(values.to)) {
      context.addIssue({
        code: "custom",
        path: ["to"],
        message: "Enter a valid end date."
      });
    }

    if (values.from && values.to) {
      const fromDate = stringToDate(values.from);
      const toDate = stringToDate(values.to);

      if (fromDate.getTime() > toDate.getTime()) {
        context.addIssue({
          code: "custom",
          path: ["to"],
          message: "End date must be on or after the start date."
        });
      }
    }
  });

export type AnalyticsFiltersInput = z.infer<typeof analyticsFiltersSchema>;

export type AnalyticsFiltersValues = {
  source: (typeof metricSourceValues)[number];
  metricName: (typeof metricNameValues)[number];
  from: string;
  to: string;
  fromDate: Date;
  toDate: Date;
};

export function getDefaultAnalyticsFilters() {
  const toDate = new Date();
  const fromDate = subDays(toDate, 89);

  return {
    source: "SPOTIFY" as const,
    metricName: "STREAMS" as const,
    from: format(fromDate, "yyyy-MM-dd"),
    to: format(toDate, "yyyy-MM-dd")
  };
}

export function normalizeAnalyticsFilters(
  values: AnalyticsFiltersInput
): AnalyticsFiltersValues {
  const defaults = getDefaultAnalyticsFilters();
  const from = values.from || defaults.from;
  const to = values.to || defaults.to;

  return {
    source: values.source ?? defaults.source,
    metricName: values.metricName ?? defaults.metricName,
    from,
    to,
    fromDate: stringToDate(from),
    toDate: stringToDate(to)
  };
}

export function normalizeAnalyticsInput(values: AnalyticsFormValues) {
  let metadata: Record<string, unknown> | null = null;

  if (values.metadata) {
    try {
      metadata = parseOptionalJson(values.metadata);
    } catch {
      metadata = {
        raw: values.metadata.trim()
      };
    }
  }

  return {
    recordedAt: stringToDate(values.recordedAt),
    source: values.source,
    metricName: values.metricName,
    metricValue: values.metricValue,
    metadata
  };
}
