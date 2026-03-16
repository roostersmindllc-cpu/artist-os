import {
  createComingSoonConnectionState,
  createNotImplementedIntegrationAction,
  type IntegrationService
} from "@/services/integrations/types";

export const youtubeIntegrationService: IntegrationService = {
  getDefinition() {
    return {
      id: "youtube",
      name: "YouTube",
      category: "Video",
      description:
        "Future support for channel performance, video views, and campaign-linked content reporting.",
      supportedData: ["Views", "Subscribers", "Watch time", "Video metadata"],
      accent: "from-[#FF0033]/20 via-[#FF0033]/10 to-transparent"
    };
  },
  async getConnectionState() {
    return createComingSoonConnectionState(
      "YouTube OAuth and reporting ingestion are not implemented in this MVP."
    );
  },
  beginConnection: createNotImplementedIntegrationAction("YouTube"),
  sync: createNotImplementedIntegrationAction("YouTube")
};
