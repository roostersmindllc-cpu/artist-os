import type {
  CampaignStatus,
  ContentFormat,
  ContentPlatform,
  ContentStatus,
  ReleaseStatus,
  ReleaseType
} from "@prisma/client";
import type { Route } from "next";

export type ContentPlannerView = "month" | "week" | "list";

export type ContentLinkedCampaignDto = {
  id: string;
  name: string;
  status: CampaignStatus;
  startDate: Date;
  endDate: Date | null;
};

export type ContentReleaseLinkDto = {
  id: string;
  title: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate: Date | null;
};

export type ContentCampaignOptionDto = {
  id: string;
  name: string;
  status: CampaignStatus;
  startDate: Date;
  endDate: Date | null;
  release: {
    id: string;
    title: string;
  } | null;
};

export type ContentReleaseOptionDto = ContentReleaseLinkDto;

export type ContentPlannerItemDto = {
  id: string;
  campaignId: string | null;
  releaseId: string | null;
  platform: ContentPlatform;
  format: ContentFormat;
  title: string;
  caption: string | null;
  dueDate: Date;
  publishedAt: Date | null;
  status: ContentStatus;
  assetUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  href: Route;
  campaign: ContentLinkedCampaignDto | null;
  release: ContentReleaseLinkDto | null;
};

export type ContentPlannerOptionsDto = {
  campaigns: ContentCampaignOptionDto[];
  releases: ContentReleaseOptionDto[];
};

export type ContentPlannerRangeDto = {
  anchorDate: Date;
  start: Date;
  end: Date;
  heading: string;
  subheading: string;
};

export type ContentDetailDto = ContentPlannerItemDto;
