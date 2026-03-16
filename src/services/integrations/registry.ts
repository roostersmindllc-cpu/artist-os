import { emailPlatformIntegrationService } from "@/services/integrations/providers/email-platform-integration";
import { instagramIntegrationService } from "@/services/integrations/providers/instagram-integration";
import { spotifyIntegrationService } from "@/services/integrations/providers/spotify-integration";
import { tiktokIntegrationService } from "@/services/integrations/providers/tiktok-integration";
import { youtubeIntegrationService } from "@/services/integrations/providers/youtube-integration";

export const integrationRegistry = [
  spotifyIntegrationService,
  youtubeIntegrationService,
  tiktokIntegrationService,
  instagramIntegrationService,
  emailPlatformIntegrationService
] as const;

export async function getIntegrationPlaceholdersForUser(userId: string) {
  return Promise.all(
    integrationRegistry.map(async (service) => ({
      ...service.getDefinition(),
      connection: await service.getConnectionState(userId)
    }))
  );
}
