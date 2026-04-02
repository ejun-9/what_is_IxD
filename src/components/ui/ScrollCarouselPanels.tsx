"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Children, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Pinned scroll + horizontal scrub for arbitrary panel content (no scroll-linked zoom).
 */
export function ScrollCarouselPanels({ children, className = "" }: Props) {
  const pinRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const panels = Children.toArray(children).filter(Boolean);
  const n = panels.length;

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  /** Minimal pauses at start/end so scroll distance matches the scrub (no huge “empty” tail). */
  const startPause = 0.02;
  const endPause = 0.02;
  const t0 = startPause;
  const t1 = 1 - endPause;

  const maxPct = n <= 1 ? 0 : -((n - 1) * 100) / n;

  const translateX = useTransform(
    scrollYProgress,
    [0, t0, t1, 1],
    reduceMotion || n <= 1
      ? ["0%", "0%", "0%", "0%"]
      : ["0%", "0%", `${maxPct}%`, `${maxPct}%`],
  );

  if (reduceMotion) {
    return <div className={`space-y-5 ${className}`}>{panels}</div>;
  }

  if (n <= 1) {
    return <div className={className}>{panels}</div>;
  }

  const trackWidthPct = n * 100;
  /**
   * Pin track must stay taller than the sticky viewport (`min-h-[100dvh]`) or scroll
   * progress never moves smoothly and the section can feel “stuck.”
   * Scales a bit with slide count; floor ~125vh, cap ~170vh.
   */
  const pinMinVh = Math.min(170, Math.max(125, 48 + n * 28));

  return (
    <div
      ref={pinRef}
      className={`relative mx-auto w-full touch-pan-y ${className}`}
      style={{ minHeight: `${pinMinVh}vh` }}
    >
      <div className="sticky top-0 z-10 flex min-h-[100dvh] w-full flex-col justify-center overflow-visible py-4 md:py-6">
        <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 xl:-mx-16">
          <div className="overflow-hidden px-[min(6%,1.5rem)] md:mx-auto md:max-w-5xl">
            <div>
              <div className="overflow-hidden">
                <motion.div
                  className="flex flex-row will-change-transform"
                  style={{ x: translateX, width: `${trackWidthPct}%` }}
                >
                  {panels.map((panel, i) => (
                    <div
                      key={i}
                      className="box-border flex shrink-0 justify-center px-2 sm:px-3"
                      style={{ width: `${100 / n}%` }}
                    >
                      <div className="w-full max-w-5xl">{panel}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
