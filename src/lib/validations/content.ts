import { format } from "date-fns";
import { z } from "zod";

import {
  contentFormatValues,
  contentPlatformValues,
  contentStatusValues
} from "@/lib/domain-config";
import {
  emptyToNull,
  isValidDateInput,
  optionalText,
  optionalUrl,
  stringToDate
} from "@/lib/validations/shared";

export const contentFormSchema = z.object({
  platform: z.enum(contentPlatformValues),
  format: z.enum(contentFormatValues),
  title: z
    .string()
    .trim()
    .min(2, "Content title is required.")
    .max(120, "Content title must be 120 characters or fewer."),
  caption: optionalText,
  dueDate: z
    .string()
    .min(1, "Due date is required.")
    .refine(isValidDateInput, "Enter a valid due date."),
  publishedAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || isValidDateInput(value), "Enter a valid publish date."),
  status: z.enum(contentStatusValues),
  campaignId: z.string().trim().max(120).optional().or(z.literal("")),
  releaseId: z.string().trim().max(120).optional().or(z.literal("")),
  assetUrl: optionalUrl
});

export type ContentFormValues = z.infer<typeof contentFormSchema>;

export const contentPlannerFiltersSchema = z.object({
  view: z.enum(["month", "week", "list"]).optional().or(z.literal("")),
  date: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || isValidDateInput(value), "Enter a valid calendar date."),
  platform: z.enum(contentPlatformValues).optional().or(z.literal("")),
  status: z.enum(contentStatusValues).optional().or(z.literal("")),
  campaignId: z.string().trim().max(120).optional().or(z.literal("")),
  releaseId: z.string().trim().max(120).optional().or(z.literal(""))
});

export type ContentPlannerFiltersValues = {
  platform?: (typeof contentPlatformValues)[number];
  status?: (typeof contentStatusValues)[number];
  campaignId?: string;
  releaseId?: string;
};

export function normalizeContentPlannerFilters(
  values: z.infer<typeof contentPlannerFiltersSchema>
) {
  return {
    view: values.view || undefined,
    date: values.date || undefined,
    platform: values.platform || undefined,
    status: values.status || undefined,
    campaignId: values.campaignId || undefined,
    releaseId: values.releaseId || undefined
  };
}

export function normalizeContentInput(values: ContentFormValues) {
  return {
    campaignId: emptyToNull(values.campaignId),
    releaseId: emptyToNull(values.releaseId),
    platform: values.platform,
    format: values.format,
    title: values.title,
    caption: emptyToNull(values.caption),
    dueDate: stringToDate(values.dueDate),
    publishedAt: values.publishedAt ? stringToDate(values.publishedAt) : null,
    status: values.status,
    assetUrl: emptyToNull(values.assetUrl)
  };
}

export function buildContentFormValues(values: {
  campaignId: string | null;
  releaseId: string | null;
  platform: ContentFormValues["platform"];
  format: ContentFormValues["format"];
  title: string;
  caption: string | null;
  dueDate: Date;
  publishedAt: Date | null;
  status: ContentFormValues["status"];
  assetUrl: string | null;
}): ContentFormValues {
  return {
    campaignId: values.campaignId ?? "",
    releaseId: values.releaseId ?? "",
    platform: values.platform,
    format: values.format,
    title: values.title,
    caption: values.caption ?? "",
    dueDate: format(values.dueDate, "yyyy-MM-dd"),
    publishedAt: values.publishedAt ? format(values.publishedAt, "yyyy-MM-dd") : "",
    status: values.status,
    assetUrl: values.assetUrl ?? ""
  };
}
