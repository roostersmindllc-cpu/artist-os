import type { Route } from "next";

export type FanListItemDto = {
  id: string;
  name: string;
  email: string | null;
  handle: string | null;
  city: string | null;
  tags: string[];
  engagementScore: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  href: Route;
};

export type FanFilterOptionsDto = {
  cities: string[];
  tags: string[];
};

export type FanDetailDto = FanListItemDto;
