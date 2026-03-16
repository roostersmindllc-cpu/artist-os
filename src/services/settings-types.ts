import type { PreferencesFormValues } from "@/lib/validations/settings";

export type SettingsOverviewDto = {
  account: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  artistProfile: {
    id: string;
    artistName: string;
    genre: string | null;
    bio: string | null;
    goals: string[];
    counts: {
      releases: number;
      campaigns: number;
      contentItems: number;
      fans: number;
      tasks: number;
      metricSnapshots: number;
    };
  };
  preferences: PreferencesFormValues;
  integrations: Awaited<
    ReturnType<typeof import("@/services/integrations/registry").getIntegrationPlaceholdersForUser>
  >;
  accountDeletion: {
    enabled: false;
    reason: string;
    confirmationLabel: string;
  };
};
