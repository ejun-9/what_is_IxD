"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Children, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Same pinned scroll + horizontal scrub + zoom as {@link ScrollCarouselFigures}, for arbitrary panel content.
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

  const startPause = 0.12;
  const endPause = 0.12;
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

  const scale = useTransform(
    scrollYProgress,
    [0, t0, 0.5, t1, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.9, 0.92, 1.1, 1.06, 1.02],
  );

  if (reduceMotion) {
    return <div className={`space-y-6 ${className}`}>{panels}</div>;
  }

  if (n <= 1) {
    return <div className={className}>{panels}</div>;
  }

  const trackWidthPct = n * 100;

  return (
    <div
      ref={pinRef}
      className={`relative mx-auto w-full min-h-[260vh] md:min-h-[300vh] ${className}`}
    >
      <div className="sticky top-0 z-10 flex min-h-[100dvh] flex-col justify-center overflow-visible py-6 md:py-10">
        <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 xl:-mx-16">
          <div className="overflow-hidden px-[min(6%,1.5rem)] md:mx-auto md:max-w-5xl">
            <motion.div
              style={{ scale, transformOrigin: "center center" }}
              className="will-change-transform"
            >
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
                      <div className="w-full max-w-4xl">{panel}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
