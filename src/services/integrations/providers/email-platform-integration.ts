import {
  createComingSoonConnectionState,
  createNotImplementedIntegrationAction,
  type IntegrationService
} from "@/services/integrations/types";

export const emailPlatformIntegrationService: IntegrationService = {
  getDefinition() {
    return {
      id: "email-platform",
      name: "Email platform",
      category: "CRM and email",
      description:
        "Future support for subscriber counts, campaign reporting, and audience growth imports from your email stack.",
      supportedData: ["Subscribers", "Campaign opens", "Clicks", "List segments"],
      accent: "from-[#2563EB]/20 via-[#22C55E]/10 to-transparent"
    };
  },
  async getConnectionState() {
    return createComingSoonConnectionState(
      "Email platform sync and account connection are not implemented in this MVP."
    );
  },
  beginConnection: createNotImplementedIntegrationAction("Email platform"),
  sync: createNotImplementedIntegrationAction("Email platform")
};
