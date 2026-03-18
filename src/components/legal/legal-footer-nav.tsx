import Link from "next/link";

import { legalLinks } from "@/lib/legal";
import { cn } from "@/lib/utils";

type LegalFooterNavProps = {
  className?: string;
  linkClassName?: string;
};

export function LegalFooterNav({
  className,
  linkClassName
}: LegalFooterNavProps) {
  return (
    <nav
      aria-label="Legal"
      className={cn("flex flex-wrap items-center gap-x-6 gap-y-3", className)}
    >
      {legalLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm text-white/58 transition-colors hover:text-primary",
            linkClassName
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}