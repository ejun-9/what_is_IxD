"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { TimelineEntry } from "@/content/profile";

type Props = {
  job: TimelineEntry;
};

/** Matches a normal timeline entry: label + line + same bullet list as {@link ExperienceSection} non-carousel rows. */
function PanelBody({
  panel,
}: {
  panel: NonNullable<TimelineEntry["carouselPanels"]>[number];
}) {
  return (
    <div className="mt-4 flex h-full flex-col">
      {panel.focusLabel ? (
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">{panel.focusLabel}</p>
      ) : null}
      <p className="mt-1 font-display text-base font-medium leading-snug text-[var(--ink)] md:text-lg">{panel.title}</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--body)] leading-relaxed">
        {panel.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </div>
  );
}

export function ExperienceScrollCarousel({ job }: Props) {
  const panels = job.carouselPanels;
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  /** Hold on panel 1 → slide → hold on panel 2 (scroll-time “delays”). */
  const x = useTransform(
    scrollYProgress,
    [0, 0.14, 0.16, 0.34, 0.36, 0.88, 1],
    ["0%", "0%", "0%", "-50%", "-50%", "-50%", "-50%"],
  );

  if (!panels?.length) return null;

  if (reduceMotion) {
    return (
      <div className="mt-4 space-y-10">
        {panels.map((panel) => (
          <PanelBody key={panel.title} panel={panel} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="relative min-h-[125vh] md:min-h-[150vh]"
      role="region"
      aria-label={`${panels.length} focus areas at ${job.organization}. Scroll to reveal the next panel.`}
    >
      <div className="sticky top-24 z-0 md:top-28">
        <div className="overflow-hidden">
          <motion.div style={{ x }} className="flex w-[200%] will-change-transform">
            {panels.map((panel) => (
              <div
                key={panel.title}
                className="box-border w-1/2 shrink-0 pr-6 md:pr-10"
              >
                <PanelBody panel={panel} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
