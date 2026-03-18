import type { Metadata } from "next";
import { ScrollText } from "lucide-react";

import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { termsAndConditionsSections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms and Conditions"
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageShell
      title="Terms and Conditions"
      summary="The core rules that govern access to Artist OS and use of the service."
      calloutTitle="Use the system responsibly"
      calloutDescription="These terms are meant to set clear expectations around account access, permitted use, billing, and the limits of the Artist OS service unless a separate written agreement says otherwise."
      sections={termsAndConditionsSections}
      icon={ScrollText}
      footerNote="These terms apply to use of Artist OS unless a separate written agreement expressly replaces them."
    />
  );
}