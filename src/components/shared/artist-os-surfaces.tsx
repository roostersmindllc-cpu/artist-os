import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const artistOsSurfaceVariants = cva("", {
  variants: {
    tone: {
      whiteBoard:
        "rounded-[1.5rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)] sm:rounded-[2rem]",
      purpleFeature:
        "rounded-[1.45rem] border border-fuchsia-300/45 bg-[linear-gradient(180deg,rgba(190,89,255,0.88),rgba(155,66,222,0.96))] text-white shadow-[0_16px_34px_rgba(0,0,0,0.12)] sm:rounded-[1.8rem]",
      cyanShell:
        "rounded-[1.85rem] border-[4px] border-primary bg-card shadow-[0_26px_80px_rgba(0,0,0,0.22)] sm:rounded-[2.35rem] sm:border-[5px]",
      blackHeaderCard:
        "rounded-[1.5rem] border-2 border-black/12 bg-card shadow-[0_18px_36px_rgba(0,0,0,0.08)] sm:rounded-[2rem]"
    }
  },
  defaultVariants: {
    tone: "whiteBoard"
  }
});

export const artistOsWhiteBoardBodyClassName =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,242,236,0.94))]";

const artistOsCardContentPaddingVariants = cva("", {
  variants: {
    padding: {
      default: "p-4 pt-4 sm:p-6 sm:pt-6",
      compact: "p-4 pt-4 sm:p-5 sm:pt-5",
      flush: "p-0"
    }
  },
  defaultVariants: {
    padding: "default"
  }
});

type CyanOutlineShellProps = {
  children: ReactNode;
  className?: string;
};

export function CyanOutlineShell({ children, className }: CyanOutlineShellProps) {
  return (
    <section className={cn(artistOsSurfaceVariants({ tone: "cyanShell" }), className)}>
      {children}
    </section>
  );
}

type WhiteBoardCardProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
} & VariantProps<typeof artistOsCardContentPaddingVariants>;

export function WhiteBoardCard({
  children,
  className,
  contentClassName,
  padding
}: WhiteBoardCardProps) {
  return (
    <Card className={cn(artistOsSurfaceVariants({ tone: "whiteBoard" }), className)}>
      <CardContent
        className={cn(
          artistOsWhiteBoardBodyClassName,
          artistOsCardContentPaddingVariants({ padding }),
          contentClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}

type PurpleFeaturePanelProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
};

export function PurpleFeaturePanel({
  title,
  description,
  icon: Icon,
  className,
  titleClassName,
  descriptionClassName,
  children
}: PurpleFeaturePanelProps) {
  return (
    <div className={cn(artistOsSurfaceVariants({ tone: "purpleFeature" }), "p-5", className)}>
      {Icon ? (
        <span className="inline-flex size-9 items-center justify-center rounded-[1.1rem] border border-white/14 bg-white/10 text-primary sm:size-10 sm:rounded-2xl">
          <Icon className="size-4 sm:size-5" />
        </span>
      ) : null}
      <p
        className={cn(
          "mt-4 font-heading text-[1.65rem] font-semibold leading-none sm:text-3xl",
          titleClassName
        )}
      >
        {title}
      </p>
      {description ? (
        <p className={cn("mt-3 text-sm leading-6 text-white/80", descriptionClassName)}>
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

type BlackHeaderCardProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentPadding?: VariantProps<typeof artistOsCardContentPaddingVariants>["padding"];
};

export function BlackHeaderCard({
  title,
  description,
  icon,
  action,
  children,
  className,
  headerClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  contentPadding
}: BlackHeaderCardProps) {
  return (
    <Card className={cn(artistOsSurfaceVariants({ tone: "blackHeaderCard" }), className)}>
      <CardHeader
        className={cn(
          "border-b border-black/12 bg-black p-4 text-white sm:p-6",
          headerClassName
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            {icon ? icon : null}
            <div className="space-y-1">
              <CardTitle
                className={cn("text-3xl text-white sm:text-4xl", titleClassName)}
              >
                {title}
              </CardTitle>
              {description ? (
                <CardDescription
                  className={cn(
                    "max-w-2xl text-sm leading-6 text-white/68 sm:text-base",
                    descriptionClassName
                  )}
                >
                  {description}
                </CardDescription>
              ) : null}
            </div>
          </div>
          {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          artistOsWhiteBoardBodyClassName,
          artistOsCardContentPaddingVariants({ padding: contentPadding }),
          contentClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
