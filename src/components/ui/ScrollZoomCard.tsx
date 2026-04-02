"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Scroll-linked scale so a block can grow past the column (bleed + padding so it isn’t clipped). */
export function ScrollZoomCard({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 1],
    reduceMotion ? [1, 1, 1, 1] : [0.9, 1.12, 1.06, 1],
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-visible py-4 sm:py-6 md:min-h-[min(42vh,360px)] md:py-8 ${className}`}
    >
      <div className="-mx-3 sm:-mx-5 md:-mx-8 lg:-mx-10">
        <div className="p-[min(6%,1.75rem)]">
          <motion.div
            style={{ scale, transformOrigin: "center center" }}
            className="will-change-transform"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
