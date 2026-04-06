"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PresentationSection = { id: string; label: string };

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const el = target.closest("input, textarea, select, [contenteditable='true']");
  return Boolean(el);
}

/** Sticky left rail: tick marks; hover opens section list; click to jump. Rail stays visible (no idle fade) so hover always works. */
export function PresentationSectionRail({ sections }: { sections: PresentationSection[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);
  const reducedMotionRef = useRef(false);
  const activeIdRef = useRef<string | null>(sections[0]?.id ?? null);
  activeIdRef.current = activeId;

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .reduce<{ id: string; ratio: number } | null>((acc, e) => {
            const id = e.target.id;
            const r = e.intersectionRatio;
            if (!acc || r > acc.ratio) return { id, ratio: r };
            return acc;
          }, null);
        if (best?.id) setActiveId(best.id);
      },
      { root: null, rootMargin: "-38% 0px -52% 0px", threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1] },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  useEffect(() => {
    if (sections.length === 0) return;
    const ids = sections.map((s) => s.id);

    const scrollToIndex = (index: number) => {
      const i = Math.max(0, Math.min(ids.length - 1, index));
      const id = ids[i];
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({
        behavior: reducedMotionRef.current ? "auto" : "smooth",
        block: "start",
      });
      setActiveId(id);
      try {
        history.replaceState(null, "", `#${id}`);
      } catch {
        /* ignore */
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const current = activeIdRef.current ?? ids[0];
      let idx = ids.indexOf(current);
      if (idx < 0) idx = 0;

      let next: number | null = null;
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === "j" && !e.shiftKey)) {
        next = Math.min(ids.length - 1, idx + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === "k" && !e.shiftKey)) {
        next = Math.max(0, idx - 1);
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = ids.length - 1;
      }

      if (next === null) return;
      if (next === idx) return;

      e.preventDefault();
      scrollToIndex(next);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav
      className="fixed left-0 top-1/2 z-[60] hidden -translate-y-1/2 pl-2 md:block lg:pl-3"
      aria-label="Presentation sections. Hover the rail to see all titles; click a title to jump. Arrow keys also move between sections."
    >
      {/* One hover box: ticks + expanding column stay in flex flow so pointer never “leaves” between tick and labels */}
      <div
        className="flex min-w-0 max-w-[calc(100vw-1rem)] items-start"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        onFocusCapture={() => setMenuOpen(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setMenuOpen(false);
          }
        }}
      >
        <div className="flex shrink-0 flex-col gap-2.5 py-1 pr-1" aria-hidden>
          {sections.map((s) => (
            <span
              key={s.id}
              className={`block h-[2px] rounded-full transition-colors duration-200 ${
                activeId === s.id
                  ? "w-7 bg-[var(--accent)]"
                  : "w-5 bg-[var(--rule-strong)]"
              }`}
            />
          ))}
        </div>

        {/* min-w-0 lets max-width collapse in a flex row (default min-width:auto would block it) */}
        <div
          className={`min-w-0 overflow-hidden transition-[max-width,opacity] duration-200 ease-out ${
            menuOpen ? "max-w-[min(18rem,calc(100vw-4rem))] opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          <div className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] py-2 pl-3 pr-3 shadow-[var(--shadow-soft)]">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Sections
            </p>
            <ul className="max-h-[min(60vh,24rem)] space-y-0.5 overflow-y-auto">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block rounded-md px-2 py-2 text-left text-[13px] leading-snug text-[var(--ink)] outline-none transition-colors hover:bg-[var(--wash)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] ${
                      activeId === s.id
                        ? "bg-[var(--wash)] font-medium text-[var(--accent)]"
                        : "font-normal"
                    }`}
                    onClick={() => {
                      setActiveId(s.id);
                      try {
                        history.replaceState(null, "", `#${s.id}`);
                      } catch {
                        /* ignore */
                      }
                    }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
