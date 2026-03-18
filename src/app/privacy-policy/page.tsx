import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { privacyPolicySections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy"
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      summary="How Artist OS collects, uses, stores, and protects information provided through the product."
      calloutTitle="Data, with boundaries"
      calloutDescription="Artist OS is built to hold the release, campaign, analytics, and audience information you choose to organize in the product, while limiting use of that information to operating, protecting, and improving the service."
      sections={privacyPolicySections}
      icon={ShieldCheck}
      footerNote="This page explains how Artist OS handles product and account data as of March 17, 2026."
    />
  );
}