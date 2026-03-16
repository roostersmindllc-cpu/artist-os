import {
  createComingSoonConnectionState,
  createNotImplementedIntegrationAction,
  type IntegrationService
} from "@/services/integrations/types";

export const instagramIntegrationService: IntegrationService = {
  getDefinition() {
    return {
      id: "instagram",
      name: "Instagram",
      category: "Social",
      description:
        "Future support for follower trends, reel performance, and post-level publishing insights.",
      supportedData: ["Followers", "Reach", "Engagement", "Reel performance"],
      accent: "from-[#F58529]/20 via-[#DD2A7B]/10 to-transparent"
    };
  },
  async getConnectionState() {
    return createComingSoonConnectionState(
      "Instagram connection and analytics sync are not implemented in this MVP."
    );
  },
  beginConnection: createNotImplementedIntegrationAction("Instagram"),
  sync: createNotImplementedIntegrationAction("Instagram")
};
