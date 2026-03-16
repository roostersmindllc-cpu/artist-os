import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  parseISO,
  startOfMonth,
  startOfWeek
} from "date-fns";
import type { Route } from "next";

import type { ContentPlannerRangeDto, ContentPlannerView } from "@/services/content-types";

export function getContentRoute(contentItemId: string) {
  return `/content/${contentItemId}` as Route;
}

export function normalizeContentPlannerView(value: string | undefined): ContentPlannerView {
  if (value === "week" || value === "list") {
    return value;
  }

  return "month";
}

export function parseContentAnchorDate(value: string | undefined) {
  if (!value) {
    return new Date();
  }

  const parsed = parseISO(`${value}T00:00:00`);
  return isValid(parsed) ? parsed : new Date();
}

export function buildContentPlannerRange(
  view: ContentPlannerView,
  anchorDate: Date
): ContentPlannerRangeDto {
  if (view === "week") {
    const start = startOfWeek(anchorDate);
    const end = endOfWeek(anchorDate);

    return {
      anchorDate,
      start,
      end,
      heading: `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`,
      subheading: "Week view"
    };
  }

  const start = startOfMonth(anchorDate);
  const end = endOfMonth(anchorDate);

  return {
    anchorDate,
    start,
    end,
    heading: format(anchorDate, "MMMM yyyy"),
    subheading: view === "list" ? "List view" : "Month view"
  };
}

export function getContentPlannerShiftedDate(
  view: ContentPlannerView,
  anchorDate: Date,
  direction: "previous" | "next"
) {
  const modifier = direction === "next" ? 1 : -1;

  if (view === "week") {
    return addWeeks(anchorDate, modifier);
  }

  return addMonths(anchorDate, modifier);
}

export function formatPlannerDateParam(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function buildContentPlannerHref(
  params: {
    view: ContentPlannerView;
    date: string;
    platform?: string;
    status?: string;
    campaignId?: string;
    releaseId?: string;
  },
  overrides: Partial<{
    view: ContentPlannerView;
    date: string;
    platform: string;
    status: string;
    campaignId: string;
    releaseId: string;
  }> = {}
) {
  const searchParams = new URLSearchParams();
  const nextParams = {
    ...params,
    ...overrides
  };

  searchParams.set("view", nextParams.view);
  searchParams.set("date", nextParams.date);

  if (nextParams.platform) {
    searchParams.set("platform", nextParams.platform);
  }

  if (nextParams.status) {
    searchParams.set("status", nextParams.status);
  }

  if (nextParams.campaignId) {
    searchParams.set("campaignId", nextParams.campaignId);
  }

  if (nextParams.releaseId) {
    searchParams.set("releaseId", nextParams.releaseId);
  }

  return `/content?${searchParams.toString()}` as Route;
}
