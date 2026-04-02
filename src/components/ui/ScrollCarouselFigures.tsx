"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Slide = { src: string; alt: string };

/**
 * Scroll-scrubbed horizontal carousel: slides move left (next from right), with zoom.
 * Holds at the first slide (start) and last slide (end) so copy can be read.
 */
export function ScrollCarouselFigures({ slides }: { slides: Slide[] }) {
  /** Tall track: scroll distance scrubs the carousel while the slide area stays pinned. */
  const pinRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const n = slides.length;
  const startPause = 0.05;
  const endPause = 0.05;
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
    return (
      <div className="space-y-4">
        {slides.map((s) => (
          <img key={s.src} src={s.src} alt={s.alt} className="w-full rounded-lg ring-1 ring-black/[0.06]" loading="lazy" />
        ))}
      </div>
    );
  }

  if (n <= 1 && slides[0]) {
    return (
      <div className="py-3 md:min-h-[min(56vh,400px)] md:py-5">
        <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 xl:-mx-16">
          <div className="overflow-hidden rounded-xl p-[min(6%,1.5rem)] md:mx-auto md:max-w-5xl">
            <img
              src={slides[0].src}
              alt={slides[0].alt}
              className="block h-auto w-full rounded-lg shadow-sm ring-1 ring-black/[0.06]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  const trackWidthPct = n * 100;

  return (
    <div
      ref={pinRef}
      className="relative mx-auto w-full min-h-[200vh] md:min-h-[240vh]"
    >
      <div className="sticky top-0 z-10 flex min-h-[100dvh] flex-col justify-start overflow-visible pt-4 pb-6 md:pt-5 md:pb-8">
        <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 xl:-mx-16">
          <div className="overflow-hidden rounded-xl p-[min(6%,1.5rem)] md:mx-auto md:max-w-5xl">
            <motion.div
              style={{ scale, transformOrigin: "center center" }}
              className="will-change-transform"
            >
              <div className="overflow-hidden rounded-lg">
                <motion.div
                  className="flex flex-row will-change-transform"
                  style={{ x: translateX, width: `${trackWidthPct}%` }}
                >
                  {slides.map((s) => (
                    <div
                      key={s.src}
                      className="box-border flex shrink-0 justify-center px-1 sm:px-2"
                      style={{ width: `${100 / n}%` }}
                    >
                      <img
                        src={s.src}
                        alt={s.alt}
                        className="block h-auto w-full rounded-md shadow-sm ring-1 ring-black/[0.06]"
                        loading="lazy"
                        decoding="async"
                      />
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
