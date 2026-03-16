import Link from "next/link";
import type { Route } from "next";

import { ReleaseForm } from "@/components/forms/release-form";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NewReleasePage() {
  return (
    <PageContainer
      title="New release"
      description="Start a release record with the metadata you need today, then layer in tracks, campaigns, and content once the plan sharpens."
      eyebrow="Catalog setup"
      actions={
        <Link
          href={"/releases" as Route}
          className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
        >
          Back to releases
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ReleaseForm />
        <Card>
          <CardHeader>
            <CardTitle>What to capture first</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Set the title, type, status, and target date first. That gives the rest of the
              workspace a clean anchor for campaigns, content planning, and task linking.
            </p>
            <p>
              Distributor, cover art URL, and description can stay lightweight for MVP usage,
              but filling them now makes the dashboard and detail view more useful immediately.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
