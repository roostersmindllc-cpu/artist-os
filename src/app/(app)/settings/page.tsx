import { Disc3, LineChart, Settings2, Users2 } from "lucide-react";

import { AccountDeletionPlaceholder } from "@/components/settings/account-deletion-placeholder";
import { ArtistProfileSettingsForm } from "@/components/settings/artist-profile-settings-form";
import { IntegrationCard } from "@/components/settings/integration-card";
import { PreferencesForm } from "@/components/settings/preferences-form";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { StatCard } from "@/components/shared/stat-card";
import { requireUser } from "@/lib/auth";
import {
  buildArtistProfileSettingsFormValues,
  type AccountSettingsFormValues
} from "@/lib/validations/settings";
import { getSettingsOverviewForUser } from "@/services/settings-service";

export default async function SettingsPage() {
  const user = await requireUser();
  const settings = await getSettingsOverviewForUser(user.id);

  const accountFormValues: AccountSettingsFormValues = {
    name: settings.account.name ?? "",
    email: settings.account.email,
    image: settings.account.image ?? ""
  };
  const artistProfileFormValues = buildArtistProfileSettingsFormValues({
    artistName: settings.artistProfile.artistName,
    genre: settings.artistProfile.genre,
    bio: settings.artistProfile.bio,
    goals: settings.artistProfile.goals,
    audienceSize: settings.artistProfile.audienceSize,
    socialPlatforms: settings.artistProfile.socialPlatforms,
    platformsUsed: settings.artistProfile.platformsUsed
  });

  return (
    <PageContainer
      title="Settings"
      description="Manage account details, artist profile data, workspace preferences, and the integration surface that future providers will plug into."
      eyebrow="Workspace settings"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Releases"
          value={String(settings.artistProfile.counts.releases)}
          hint="Catalog records currently tied to this artist workspace."
          icon={Disc3}
        />
        <StatCard
          label="Fans"
          value={String(settings.artistProfile.counts.fans)}
          hint="Relationship records saved in the CRM layer."
          icon={Users2}
        />
        <StatCard
          label="Metric snapshots"
          value={String(settings.artistProfile.counts.metricSnapshots)}
          hint="Normalized analytics rows available for charts and imports."
          icon={LineChart}
        />
        <StatCard
          label="Integrations"
          value={String(settings.integrations.length)}
          hint="Planned providers already modeled behind a service registry."
          icon={Settings2}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ProfileSettingsForm initialValues={accountFormValues} />
        <ArtistProfileSettingsForm initialValues={artistProfileFormValues} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <PreferencesForm initialValues={settings.preferences} />
        <div className="space-y-6">
          <SectionHeader
            title="Integrations"
            description="Each provider is represented by a real service interface now, while connection and sync methods stay intentionally stubbed until the backend work exists."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {settings.integrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <AccountDeletionPlaceholder
          confirmationLabel={settings.accountDeletion.confirmationLabel}
          reason={settings.accountDeletion.reason}
        />
      </section>
    </PageContainer>
  );
}
