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

/** Patterns stacked; name assumptions before building */
export function IconLearningAssumptions(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M12 4 4 8l8 4 8-4-8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 16 8 4 8-4" />
    </Svg>
  );
}

/** Paper trail, documentation, decisions that travel */
export function IconLearningDocumentation(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M9 4h6l1 2H8l1-2z" />
      <path d="M8 6h8v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6z" />
      <path d="M10 10h4M10 14h4M10 18h4" />
    </Svg>
  );
}

/** Trust, confidence, surfacing enough to decide */
export function IconLearningConfidence(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

/** Builder + panels; AI alongside, not chat-first */
export function IconInsightLayout(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="5" height="16" rx="1.25" fill="none" />
      <rect x="11" y="4" width="10" height="7" rx="1.25" fill="none" />
      <rect x="11" y="13" width="10" height="7" rx="1.25" fill="none" />
    </Svg>
  );
}

/** Design + engineering in the loop from day one */
export function IconPartnership(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

/** Activation, time-to-value, metrics that move */
export function IconActivation(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-4 4 4 7-9" />
    </Svg>
  );
}

/** Moving between tools, hybrid workflow, not single-surface */
export function IconWorkflow(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="12" r="2.5" fill="none" />
      <circle cx="12" cy="12" r="2.5" fill="none" />
      <circle cx="18" cy="12" r="2.5" fill="none" />
      <path d="M8.5 12h1.5M13.5 12h1.5" />
    </Svg>
  );
}

/** AI, generative assist, clarity / “spark” */
export function IconSparkles(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m5.5 5.5 2 2M18.5 5.5l-2 2M18.5 18.5l-2-2M5.5 18.5l2-2" />
    </Svg>
  );
}

export const CASE_STUDY_ICONS = {
  assumptions: IconLearningAssumptions,
  documentation: IconLearningDocumentation,
  confidence: IconLearningConfidence,
  insight: IconInsightLayout,
  partnership: IconPartnership,
  activation: IconActivation,
  workflow: IconWorkflow,
  sparkles: IconSparkles,
} as const;
