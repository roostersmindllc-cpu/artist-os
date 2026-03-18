import type { Route } from "next";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const legalEffectiveDate = "March 17, 2026";

export const legalLinks: Array<{
  href: Route;
  label: string;
}> = [
  {
    href: "/privacy-policy",
    label: "Privacy Policy"
  },
  {
    href: "/terms-and-conditions",
    label: "Terms and Conditions"
  },
  {
    href: "/disclaimers",
    label: "Disclaimers"
  },
  {
    href: "/refund-policy",
    label: "Refund Policy"
  }
];

export const privacyPolicySections: LegalSection[] = [
  {
    title: "Information we collect",
    paragraphs: [
      "Artist OS collects information you provide directly, such as your account details, artist profile information, release plans, campaign records, audience notes, uploaded files, and analytics you choose to import or enter.",
      "We also collect limited technical information needed to operate the service, including device, browser, log, and usage data."
    ]
  },
  {
    title: "How we use information",
    paragraphs: [
      "We use information to provide the product, personalize your workspace, automate planning flows, secure the service, respond to support issues, and improve Artist OS over time.",
      "We may also use aggregated or de-identified usage patterns to understand feature adoption and product performance."
    ]
  },
  {
    title: "Sharing and processors",
    paragraphs: [
      "We do not sell your personal information. We may share data with infrastructure, analytics, authentication, payment, monitoring, and communications providers that help us operate Artist OS on our behalf.",
      "We may also disclose information when required by law, to enforce our agreements, or to protect the rights, safety, and security of Artist OS, our users, or the public."
    ]
  },
  {
    title: "Retention and security",
    paragraphs: [
      "We retain information for as long as reasonably necessary to provide the service, comply with legal obligations, resolve disputes, and enforce our agreements.",
      "Artist OS uses reasonable technical and organizational safeguards, but no storage or transmission method is completely secure."
    ]
  },
  {
    title: "Your choices",
    paragraphs: [
      "You may update profile information inside the product, disconnect optional integrations, and stop using the service at any time.",
      "If you need account-related data access, correction, or deletion help, use the support channel made available through the service."
    ]
  },
  {
    title: "Policy updates",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Material changes will be reflected by updating the effective date and, when appropriate, by providing additional notice inside the service."
    ]
  }
];

export const termsAndConditionsSections: LegalSection[] = [
  {
    title: "Acceptance and eligibility",
    paragraphs: [
      "By accessing or using Artist OS, you agree to these Terms and Conditions. You may use the service only if you can form a binding contract and are authorized to act for the artist, team, or business using the account."
    ]
  },
  {
    title: "Accounts and access",
    paragraphs: [
      "You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.",
      "You must provide accurate information and promptly update it when your account details change."
    ]
  },
  {
    title: "Permitted use",
    paragraphs: [
      "Artist OS is provided as an operations and planning platform for artists and their teams. You agree not to misuse the service, reverse engineer it, interfere with other users, or use the product to store or distribute unlawful, infringing, or harmful material."
    ],
    bullets: [
      "Do not upload content you do not have the right to use.",
      "Do not attempt to bypass product limits, security controls, or access restrictions.",
      "Do not use Artist OS to send spam, scrape data, or disrupt the service."
    ]
  },
  {
    title: "Your content and data",
    paragraphs: [
      "You retain ownership of the content, campaign plans, analytics, notes, and other material you submit to Artist OS.",
      "You grant Artist OS the limited rights needed to host, process, transmit, display, and back up that content solely for operating and improving the service."
    ]
  },
  {
    title: "Fees, billing, and cancellations",
    paragraphs: [
      "If Artist OS offers paid plans, you agree to pay the fees and applicable taxes disclosed at the time of purchase, subject to any separate order form or checkout terms.",
      "Recurring subscriptions, if any, continue until canceled. Cancelling stops future renewals but does not automatically create a refund unless required by law or expressly stated otherwise."
    ]
  },
  {
    title: "Suspension and termination",
    paragraphs: [
      "We may suspend or terminate access if you violate these terms, create risk for the service or other users, or if continued access is unlawful or operationally impractical.",
      "You may stop using Artist OS at any time."
    ]
  },
  {
    title: "Liability limits",
    paragraphs: [
      "To the fullest extent permitted by law, Artist OS is provided on an as-is and as-available basis, and we disclaim warranties not expressly stated in these terms.",
      "To the fullest extent permitted by law, Artist OS will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, revenues, goodwill, or data."
    ]
  }
];

export const disclaimersSections: LegalSection[] = [
  {
    title: "Informational product only",
    paragraphs: [
      "Artist OS provides planning, organization, analytics, and workflow tooling. It does not provide legal, tax, accounting, investment, or other licensed professional advice."
    ]
  },
  {
    title: "No performance guarantees",
    paragraphs: [
      "We do not guarantee streams, reach, playlist placements, ticket sales, audience growth, release performance, campaign outcomes, or any other commercial result.",
      "Any scores, suggestions, automations, prompts, recommendations, or dashboards are informational aids and not promises of outcome."
    ]
  },
  {
    title: "Third-party platforms",
    paragraphs: [
      "Artist OS may reference or connect with third-party services such as Spotify, YouTube, TikTok, email tools, distribution platforms, social networks, and analytics providers.",
      "Those services are controlled by third parties, and their availability, rules, APIs, metrics, and actions may change without notice."
    ]
  },
  {
    title: "Availability and accuracy",
    paragraphs: [
      "We aim to keep the product available and useful, but Artist OS may experience downtime, delays, import failures, stale data, or inaccuracies caused by user input, integrations, or external systems.",
      "You are responsible for reviewing output before acting on it in a real release, marketing, or business workflow."
    ]
  },
  {
    title: "User responsibility",
    paragraphs: [
      "You remain responsible for rights clearance, consent, brand approvals, publishing decisions, campaign execution, fan communications, and compliance with the rules that apply to your work."
    ]
  }
];

export const refundPolicySections: LegalSection[] = [
  {
    title: "General policy",
    paragraphs: [
      "Unless required by law, stated in a separate written agreement, or approved by Artist OS in writing, payments for subscriptions, plan fees, implementation work, and other purchased services are non-refundable."
    ]
  },
  {
    title: "Cancellations",
    paragraphs: [
      "If you cancel a paid subscription, your plan remains active through the end of the paid billing period and will not renew after that point.",
      "Cancellation does not automatically create a refund for time already billed."
    ]
  },
  {
    title: "Billing errors",
    paragraphs: [
      "If you believe you were charged in error, notify Artist OS through the support channel available in the service as soon as reasonably possible after the charge appears.",
      "When a billing error is confirmed, we may issue a correction, credit, or refund at our discretion and as required by applicable law."
    ]
  },
  {
    title: "Plan changes and exceptions",
    paragraphs: [
      "If Artist OS introduces paid plans, promotional offers, trials, or enterprise agreements, those terms may include different cancellation or refund rules that apply specifically to that purchase.",
      "Any exception to this policy must be stated clearly at checkout, in an order form, or in a written communication from Artist OS."
    ]
  }
];
