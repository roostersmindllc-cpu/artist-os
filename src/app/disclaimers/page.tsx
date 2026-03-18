import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";

import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { disclaimersSections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Disclaimers"
};

export default function DisclaimersPage() {
  return (
    <LegalPageShell
      title="Disclaimers"
      summary="Important limits on what Artist OS does, what it does not do, and how product output should be interpreted."
      calloutTitle="Insight is not a guarantee"
      calloutDescription="Artist OS can organize work, surface signals, and automate parts of your process, but it does not replace professional judgment or guarantee release, audience, or revenue outcomes."
      sections={disclaimersSections}
      icon={TriangleAlert}
      footerNote="Artist OS is an operational platform, not a promise of creative, marketing, legal, or financial outcome."
    />
  );
}