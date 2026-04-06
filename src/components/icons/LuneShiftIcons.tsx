import type { SVGProps } from "react";

const stroke = 1.5;

function Svg({ className, children, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Before (Komodo): slow ticket loop */
export function IconClock(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function IconClipboard(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M9 4h6l1 2H8l1-2z" />
      <path d="M8 6h8v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6z" />
      <path d="M10 10h4M10 14h4" />
    </Svg>
  );
}

export function IconLayers(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M12 4 4 8l8 4 8-4-8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 16 8 4 8-4" />
    </Svg>
  );
}

/** Stakeholders, committees, “everyone’s” system */
export function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

/** After (Lune): fast, owned */
export function IconBolt(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </Svg>
  );
}

export function IconPenLine(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </Svg>
  );
}

/** Module / component grid (Tailwind primitives, building blocks) */
export function IconLayoutGrid(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" />
    </Svg>
  );
}

export function IconLightbulb(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.5A7 7 0 0 0 12 2z" />
    </Svg>
  );
}

const beforeIcons = [IconClock, IconClipboard, IconLayers, IconUsers] as const;
const afterIcons = [IconBolt, IconPenLine, IconLayoutGrid, IconLightbulb] as const;

export function KomodoRowIcon({ index }: { index: number }) {
  const I = beforeIcons[index] ?? IconClock;
  return (
    <span
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--paper)] text-[var(--muted)]"
      aria-hidden
    >
      <I className="h-5 w-5" />
    </span>
  );
}

export function LuneRowIcon({ index }: { index: number }) {
  const I = afterIcons[index] ?? IconBolt;
  return (
    <span
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--accent)]/35 bg-[var(--wash)] text-[var(--accent)]"
      aria-hidden
    >
      <I className="h-5 w-5" />
    </span>
  );
}
