import { redirect } from "next/navigation";

import {
  getArtistProfileByUserId,
  getArtistProfileDetailsByUserId
} from "@/db/queries/artist-profiles";

export async function getArtistProfileForUser(userId: string) {
  return getArtistProfileByUserId(userId);
}

export async function requireArtistProfileForUser(userId: string) {
  const artistProfile = await getArtistProfileForUser(userId);

  if (!artistProfile) {
    redirect("/onboarding");
  }

  return artistProfile;
}

export async function hasArtistProfileForUser(userId: string) {
  return Boolean(await getArtistProfileForUser(userId));
}

export async function getArtistProfileOverviewForUser(userId: string) {
  return getArtistProfileDetailsByUserId(userId);
}
