import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requireOnboardedUser } from "@/lib/route-access";

export default async function AppLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const { user, artistProfile } = await requireOnboardedUser();

  return (
    <AppShell
      user={{ name: user.name ?? artistProfile.artistName, email: user.email }}
    >
      {children}
    </AppShell>
  );
}
