"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Slide = { src: string; alt: string };

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

/**
 * Horizontal carousel: chevron navigation, snap scrolling, peek of adjacent slides (no scroll-scrub zoom).
 */
export function ScrollCarouselFigures({ slides }: { slides: Slide[] }) {
  const n = slides.length;
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

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(n - 1, i));
      setIndex(clamped);
      const el = itemRefs.current[clamped];
      if (!el) return;
      el.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    },
    [n, reducedMotion],
  );

  const goPrev = useCallback(() => goTo(indexRef.current - 1), [goTo]);
  const goNext = useCallback(() => goTo(indexRef.current + 1), [goTo]);

  /** Keep index in sync when the user drags the strip */
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

  if (n <= 1 && slides[0]) {
    return (
      <div className="pt-1.5 pb-0 md:min-h-[min(56vh,400px)] md:pt-2 md:pb-0">
        <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 xl:-mx-16">
          <div className="overflow-hidden rounded-xl p-3 sm:p-4 md:mx-auto md:max-w-5xl md:p-5">
            <img
              src={slides[0].src}
              alt={slides[0].alt}
              className="block h-auto w-full rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  const atStart = index <= 0;
  const atEnd = index >= n - 1;

  return (
    <div className="relative pt-1.5 pb-0 md:pt-2 md:pb-0">
      <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 xl:-mx-16">
        <div className="relative md:mx-auto md:max-w-5xl">
          <div className="overflow-hidden rounded-xl p-3 sm:p-4 md:p-5">
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label="Illustrations"
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
              {slides.map((s, i) => (
                <div
                  key={s.src}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="w-[min(85%,42rem)] shrink-0 snap-center"
                >
                  <img
                    src={s.src}
                    alt={s.alt}
                    className="block h-auto w-full rounded-md"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1 md:px-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={atStart}
              className="pointer-events-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--paper)]/95 text-[var(--ink)] shadow-[var(--shadow-soft)] backdrop-blur-sm transition hover:bg-[var(--wash)] disabled:pointer-events-none disabled:opacity-35 md:h-11 md:w-11"
              aria-label="Previous illustration"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={atEnd}
              className="pointer-events-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--paper)]/95 text-[var(--ink)] shadow-[var(--shadow-soft)] backdrop-blur-sm transition hover:bg-[var(--wash)] disabled:pointer-events-none disabled:opacity-35 md:h-11 md:w-11"
              aria-label="Next illustration"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {n}
      </p>
    </div>
  );
}
