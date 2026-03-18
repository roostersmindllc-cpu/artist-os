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
      description="Start a release record, then let the first automation generate a rollout starter system around it."
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
        <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
          <CardHeader className="border-b border-black/12 bg-black text-white">
            <CardTitle className="text-4xl text-white">Starter automation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))] text-sm leading-6 text-muted-foreground">
            <p>
              When you create a release, Artist OS now auto-generates a linked campaign,
              three draft content items, and starter tasks for playlist outreach, fan
              email, and TikTok planning.
            </p>
            <p>
              If you set a release date, the system uses that to shape the rollout runway.
              If you leave the date blank, it builds a provisional 21-day plan that you can
              refine later.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
