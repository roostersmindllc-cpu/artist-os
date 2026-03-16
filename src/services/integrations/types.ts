export type IntegrationProviderId =
  | "spotify"
  | "youtube"
  | "tiktok"
  | "instagram"
  | "email-platform";

export type IntegrationConnectionState = {
  status: "COMING_SOON";
  connected: false;
  lastSyncedAt: null;
  primaryActionLabel: string;
  disabledReason: string;
};

export type IntegrationDefinition = {
  id: IntegrationProviderId;
  name: string;
  category: string;
  description: string;
  supportedData: string[];
  accent: string;
};

export interface IntegrationService {
  getDefinition(): IntegrationDefinition;
  getConnectionState(userId: string): Promise<IntegrationConnectionState>;
  beginConnection(userId: string): Promise<never>;
  sync(userId: string): Promise<never>;
}

export function createComingSoonConnectionState(
  disabledReason: string
): IntegrationConnectionState {
  return {
    status: "COMING_SOON",
    connected: false,
    lastSyncedAt: null,
    primaryActionLabel: "Coming soon",
    disabledReason
  };
}

export function createNotImplementedIntegrationAction(providerName: string) {
  return async () => {
    throw new Error(`${providerName} integration is not implemented yet.`);
  };
}
