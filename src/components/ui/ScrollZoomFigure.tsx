"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

/** Scroll-linked scale so figures feel like they “zoom in” as you move down the page. */
export function ScrollZoomFigure({ src, alt, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 1],
    reduceMotion ? [1, 1, 1, 1] : [0.74, 1.22, 1.14, 1],
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-visible py-3 sm:py-4 md:min-h-[min(56vh,440px)] md:py-5 ${className}`}
    >
      <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 xl:-mx-16">
        <div className="rounded-xl p-[min(8%,2.5rem)] md:mx-auto md:max-w-5xl">
          <motion.div
            style={{ scale, transformOrigin: "center center" }}
            className="will-change-transform"
          >
            <img
              src={src}
              alt={alt}
              className="block h-auto w-full rounded-lg shadow-sm ring-1 ring-black/[0.06]"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
