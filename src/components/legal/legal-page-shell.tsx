import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, FileText } from "lucide-react";
import type { ReactNode } from "react";

import { ArtistOsLogo } from "@/components/brand/artist-os-logo";
import { LegalFooterNav } from "@/components/legal/legal-footer-nav";
import {
  BlackHeaderCard,
  CyanOutlineShell,
  PurpleFeaturePanel,
  WhiteBoardCard
} from "@/components/shared/artist-os-surfaces";
import { buttonVariants } from "@/components/ui/button";
import type { LegalSection } from "@/lib/legal";
import { legalEffectiveDate } from "@/lib/legal";
import { cn } from "@/lib/utils";

type LegalPageShellProps = {
  title: string;
  summary: string;
  calloutTitle: string;
  calloutDescription: string;
  sections: LegalSection[];
  icon?: LucideIcon;
  footerNote?: ReactNode;
};

export function LegalPageShell({
  title,
  summary,
  calloutTitle,
  calloutDescription,
  sections,
  icon: Icon = FileText,
  footerNote
}: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-transparent px-3 py-4 text-white sm:px-4 sm:py-6 lg:px-6 lg:py-8">
      <div className="mx-auto w-full max-w-[1320px] space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/sign-in" className="inline-flex">
            <ArtistOsLogo
              compact
              className="items-center gap-3"
              markClassName="h-14 w-14"
              labelClassName="[&_span:first-child]:text-white [&_span:last-child]:text-primary"
            />
          </Link>

          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-center rounded-full border-white/15 bg-white/8 text-white shadow-none hover:bg-white/12 hover:text-white sm:w-auto"
            )}
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </div>

        <CyanOutlineShell className="p-3 sm:p-4 lg:p-5">
          <BlackHeaderCard
            title={title}
            description={summary}
            icon={
              <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </span>
            }
            action={
              <div className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/74">
                Effective {legalEffectiveDate}
              </div>
            }
            contentClassName="space-y-4 sm:space-y-5"
          >
            <PurpleFeaturePanel
              title={calloutTitle}
              description={calloutDescription}
              icon={Icon}
              className="p-4 sm:p-5"
              titleClassName="text-2xl sm:text-3xl"
            />

            <div className="grid gap-4 lg:grid-cols-2">
              {sections.map((section) => (
                <WhiteBoardCard
                  key={section.title}
                  padding="compact"
                  contentClassName="space-y-4"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                      Section
                    </p>
                    <h2 className="mt-2 font-heading text-3xl font-semibold leading-none">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets?.length ? (
                    <ul className="space-y-2 text-sm leading-7 text-foreground sm:text-base">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </WhiteBoardCard>
              ))}
            </div>
          </BlackHeaderCard>
        </CyanOutlineShell>

        <footer className="rounded-[1.6rem] border border-white/10 bg-white/6 px-4 py-4 backdrop-blur sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <LegalFooterNav />
            <p className="text-sm text-white/54">
              {footerNote ?? "Review these policies with your own counsel before public launch."}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}