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
    <Card className="overflow-hidden rounded-[2rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)]">
      <CardHeader className="relative space-y-3 border-b border-black/12 bg-black text-white">
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${integration.accent}`}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-3xl text-white">{integration.name}</CardTitle>
            <CardDescription className="text-white/68">{integration.category}</CardDescription>
          </div>
          <Badge variant="outline" className="border-white/16 bg-white/8 text-white">
            Coming soon
          </Badge>
        </div>
        <p className="text-sm leading-6 text-white/72">{integration.description}</p>
      </CardHeader>
      <CardContent className="space-y-4 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
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
        <div className="rounded-[1.7rem] border-2 border-black/12 bg-white p-4 text-sm leading-6 text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Clock3 className="size-4 text-primary" />
            Placeholder state
          </div>
          <p className="mt-2">{integration.connection.disabledReason}</p>
        </div>
        <Button className="h-12 w-full rounded-full border-black/12 bg-white" variant="outline" disabled>
          <Link2Off className="size-4" />
          {integration.connection.primaryActionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
