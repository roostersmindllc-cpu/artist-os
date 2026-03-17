import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AnalyticsIdentity } from "@/components/telemetry/analytics-identity";
import { requireOnboardedUser } from "@/lib/route-access";
import { getContentPlannerOptionsForUser } from "@/services/content-service";

export default async function AppLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const { user, artistProfile } = await requireOnboardedUser();
  const quickAddContentOptions = await getContentPlannerOptionsForUser(user.id);

  return (
    <>
      <AnalyticsIdentity
        user={{
          id: user.id,
          name: user.name ?? artistProfile.artistName,
          email: user.email
        }}
      />
      <AppShell
        user={{ name: user.name ?? artistProfile.artistName, email: user.email }}
        quickAddContentOptions={quickAddContentOptions}
      >
        {children}
      </AppShell>
    </>
  );
}
