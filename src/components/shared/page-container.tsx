import type { ReactNode } from "react";

import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

type PageContainerProps = {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageContainer({
  title,
  description,
  eyebrow,
  actions,
  children,
  className
}: PageContainerProps) {
  return (
    <section className={cn("mx-auto w-full max-w-[1360px] space-y-6 sm:space-y-8", className)}>
      <SectionHeader
        title={title}
        description={description}
        eyebrow={eyebrow}
        actions={actions}
        size="page"
      />
      {children}
    </section>
  );
}
