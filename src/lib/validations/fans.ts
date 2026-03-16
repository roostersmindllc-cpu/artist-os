import { z } from "zod";

import {
  emptyToNull,
  optionalEmail,
  optionalText
} from "@/lib/validations/shared";

function normalizeTagValue(tag: string) {
  return tag.trim().toLowerCase();
}

export const fanFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Fan name is required.")
    .max(120, "Fan name must be 120 characters or fewer."),
  email: optionalEmail,
  handle: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(40)).max(20, "Use 20 tags or fewer."),
  engagementScore: z.number().int().min(0).max(100),
  notes: optionalText
});

export type FanFormValues = z.infer<typeof fanFormSchema>;

export const fanListFiltersSchema = z.object({
  query: z.string().trim().max(120).optional().or(z.literal("")),
  tag: z.string().trim().max(40).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal(""))
});

export type FanListFiltersValues = {
  query?: string;
  tag?: string;
  city?: string;
};

export function normalizeFanListFilters(
  values: z.infer<typeof fanListFiltersSchema>
): FanListFiltersValues {
  return {
    query: values.query || undefined,
    tag: values.tag || undefined,
    city: values.city || undefined
  };
}

export function normalizeFanInput(values: FanFormValues) {
  return {
    name: values.name,
    email: values.email ? values.email.trim().toLowerCase() : null,
    handle: emptyToNull(values.handle),
    city: emptyToNull(values.city),
    tags: [...new Set(values.tags.map(normalizeTagValue).filter(Boolean))],
    engagementScore: values.engagementScore,
    notes: emptyToNull(values.notes)
  };
}

export function buildFanFormValues(values: {
  name: string;
  email: string | null;
  handle: string | null;
  city: string | null;
  tags: string[];
  engagementScore: number;
  notes: string | null;
}): FanFormValues {
  return {
    name: values.name,
    email: values.email ?? "",
    handle: values.handle ?? "",
    city: values.city ?? "",
    tags: values.tags,
    engagementScore: values.engagementScore,
    notes: values.notes ?? ""
  };
}
