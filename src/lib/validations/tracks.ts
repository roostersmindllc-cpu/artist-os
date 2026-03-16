import { z } from "zod";

import { trackStatusValues } from "@/lib/domain-config";
import { emptyToNull } from "@/lib/validations/shared";

const isrcPattern = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/i;

export const trackFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Track title is required.")
    .max(120, "Track title must be 120 characters or fewer."),
  durationSeconds: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^\d+$/.test(value), "Duration must be whole seconds.")
    .refine(
      (value) => !value || (Number(value) > 0 && Number(value) <= 36000),
      "Duration must be between 1 and 36000 seconds."
    ),
  isrc: z
    .string()
    .trim()
    .max(12, "ISRC must be 12 characters or fewer.")
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || isrcPattern.test(value), "Enter a valid ISRC."),
  versionName: z.string().trim().max(80).optional().or(z.literal("")),
  status: z.enum(trackStatusValues)
});

export type TrackFormValues = z.infer<typeof trackFormSchema>;

export function normalizeTrackInput(values: TrackFormValues) {
  return {
    title: values.title,
    durationSeconds: values.durationSeconds ? Number(values.durationSeconds) : null,
    isrc: values.isrc ? values.isrc.trim().toUpperCase() : null,
    versionName: emptyToNull(values.versionName),
    status: values.status
  };
}

export function buildTrackFormValues(values: {
  title: string;
  durationSeconds: number | null;
  isrc: string | null;
  versionName: string | null;
  status: TrackFormValues["status"];
}): TrackFormValues {
  return {
    title: values.title,
    durationSeconds: values.durationSeconds ? String(values.durationSeconds) : "",
    isrc: values.isrc ?? "",
    versionName: values.versionName ?? "",
    status: values.status
  };
}
