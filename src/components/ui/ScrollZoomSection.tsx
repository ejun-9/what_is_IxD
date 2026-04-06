"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type ScrollZoomSectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Inner wrapper class (e.g. max-width column) */
  innerClassName?: string;
  /** Scale keyframes: start, peak (center of viewport), end */
  scaleRange?: [number, number, number];
  transformOrigin?: string;
  /** No transform on inner wrapper; required for nested `position: sticky` (e.g. scroll-pinned carousels). */
  disableScale?: boolean;
};

function ScrollZoomSectionScaled({
  children,
  id,
  className = "",
  innerClassName = "",
  scaleRange = [0.94, 1, 0.97],
  transformOrigin = "center top",
}: Omit<ScrollZoomSectionProps, "disableScale">) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [1, 1, 1] : scaleRange,
  );

  return (
    <section ref={ref} id={id} className={`relative ${className}`}>
      <motion.div
        className={`will-change-transform ${innerClassName}`}
        style={{ scale, transformOrigin }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export function ScrollZoomSection({
  children,
  id,
  className = "",
  innerClassName = "",
  scaleRange = [0.94, 1, 0.97],
  transformOrigin = "center top",
  disableScale = false,
}: ScrollZoomSectionProps) {
  if (disableScale) {
    return (
      <section id={id} className={`relative ${className}`}>
        <div className={innerClassName}>{children}</div>
      </section>
    );
  }

  return (
    <ScrollZoomSectionScaled
      id={id}
      className={className}
      innerClassName={innerClassName}
      scaleRange={scaleRange}
      transformOrigin={transformOrigin}
    >
      {children}
    </ScrollZoomSectionScaled>
  );
}
