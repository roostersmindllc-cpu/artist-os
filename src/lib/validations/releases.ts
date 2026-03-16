import { format } from "date-fns";
import { z } from "zod";

import { releaseStatusValues, releaseTypeValues } from "@/lib/domain-config";
import {
  emptyToNull,
  isValidDateInput,
  optionalText,
  optionalUrl,
  stringToDate
} from "@/lib/validations/shared";

export const releaseFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title is required.")
    .max(120, "Title must be 120 characters or fewer."),
  type: z.enum(releaseTypeValues),
  status: z.enum(releaseStatusValues),
  releaseDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || isValidDateInput(value), "Enter a valid release date."),
  distributor: z.string().trim().max(120).optional().or(z.literal("")),
  coverArtUrl: optionalUrl,
  description: optionalText
});

export type ReleaseFormValues = z.infer<typeof releaseFormSchema>;

export const releaseListFiltersSchema = z.object({
  status: z.enum(releaseStatusValues).optional().or(z.literal("")),
  type: z.enum(releaseTypeValues).optional().or(z.literal(""))
});

export type ReleaseListFiltersValues = {
  status?: (typeof releaseStatusValues)[number];
  type?: (typeof releaseTypeValues)[number];
};

export function normalizeReleaseListFilters(values: z.infer<typeof releaseListFiltersSchema>) {
  return {
    status: values.status || undefined,
    type: values.type || undefined
  };
}

export function normalizeReleaseInput(values: ReleaseFormValues) {
  return {
    ...values,
    releaseDate: values.releaseDate ? stringToDate(values.releaseDate) : null,
    distributor: emptyToNull(values.distributor),
    coverArtUrl: emptyToNull(values.coverArtUrl),
    description: emptyToNull(values.description)
  };
}

export function buildReleaseFormValues(values: {
  title: string;
  type: ReleaseFormValues["type"];
  status: ReleaseFormValues["status"];
  releaseDate: Date | null;
  distributor: string | null;
  coverArtUrl: string | null;
  description: string | null;
}): ReleaseFormValues {
  return {
    title: values.title,
    type: values.type,
    status: values.status,
    releaseDate: values.releaseDate ? format(values.releaseDate, "yyyy-MM-dd") : "",
    distributor: values.distributor ?? "",
    coverArtUrl: values.coverArtUrl ?? "",
    description: values.description ?? ""
  };
}
