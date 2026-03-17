import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import "@/app/globals.css";
import { AppAnalyticsProvider } from "@/components/telemetry/app-analytics-provider";

function getMetadataBase() {
  const appUrl = process.env.NEXTAUTH_URL;

  if (!appUrl) {
    return undefined;
  }

  try {
    return new URL(appUrl);
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: "Artist OS",
  title: {
    default: "Artist OS",
    template: "%s | Artist OS"
  },
  description:
    "Production-minded SaaS dashboard for releases, campaigns, content, analytics, fans, and tasks.",
  keywords: [
    "Artist OS",
    "music operations",
    "release planning",
    "artist dashboard",
    "music CRM"
  ],
  icons: {
    icon: "/icon",
    apple: "/apple-icon"
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Artist OS",
    description:
      "Production-minded SaaS dashboard for releases, campaigns, content, analytics, fans, and tasks.",
    siteName: "Artist OS",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Artist OS",
    description:
      "Production-minded SaaS dashboard for releases, campaigns, content, analytics, fans, and tasks."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AppAnalyticsProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AppAnalyticsProvider>
      </body>
    </html>
  );
}
