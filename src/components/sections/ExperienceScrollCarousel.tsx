"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TimelineEntry } from "@/content/profile";

type Props = {
  job: TimelineEntry;
};

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

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

/**
 * Horizontal carousel for role focus panels: chevrons + snap scroll, peek of adjacent panels (no scroll-linked motion).
 */
export function ExperienceScrollCarousel({ job }: Props) {
  const panels = job.carouselPanels;
  const n = panels?.length ?? 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** Horizontal scroll only; avoids `scrollIntoView`, which can move the page vertically. */
  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(n - 1, i));
      setIndex(clamped);
      const panel = itemRefs.current[clamped];
      const container = scrollRef.current;
      if (!panel || !container) return;
      const targetLeft = panel.offsetLeft + panel.offsetWidth / 2 - container.clientWidth / 2;
      const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
      const left = Math.min(maxScroll, Math.max(0, targetLeft));
      container.scrollTo({
        left,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [n, reducedMotion],
  );

  const goPrev = useCallback(() => goTo(indexRef.current - 1), [goTo]);
  const goNext = useCallback(() => goTo(indexRef.current + 1), [goTo]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || n <= 1) return;

    let raf = 0;
    const syncIndex = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { scrollLeft, clientWidth } = el;
        const centers = itemRefs.current.map((node) => {
          if (!node) return Infinity;
          const left = node.offsetLeft;
          const w = node.offsetWidth;
          return left + w / 2;
        });
        const viewportCenter = scrollLeft + clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        centers.forEach((cx, i) => {
          const d = Math.abs(cx - viewportCenter);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };

    el.addEventListener("scroll", syncIndex, { passive: true });
    syncIndex();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", syncIndex);
    };
  }, [n]);

  if (!panels?.length) return null;

  if (n <= 1) {
    return <PanelBody panel={panels[0]} />;
  }

  const atStart = index <= 0;
  const atEnd = index >= n - 1;

  return (
    <div className="relative">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-contain scroll-smooth touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={`Focus areas at ${job.organization}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              goPrev();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              goNext();
            }
          }}
        >
          {panels.map((panel, i) => (
            <div
              key={panel.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="w-[min(85%,42rem)] shrink-0 snap-center"
            >
              <PanelBody panel={panel} />
            </div>
          ))}
        </div>

        {/* Fade peek of adjacent panel into page background */}
        {!atEnd ? (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[clamp(4.5rem,20vw,8rem)] bg-gradient-to-l from-[var(--paper)] from-[55%] to-transparent"
            aria-hidden
          />
        ) : null}
        {!atStart ? (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[clamp(4.5rem,20vw,8rem)] bg-gradient-to-r from-[var(--paper)] from-[55%] to-transparent"
            aria-hidden
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-between px-0">
          <button
            type="button"
            onClick={goPrev}
            disabled={atStart}
            className="pointer-events-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--paper)]/95 text-[var(--ink)] shadow-[var(--shadow-soft)] backdrop-blur-sm transition hover:bg-[var(--wash)] disabled:pointer-events-none disabled:opacity-35 md:h-11 md:w-11"
            aria-label="Previous focus area"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={atEnd}
            className="pointer-events-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--paper)]/95 text-[var(--ink)] shadow-[var(--shadow-soft)] backdrop-blur-sm transition hover:bg-[var(--wash)] disabled:pointer-events-none disabled:opacity-35 md:h-11 md:w-11"
            aria-label="Next focus area"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Panel {index + 1} of {n}
      </p>
    </div>
  );
}
