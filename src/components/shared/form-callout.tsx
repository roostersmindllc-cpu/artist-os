import type { LucideIcon } from "lucide-react";

import { PurpleFeaturePanel } from "@/components/shared/artist-os-surfaces";

type FormCalloutProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function FormCallout({ title, description, icon: Icon }: FormCalloutProps) {
  return (
    <PurpleFeaturePanel
      title={title}
      description={description}
      icon={Icon}
      className="rounded-[1.7rem] p-4"
      titleClassName="text-2xl"
      descriptionClassName="text-white/82"
    />
  );
}
