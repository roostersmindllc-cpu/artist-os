import type { Metadata } from "next";
import { CreditCard } from "lucide-react";

import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { refundPolicySections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Refund Policy"
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell
      title="Refund Policy"
      summary="How Artist OS handles cancellations, billing corrections, and refund requests for paid services."
      calloutTitle="Clear billing expectations"
      calloutDescription="This policy is designed to set expectations around paid plans, cancellation timing, and the limited cases where a refund, credit, or billing correction may be available."
      sections={refundPolicySections}
      icon={CreditCard}
      footerNote="Refunds may still be available when required by law or approved in writing by Artist OS."
    />
  );
}