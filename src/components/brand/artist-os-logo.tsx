import { cn } from "@/lib/utils";

type ArtistOsLogoProps = {
  className?: string;
  markClassName?: string;
  labelClassName?: string;
  withTagline?: boolean;
  compact?: boolean;
};

function ArtistOsBrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      className={cn("h-12 w-12 shrink-0", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="artist-os-note" x1="34" y1="20" x2="112" y2="126" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F8D0FF" />
          <stop offset="0.32" stopColor="#E964F5" />
          <stop offset="0.62" stopColor="#A844E0" />
          <stop offset="1" stopColor="#5D2AE8" />
        </linearGradient>
        <linearGradient id="artist-os-circuit" x1="84" y1="26" x2="146" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#67B5FF" />
          <stop offset="0.45" stopColor="#27C5FF" />
          <stop offset="1" stopColor="#2DE2F8" />
        </linearGradient>
        <radialGradient id="artist-os-core" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(80 88) rotate(90) scale(54)">
          <stop offset="0" stopColor="#1B2E78" stopOpacity="0.92" />
          <stop offset="1" stopColor="#090B19" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="77" cy="82" r="44" fill="url(#artist-os-core)" />
      <path
        d="M34 70c8-16 22-27 40-32m-25 51c-4-16-1-33 9-47m17 57c-8-11-13-25-12-40m26 35c0-16 6-31 17-42m-7 51c8-8 15-19 18-31"
        stroke="url(#artist-os-circuit)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.88"
      />
      <path
        d="M30 88c6-20 20-36 38-46 18-10 40-12 60-6"
        stroke="#5D5EFF"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M96 28v62.5c0 13.7-12.1 24.5-29.2 24.5-12.8 0-22.8-6.2-22.8-16.8S54 81 66.8 81c6.3 0 11.8 1.6 15.6 4.4V50.2l44.6-19.2v52.3c0 13.7-12.1 24.5-29.2 24.5-12.8 0-22.8-6.2-22.8-16.8S85 74 97.8 74c6.2 0 11.6 1.5 15.4 4.2V50.8L96 58.2V28Z"
        fill="url(#artist-os-note)"
        stroke="#FFD8FF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M109 65h14m-4 16h18m-12 16h15"
        stroke="url(#artist-os-circuit)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="135" cy="65" r="6.5" fill="#2DE2F8" />
      <circle cx="143" cy="81" r="6.5" fill="#2DE2F8" />
      <circle cx="138" cy="97" r="6.5" fill="#67B5FF" />
      <circle cx="27" cy="77" r="6.5" fill="#67B5FF" />
    </svg>
  );
}

export function ArtistOsLogo({
  className,
  markClassName,
  labelClassName,
  withTagline = false,
  compact = false
}: ArtistOsLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", compact ? "gap-2.5" : "gap-4", className)}>
      <ArtistOsBrandMark className={markClassName} />
      <div className={cn("min-w-0", labelClassName)}>
        <div className={cn("flex items-baseline gap-0.5", compact ? "text-lg" : "text-2xl")}>
          <span className="font-heading font-semibold tracking-tight text-foreground">
            Artist
          </span>
          <span className="font-heading font-semibold tracking-tight text-sky-500">
            .OS
          </span>
        </div>
        {withTagline ? (
          <p className="mt-1 max-w-[18rem] text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Release ops, content, fans, and insight in one system
          </p>
        ) : null}
      </div>
    </div>
  );
}
