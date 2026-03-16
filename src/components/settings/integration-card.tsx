import { Clock3, Link2Off } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type IntegrationCardProps = {
  integration: Awaited<
    ReturnType<typeof import("@/services/integrations/registry").getIntegrationPlaceholdersForUser>
  >[number];
};

export function IntegrationCard({ integration }: IntegrationCardProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="relative space-y-3">
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${integration.accent}`}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{integration.name}</CardTitle>
            <CardDescription>{integration.category}</CardDescription>
          </div>
          <Badge variant="outline">Coming soon</Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{integration.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Planned support
          </p>
          <div className="flex flex-wrap gap-2">
            {integration.supportedData.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-background/45 p-4 text-sm leading-6 text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Clock3 className="size-4 text-primary" />
            Placeholder state
          </div>
          <p className="mt-2">{integration.connection.disabledReason}</p>
        </div>
        <Button className="w-full" variant="outline" disabled>
          <Link2Off className="size-4" />
          {integration.connection.primaryActionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
