import {
  createComingSoonConnectionState,
  createNotImplementedIntegrationAction,
  type IntegrationService
} from "@/services/integrations/types";

export const spotifyIntegrationService: IntegrationService = {
  getDefinition() {
    return {
      id: "spotify",
      name: "Spotify",
      category: "Streaming",
      description:
        "Future support for streaming analytics, catalog health checks, and release-linked performance snapshots.",
      supportedData: ["Streams", "Followers", "Listeners", "Playlist activity"],
      accent: "from-[#1DB954]/20 via-[#1DB954]/10 to-transparent"
    };
  },
  async getConnectionState() {
    return createComingSoonConnectionState(
      "Spotify OAuth and sync jobs are not implemented in this MVP."
    );
  },
  beginConnection: createNotImplementedIntegrationAction("Spotify"),
  sync: createNotImplementedIntegrationAction("Spotify")
};
