import { format } from "date-fns";
import { z } from "zod";

import { campaignStatusValues } from "@/lib/domain-config";
import {
  emptyToNull,
  isValidDateInput,
  optionalText,
  stringToDate
} from "@/lib/validations/shared";

const optionalBudgetInput = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || /^\d+$/.test(value), "Budget must be a whole number.")
  .refine(
    (value) => !value || Number(value) <= 100000000,
    "Budget must be 100000000 or fewer."
  );

export const campaignFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Campaign name is required.")
      .max(120, "Campaign name must be 120 characters or fewer."),
    objective: z
      .string()
      .trim()
      .min(6, "Objective is required.")
      .max(160, "Objective must be 160 characters or fewer."),
    budget: optionalBudgetInput,
    startDate: z
      .string()
      .min(1, "Start date is required.")
      .refine(isValidDateInput, "Enter a valid start date."),
    endDate: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((value) => !value || isValidDateInput(value), "Enter a valid end date."),
    status: z.enum(campaignStatusValues),
    notes: optionalText,
    releaseId: z.string().trim().max(120).optional().or(z.literal(""))
  })
  .refine(
    (values) =>
      !values.endDate ||
      stringToDate(values.endDate).getTime() >= stringToDate(values.startDate).getTime(),
    {
      message: "End date must be on or after the start date.",
      path: ["endDate"]
    }
  );

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export const campaignListFiltersSchema = z.object({
  status: z.enum(campaignStatusValues).optional().or(z.literal(""))
});

export type CampaignListFiltersValues = {
  status?: (typeof campaignStatusValues)[number];
};

export function normalizeCampaignListFilters(
  values: z.infer<typeof campaignListFiltersSchema>
) {
  return {
    status: values.status || undefined
  };
}

export function normalizeCampaignInput(values: CampaignFormValues) {
  return {
    releaseId: emptyToNull(values.releaseId),
    name: values.name,
    objective: values.objective,
    budget: values.budget ? Number(values.budget) : null,
    startDate: stringToDate(values.startDate),
    endDate: values.endDate ? stringToDate(values.endDate) : null,
    status: values.status,
    notes: emptyToNull(values.notes)
  };
}

export function buildCampaignFormValues(values: {
  releaseId: string | null;
  name: string;
  objective: string;
  budget: number | null;
  startDate: Date;
  endDate: Date | null;
  status: CampaignFormValues["status"];
  notes: string | null;
}): CampaignFormValues {
  return {
    releaseId: values.releaseId ?? "",
    name: values.name,
    objective: values.objective,
    budget: values.budget !== null ? String(values.budget) : "",
    startDate: format(values.startDate, "yyyy-MM-dd"),
    endDate: values.endDate ? format(values.endDate, "yyyy-MM-dd") : "",
    status: values.status,
    notes: values.notes ?? ""
  };
}
