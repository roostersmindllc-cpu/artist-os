import {
  createComingSoonConnectionState,
  createNotImplementedIntegrationAction,
  type IntegrationService
} from "@/services/integrations/types";

export const tiktokIntegrationService: IntegrationService = {
  getDefinition() {
    return {
      id: "tiktok",
      name: "TikTok",
      category: "Short-form video",
      description:
        "Future support for post-level views, follower growth, and short-form content momentum tracking.",
      supportedData: ["Views", "Followers", "Shares", "Post performance"],
      accent: "from-[#25F4EE]/20 via-[#FE2C55]/10 to-transparent"
    };
  },
  async getConnectionState() {
    return createComingSoonConnectionState(
      "TikTok authentication and analytics sync are not implemented in this MVP."
    );
  },
  beginConnection: createNotImplementedIntegrationAction("TikTok"),
  sync: createNotImplementedIntegrationAction("TikTok")
};
