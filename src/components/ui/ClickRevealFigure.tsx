"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

type Figure = { src: string; alt: string };

type Props = {
  first: Figure;
  second: Figure;
  caption: string;
};

/** Presentation-style: click first image to advance; click again to return. */
export function ClickRevealFigure({ first, second, caption }: Props) {
  const [revealed, setRevealed] = useState(false);
  /** When true, first slide is entering from the left after going back from slide 2. */
  const [enterFirstFromBack, setEnterFirstFromBack] = useState(false);
  const pendingFirstEnterFromBack = useRef(false);
  const reduceMotion = useReducedMotion();

  function goForward() {
    setEnterFirstFromBack(false);
    setRevealed(true);
  }

  function goBack() {
    setEnterFirstFromBack(true);
    pendingFirstEnterFromBack.current = true;
    setRevealed(false);
  }

  function onFirstSlideAnimationComplete() {
    if (pendingFirstEnterFromBack.current) {
      pendingFirstEnterFromBack.current = false;
      setEnterFirstFromBack(false);
    }
  }

  return (
    <div className="relative pt-1.5 pb-0 sm:pt-2 md:pt-2">
      <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 xl:-mx-16">
        <div className="rounded-xl p-3 sm:p-4 md:mx-auto md:max-w-5xl md:p-5">
          <div className="relative overflow-hidden rounded-lg">
            <AnimatePresence mode="wait" initial={false}>
              {!revealed ? (
                <motion.div
                  key="first"
                  initial={
                    enterFirstFromBack
                      ? reduceMotion
                        ? { opacity: 0 }
                        : { x: "-28%", opacity: 0 }
                      : false
                  }
                  animate={{ x: 0, opacity: 1 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.15 }
                      : { type: "spring", stiffness: 300, damping: 34, mass: 0.75 }
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { x: -28, opacity: 0, transition: { duration: 0.2 } }
                  }
                  onAnimationComplete={onFirstSlideAnimationComplete}
                >
                  <button
                    type="button"
                    onClick={goForward}
                    className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
                    aria-label="Show next slide: time elapsed"
                  >
                    <img
                      src={first.src}
                      alt={first.alt}
                      className="block h-auto w-full rounded-lg transition group-hover:opacity-[0.97]"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="mt-3 block text-center text-xs font-medium tracking-wide text-[var(--muted)]">
                      Click image to advance
                    </span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="second"
                  initial={reduceMotion ? { opacity: 0 } : { x: "100%", opacity: 0 }}
                  animate={reduceMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { x: "100%", opacity: 0, transition: { duration: 0.22 } }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0.15 }
                      : { type: "spring", stiffness: 280, damping: 32, mass: 0.8 }
                  }
                  className="will-change-transform"
                >
                  <button
                    type="button"
                    onClick={goBack}
                    className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
                    aria-label="Return to previous slide"
                  >
                    <img
                      src={second.src}
                      alt={second.alt}
                      className="block h-auto w-full rounded-lg transition group-hover:opacity-[0.97]"
                      loading="lazy"
                      decoding="async"
                    />
                    <p className="mt-4 text-center font-display text-lg font-medium tracking-tight text-[var(--ink)]">
                      {caption}
                    </p>
                    <span className="mt-3 block text-center text-xs font-medium tracking-wide text-[var(--muted)]">
                      Click image to go back
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
