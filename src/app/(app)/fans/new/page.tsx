import Link from "next/link";
import type { Route } from "next";

import { FanForm } from "@/components/forms/fan-form";
import { PageContainer } from "@/components/shared/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NewFanPage() {
  return (
    <PageContainer
      title="New fan"
      description="Create a supporter record with clean tags, engagement scoring, and relationship notes that will still scale once import workflows arrive."
      eyebrow="CRM setup"
      actions={
        <Link
          href={"/fans" as Route}
          className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}
        >
          Back to fans
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <FanForm />
        <Card className="rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
          <CardHeader className="border-b border-black/12 bg-black text-white">
            <CardTitle className="text-4xl text-white">Import-ready structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))] text-sm leading-6 text-muted-foreground">
            <p>
              The fan record stays intentionally simple: contact fields, tags, engagement
              score, and notes. That keeps the model clean enough for future CSV upload and
              normalization flows.
            </p>
            <p>
              Search and filter behavior already lives in the service/query layer, so a future
              bulk import can land in the same typed path without reshaping the page code.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
