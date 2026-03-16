import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  const date =
    typeof value === "string" && dateOnlyPattern.test(value)
      ? new Date(`${value}T00:00:00`)
      : new Date(value);

  return format(date, "MMM d, yyyy");
}

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatMetricValue(metricName: string, value: number) {
  switch (metricName) {
    case "ENGAGEMENT_RATE":
      return formatPercent(value);
    case "REVENUE_USD":
      return formatCurrency(value);
    default:
      return formatCompactNumber(value);
  }
}

export function formatRelativeTime(value: Date | string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function formatDurationSeconds(value: number | null | undefined) {
  if (!value) {
    return "Not set";
  }

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getInitials(name: string | null | undefined) {
  if (!name) {
    return "AO";
  }

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function titleCaseLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
