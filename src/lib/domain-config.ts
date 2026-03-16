export const releaseTypeValues = ["SINGLE", "EP", "ALBUM"] as const;
export const releaseStatusValues = [
  "IDEA",
  "IN_PROGRESS",
  "SCHEDULED",
  "RELEASED",
  "ARCHIVED"
] as const;
export const trackStatusValues = [
  "DRAFT",
  "MIXING",
  "MASTERED",
  "DISTRIBUTED",
  "RELEASED",
  "ARCHIVED"
] as const;
export const campaignStatusValues = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED"
] as const;
export const contentPlatformValues = [
  "INSTAGRAM",
  "TIKTOK",
  "YOUTUBE",
  "EMAIL",
  "X",
  "OTHER"
] as const;
export const contentFormatValues = [
  "SHORT_VIDEO",
  "STATIC_POST",
  "CAROUSEL",
  "STORY",
  "EMAIL_BLAST",
  "PRESS_ASSET",
  "OTHER"
] as const;
export const contentStatusValues = [
  "DRAFT",
  "IN_REVIEW",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED"
] as const;
export const taskRelatedTypeValues = [
  "RELEASE",
  "TRACK",
  "CAMPAIGN",
  "CONTENT_ITEM",
  "FAN"
] as const;
export const taskStatusValues = ["TODO", "IN_PROGRESS", "DONE", "CANCELED"] as const;
export const taskPriorityValues = ["LOW", "MEDIUM", "HIGH"] as const;
export const metricSourceValues = [
  "SPOTIFY",
  "APPLE_MUSIC",
  "YOUTUBE",
  "INSTAGRAM",
  "TIKTOK",
  "MAILING_LIST",
  "MANUAL"
] as const;
export const metricNameValues = [
  "STREAMS",
  "FOLLOWERS",
  "ENGAGEMENT_RATE",
  "REVENUE_USD",
  "PRE_SAVES",
  "TICKET_SALES",
  "EMAIL_SUBSCRIBERS"
] as const;

export const releaseTypeLabels = {
  SINGLE: "Single",
  EP: "EP",
  ALBUM: "Album"
} as const;

export const releaseStatusLabels = {
  IDEA: "Idea",
  IN_PROGRESS: "In progress",
  SCHEDULED: "Scheduled",
  RELEASED: "Released",
  ARCHIVED: "Archived"
} as const;

export const trackStatusLabels = {
  DRAFT: "Draft",
  MIXING: "Mixing",
  MASTERED: "Mastered",
  DISTRIBUTED: "Distributed",
  RELEASED: "Released",
  ARCHIVED: "Archived"
} as const;

export const campaignStatusLabels = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  PAUSED: "Paused",
  COMPLETED: "Completed",
  ARCHIVED: "Archived"
} as const;

export const contentPlatformLabels = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  EMAIL: "Email",
  X: "X",
  OTHER: "Other"
} as const;

export const contentFormatLabels = {
  SHORT_VIDEO: "Short",
  STATIC_POST: "Post",
  CAROUSEL: "Reel / carousel",
  STORY: "Story",
  EMAIL_BLAST: "Newsletter",
  PRESS_ASSET: "Video",
  OTHER: "Other"
} as const;

export const contentStatusLabels = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived"
} as const;

export const taskRelatedTypeLabels = {
  RELEASE: "Release",
  TRACK: "Track",
  CAMPAIGN: "Campaign",
  CONTENT_ITEM: "Content item",
  FAN: "Fan"
} as const;

export const taskStatusLabels = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  CANCELED: "Canceled"
} as const;

export const taskPriorityLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High"
} as const;

export const metricSourceLabels = {
  SPOTIFY: "Spotify",
  APPLE_MUSIC: "Apple Music",
  YOUTUBE: "YouTube",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  MAILING_LIST: "Mailing list",
  MANUAL: "Manual"
} as const;

export const metricNameLabels = {
  STREAMS: "Streams",
  FOLLOWERS: "Followers",
  ENGAGEMENT_RATE: "Engagement rate",
  REVENUE_USD: "Revenue (USD)",
  PRE_SAVES: "Pre-saves",
  TICKET_SALES: "Ticket sales",
  EMAIL_SUBSCRIBERS: "Email subscribers"
} as const;
