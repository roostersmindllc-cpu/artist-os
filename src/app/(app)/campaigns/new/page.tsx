import Link from "next/link";
import type { Route } from "next";

import { CampaignForm } from "@/components/forms/campaign-form";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getCampaignReleaseOptionsForUser } from "@/services/campaigns-service";

export default async function NewCampaignPage() {
  const user = await requireUser();
  const releaseOptions = await getCampaignReleaseOptionsForUser(user.id);

  return (
    <PageContainer
      title="New campaign"
      description="Create a campaign record for a release push, brand moment, or audience-growth sprint, then link supporting work around it."
      eyebrow="Campaign setup"
      actions={
        <Link
          href={"/campaigns" as Route}
          className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
        >
          Back to campaigns
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <CampaignForm releaseOptions={releaseOptions} />
        <Card>
          <CardHeader>
            <CardTitle>Planning guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Start with the campaign objective, status, and date window. That creates a
              clear planning container before creative, content, or ad execution details get
              layered in.
            </p>
            <p>
              Release linking is optional by design. Some campaigns exist before the release
              record is ready, and some are broader artist-growth efforts.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
