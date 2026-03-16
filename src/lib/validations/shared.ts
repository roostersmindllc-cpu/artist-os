import { z } from "zod";

const dateInputPattern = /^\d{4}-\d{2}-\d{2}$/;

export const optionalText = z.string().trim().max(500).optional().or(z.literal(""));
export const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL.")
  .optional()
  .or(z.literal(""));

export function emptyToNull(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function stringToDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function isValidDateInput(value: string) {
  if (!dateInputPattern.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .optional()
  .or(z.literal(""));

export function parseOptionalJson(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return JSON.parse(trimmed) as Record<string, unknown>;
}
