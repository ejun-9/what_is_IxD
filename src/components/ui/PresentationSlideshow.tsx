"use client";

import { useState, useEffect, useCallback, useMemo, useRef, type SVGProps, type SyntheticEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { CaseStudyBeat, CaseStudyInsightCard, CaseStudyLeadHighlight } from "@/content/profile";
import { CASE_STUDY_ICONS } from "@/components/icons/CaseStudyLearningIcons";

type BeatFigure = NonNullable<CaseStudyBeat["figures"]>[number];
type IconComp = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

/* ─── Accent colours per kicker — warm palette matching site accent #8b7355 ─── */
export const KICKER_ACCENTS: Record<string, string> = {
  "Problem":            "#c4604a",  // terracotta
  "Solution":           "#6a9a6a",  // sage
  "Carry forward":      "#a08860",  // warm tan
  "AI product problem": "#b07838",  // amber-brown
  "Process":            "#c4a070",  // golden tan
  "Outcome":            "#c8a840",  // warm gold
  "Insight":            "#8b7355",  // base accent
  "Context & stakes":   "#c4604a",
  "Research":           "#a08860",
  "AI First experience": "#a08860",
  "Design decisions":   "#6a9a6a",
  "Impact":             "#c8a840",
};
export const DEFAULT_ACCENT = "#8b7355";

const PRESENTATION_PLACEHOLDER_SRC = "/images/presentation-placeholders/on-hover-we-show-code-name.svg";

/** Renders `beat.body` with optional **phrase** emphasis (presentation only). */
function PresentationBeatBody({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\*\*([^*]+)\*\*$/.exec(part);
        if (m) {
          return (
            <strong key={i} className="font-semibold text-white/85">
              {m[1]}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function kickerAccent(kicker?: string) {
  return kicker ? (KICKER_ACCENTS[kicker] ?? DEFAULT_ACCENT) : DEFAULT_ACCENT;
}

/** Second line in the presentation top bar: narrative label for the current slide (e.g. Context, Research). */
export function presentationSectionLabel(
  isIntro: boolean,
  beat: CaseStudyBeat | null,
): string | null {
  if (isIntro) return "Context";
  if (!beat) return null;
  if (beat.insightCardGrid?.length) return "Design";
  if (beat.learningColumns?.length) return "Learnings";
  const k = beat.kicker?.trim();
  if (!k) return null;
  const byKicker: Record<string, string> = {
    "Context & stakes": "Context",
    Research: "Research",
    "AI First experience": "AI First experience",
    "Design decisions": "Design",
    Process: "Process",
    Outcome: "Outcome",
    Impact: "Impact",
    Problem: "Problem",
    Solution: "Solution",
    "Carry forward": "Carry forward",
    "AI product problem": "AI product",
    Insight: "Insight",
  };
  return byKicker[k] ?? k;
}

/* ─── Slide transition variants ─── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? "-28%" : "28%", opacity: 0, scale: 0.96 }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const itm = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ─── Main component ─── */
export function PresentationSlideshow({
  beats,
  chapterTitle,
  lead,
  leadHighlights,
  onClose,
  /** When false, the first slide is `beats[0]` (no separate context/intro slide). */
  includeIntroSlide = true,
}: {
  beats: CaseStudyBeat[];
  chapterTitle: string;
  lead?: string;
  leadHighlights?: CaseStudyLeadHighlight[];
  onClose: () => void;
  includeIntroSlide?: boolean;
}) {
  const total = includeIntroSlide ? beats.length + 1 : beats.length;
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [slideMenuOpen, setSlideMenuOpen] = useState(false);
  const slideMenuRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const slideLabels = useMemo(() => {
    if (includeIntroSlide) {
      return ["Overview", ...beats.map((b) => b.title)];
    }
    return beats.map((b) => b.title);
  }, [includeIntroSlide, beats]);

  const go = useCallback(
    (delta: number) => {
      setSlideMenuOpen(false);
      setDir(delta);
      setCurrent((c) => Math.max(0, Math.min(total - 1, c + delta)));
    },
    [total],
  );

  const goTo = useCallback((i: number) => {
    setSlideMenuOpen(false);
    setDir(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  useEffect(() => {
    if (!slideMenuOpen) return;
    const onDocDown = (e: MouseEvent) => {
      const el = slideMenuRef.current;
      if (el && !el.contains(e.target as Node)) setSlideMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [slideMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (slideMenuOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          setSlideMenuOpen(false);
        }
        return;
      }
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault(); go(1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault(); go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose, slideMenuOpen]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // With intro: slide 0 = intro; slides 1..N = beats[0..N-1]. Without intro: slide i = beats[i].
  const isIntro = includeIntroSlide && current === 0;
  const beatIndex = includeIntroSlide ? current - 1 : current;
  const beat = isIntro ? null : beats[beatIndex];
  const accent = beat ? kickerAccent(beat.kicker) : DEFAULT_ACCENT;
  const progress = ((current + 1) / total) * 100;
  const sectionLine = presentationSectionLabel(isIntro, beat);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "#131110" }}
      role="dialog"
      aria-modal
      aria-label="Presentation mode"
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-6 py-3">
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/25">
            {chapterTitle}
          </span>
          {sectionLine ? (
            <span className="text-[10px] font-medium tracking-[0.12em] text-white/18">
              {sectionLine}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-5">
          <div ref={slideMenuRef} className="relative flex items-center">
            <button
              type="button"
              onClick={() => setSlideMenuOpen((o) => !o)}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[11px] text-white/22 transition hover:bg-white/[0.07] hover:text-white/50"
              aria-expanded={slideMenuOpen}
              aria-haspopup="listbox"
              aria-label={`Slide ${current + 1} of ${total}. Open list of slides.`}
            >
              {current + 1} / {total}
              <span className="text-[9px] leading-none text-white/35" aria-hidden>
                ▼
              </span>
            </button>
            <AnimatePresence>
              {slideMenuOpen ? (
                <motion.div
                  key="slide-menu"
                  role="listbox"
                  aria-label="Slides"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="scrollbar-none absolute right-0 top-full z-[210] mt-1.5 max-h-[min(55vh,22rem)] w-[min(calc(100vw-2rem),20rem)] overflow-y-auto rounded-lg border border-white/[0.1] bg-[#1b1917] py-1 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.55)]"
                >
                  {slideLabels.map((label, i) => (
                    <button
                      key={`slide-opt-${i}`}
                      type="button"
                      role="option"
                      aria-selected={i === current}
                      onClick={() => goTo(i)}
                      className={`flex w-full gap-2 px-3 py-2 text-left text-[11px] leading-snug transition hover:bg-white/[0.06] ${
                        i === current
                          ? "bg-white/[0.08] text-white/90"
                          : "text-white/62 hover:text-white/88"
                      }`}
                    >
                      <span className="w-5 shrink-0 font-mono text-[10px] text-white/30">
                        {i + 1}
                      </span>
                      <span className="min-w-0 line-clamp-4">{label}</span>
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <button
            onClick={onClose}
            className="rounded px-2.5 py-1 text-[11px] text-white/32 transition hover:bg-white/[0.07] hover:text-white/60"
          >
            esc · exit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] shrink-0 bg-white/[0.05]">
        <motion.div
          className="h-full"
          style={{ background: accent }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      {/* Slide area */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={current}
            custom={dir}
            variants={reduce ? {} : slideVariants}
            initial={reduce ? false : "enter"}
            animate="center"
            exit={reduce ? undefined : "exit"}
            transition={{ duration: 0.44, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex flex-col overflow-hidden"
          >
            <div className="flex min-h-0 flex-1 flex-col">
              {isIntro ? (
                <IntroSlide
                  chapterTitle={chapterTitle}
                  lead={lead}
                  leadHighlights={leadHighlights}
                  reduce={!!reduce}
                />
              ) : beat ? (
                <SlideContent beat={beat} accent={accent} reduce={!!reduce} />
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/[0.07] px-6 py-4">
        <button
          onClick={() => go(-1)}
          disabled={current === 0}
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/40 transition hover:border-white/30 hover:text-white/75 disabled:pointer-events-none disabled:opacity-20"
        >
          ← Prev
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-200 hover:opacity-80"
              style={{
                width: i === current ? "1.25rem" : "0.375rem",
                height: "0.375rem",
                background: i === current ? accent : "rgba(255,255,255,0.16)",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          disabled={current === total - 1}
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/40 transition hover:border-white/30 hover:text-white/75 disabled:pointer-events-none disabled:opacity-20"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/* ─── Intro / context slide ─── */
function IntroSlide({
  chapterTitle,
  lead,
  leadHighlights,
  reduce,
}: {
  chapterTitle: string;
  lead?: string;
  leadHighlights?: CaseStudyLeadHighlight[];
  reduce: boolean;
}) {
  return (
    <div className="scrollbar-none flex min-h-0 flex-1 flex-col overflow-y-auto px-10 py-14 lg:px-16 lg:py-16">
      <div className="w-full max-w-2xl">
        <motion.div
          variants={reduce ? {} : stagger}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          <motion.p
            variants={reduce ? {} : itm}
            className="mb-4 text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: DEFAULT_ACCENT }}
          >
            Context
          </motion.p>

          <motion.h2
            variants={reduce ? {} : itm}
            className="font-display font-medium leading-[1.08] tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}
          >
            {chapterTitle}
          </motion.h2>

          {lead ? (
            <motion.p
              variants={reduce ? {} : itm}
              className="mt-5 text-base leading-relaxed text-white/50 md:text-lg"
            >
              {lead}
            </motion.p>
          ) : null}

          {leadHighlights && leadHighlights.length > 0 ? (
            <motion.ul
              variants={reduce ? {} : itm}
              className="mt-8 space-y-5 border-l-2 pl-5"
              style={{ borderColor: `${DEFAULT_ACCENT}60` }}
            >
              {leadHighlights.map((h) => (
                <li key={h.label}>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: DEFAULT_ACCENT }}
                  >
                    {h.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/50 md:text-base">
                    {h.text}
                  </p>
                </li>
              ))}
            </motion.ul>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── SVG diagram: Analyst → Cohort Builder → Patient Groups ─── */
function CohortBuilderDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <svg
        viewBox="0 0 400 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-label="Diagram: Analyst uses Cohort Builder to define Patient Groups"
      >
        {/* ── Person (Analyst) ── */}
        <g>
          {/* Head */}
          <circle cx="60" cy="60" r="22" stroke="#c4a882" strokeWidth="1.5" fill="rgba(196,168,130,0.08)" />
          {/* Body */}
          <path d="M30 120 Q30 95 60 95 Q90 95 90 120 L90 148 L30 148 Z" stroke="#c4a882" strokeWidth="1.5" fill="rgba(196,168,130,0.08)" strokeLinejoin="round" />
          {/* Arms */}
          <path d="M30 105 L12 130 M90 105 L108 130" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" />
          {/* Label */}
          <text x="60" y="168" textAnchor="middle" fill="rgba(250,247,242,0.45)" fontSize="11" fontFamily="Georgia, serif" letterSpacing="0.04em">Analyst</text>
          {/* Sub-label */}
          <text x="60" y="183" textAnchor="middle" fill="rgba(250,247,242,0.25)" fontSize="9" fontFamily="Georgia, serif">healthcare data</text>
        </g>

        {/* ── Arrow 1 ── */}
        <g>
          <path d="M115 100 L157 100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
          <path d="M153 95 L160 100 L153 105" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── Cohort Builder box ── */}
        <g>
          <rect x="165" y="56" width="72" height="88" rx="12" stroke="#8b7355" strokeWidth="1.5" fill="rgba(139,115,85,0.1)" />
          {/* Screen lines mimicking UI */}
          <rect x="174" y="68" width="54" height="6" rx="2" fill="rgba(139,115,85,0.35)" />
          <rect x="174" y="80" width="38" height="4" rx="2" fill="rgba(139,115,85,0.2)" />
          <rect x="174" y="89" width="44" height="4" rx="2" fill="rgba(139,115,85,0.2)" />
          {/* Aggregate panel mini-card */}
          <rect x="174" y="100" width="24" height="18" rx="3" fill="rgba(139,115,85,0.2)" />
          <rect x="202" y="100" width="24" height="18" rx="3" fill="rgba(139,115,85,0.2)" />
          {/* Bar charts inside mini-cards */}
          <rect x="177" y="110" width="4" height="5" rx="1" fill="rgba(139,115,85,0.6)" />
          <rect x="182" y="106" width="4" height="9" rx="1" fill="rgba(139,115,85,0.6)" />
          <rect x="187" y="108" width="4" height="7" rx="1" fill="rgba(139,115,85,0.6)" />
          <rect x="205" y="107" width="4" height="8" rx="1" fill="rgba(139,115,85,0.6)" />
          <rect x="210" y="110" width="4" height="5" rx="1" fill="rgba(139,115,85,0.6)" />
          <rect x="215" y="105" width="4" height="10" rx="1" fill="rgba(139,115,85,0.6)" />
          {/* Label */}
          <text x="201" y="160" textAnchor="middle" fill="rgba(250,247,242,0.45)" fontSize="11" fontFamily="Georgia, serif" letterSpacing="0.04em">Cohort Builder</text>
          <text x="201" y="175" textAnchor="middle" fill="rgba(250,247,242,0.25)" fontSize="9" fontFamily="Georgia, serif">no-code / low-code</text>
        </g>

        {/* ── Arrow 2 ── */}
        <g>
          <path d="M240 100 L278 100" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
          <path d="M274 95 L281 100 L274 105" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── Patient Groups (overlapping circles) ── */}
        <g>
          {/* Group A */}
          <circle cx="318" cy="78" r="26" stroke="#c4a070" strokeWidth="1.5" fill="rgba(196,160,112,0.1)" />
          <text x="318" y="74" textAnchor="middle" fill="rgba(196,160,112,0.75)" fontSize="8" fontFamily="Georgia, serif">Disease</text>
          <text x="318" y="84" textAnchor="middle" fill="rgba(196,160,112,0.75)" fontSize="8" fontFamily="Georgia, serif">cohort</text>
          {/* Group B */}
          <circle cx="335" cy="108" r="26" stroke="#a08860" strokeWidth="1.5" fill="rgba(160,136,96,0.1)" />
          <text x="335" y="104" textAnchor="middle" fill="rgba(160,136,96,0.75)" fontSize="8" fontFamily="Georgia, serif">Demo-</text>
          <text x="335" y="114" textAnchor="middle" fill="rgba(160,136,96,0.75)" fontSize="8" fontFamily="Georgia, serif">graphics</text>
          {/* Group C */}
          <circle cx="306" cy="110" r="26" stroke="#c4604a" strokeWidth="1.5" fill="rgba(196,96,74,0.08)" />
          <text x="306" y="106" textAnchor="middle" fill="rgba(196,96,74,0.75)" fontSize="8" fontFamily="Georgia, serif">Clinical</text>
          <text x="306" y="116" textAnchor="middle" fill="rgba(196,96,74,0.75)" fontSize="8" fontFamily="Georgia, serif">trial</text>
          {/* Label */}
          <text x="320" y="152" textAnchor="middle" fill="rgba(250,247,242,0.45)" fontSize="11" fontFamily="Georgia, serif" letterSpacing="0.04em">Patient Groups</text>
          <text x="320" y="167" textAnchor="middle" fill="rgba(250,247,242,0.25)" fontSize="9" fontFamily="Georgia, serif">defined cohorts</text>
        </g>

        {/* ── Bottom note ── */}
        <text x="200" y="230" textAnchor="middle" fill="rgba(250,247,242,0.18)" fontSize="10" fontFamily="Georgia, serif" fontStyle="italic">
          followed over time for research or clinical use
        </text>

        {/* ── Time arrow ── */}
        <path d="M80 248 L320 248" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" />
        <path d="M316 244 L322 248 L316 252" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <text x="80" y="264" fill="rgba(250,247,242,0.18)" fontSize="9" fontFamily="Georgia, serif">observe</text>
        <text x="280" y="264" fill="rgba(250,247,242,0.18)" fontSize="9" fontFamily="Georgia, serif">over time →</text>
      </svg>
    </motion.div>
  );
}

/* ─── Slide layout router ─── */
function SlideContent({ beat, accent, reduce }: { beat: CaseStudyBeat; accent: string; reduce: boolean }) {
  const BeatIcon: IconComp | null = beat.icon ? CASE_STUDY_ICONS[beat.icon] : null;
  const figures = beat.figures ?? [];
  const hasFigure = figures.length > 0;
  const hasLearningColumns = Boolean(beat.learningColumns?.length);
  const hasInsightCardGrid = Boolean(beat.insightCardGrid?.length);
  const useCarousel = Boolean(beat.figuresCarousel && figures.length > 1);

  if (hasInsightCardGrid && beat.insightCardGrid) {
    return <InsightCardGridSlide beat={beat} accent={accent} reduce={reduce} />;
  }
  if (hasLearningColumns && beat.learningColumns) {
    return <LearningsSlide beat={beat} accent={accent} reduce={reduce} />;
  }
  if (hasFigure) {
    return <FigureSlide beat={beat} accent={accent} BeatIcon={BeatIcon} figures={figures} useCarousel={useCarousel} reduce={reduce} />;
  }
  return <TextSlide beat={beat} accent={accent} BeatIcon={BeatIcon} reduce={reduce} />;
}

/* ─── Kicker label ─── */
function KickerLabel({ kicker, accent }: { kicker: string; accent: string }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2.5">
      <span className="block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: accent }}>
        {kicker}
      </span>
    </div>
  );
}

/* ─── Text slide (no figures): same split layout as FigureSlide, placeholder + email on the right ─── */
function TextSlide({
  beat,
  accent,
  BeatIcon,
  reduce,
}: {
  beat: CaseStudyBeat;
  accent: string;
  BeatIcon: IconComp | null;
  reduce: boolean;
}) {
  const prototypeHref = beat.prototypeCta?.href?.trim() ?? "";
  const textSlideFigures = beat.textSlideFigures ?? [];
  const useTextSlideTwoUp = textSlideFigures.length >= 2;

  if (beat.presentationTextOnly) {
    return (
      <div className="scrollbar-none flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-12 md:px-16 md:py-16">
        <motion.div
          variants={reduce ? {} : stagger}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col"
        >
          <div className="shrink-0">
            {beat.kicker ? (
              <motion.div variants={reduce ? {} : itm}>
                <KickerLabel kicker={beat.kicker} accent={accent} />
              </motion.div>
            ) : null}
            {BeatIcon ? (
              <motion.div variants={reduce ? {} : itm} className="mb-5">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/12"
                  style={{ color: accent, background: `${accent}1a` }}
                >
                  <BeatIcon className="h-6 w-6" />
                </span>
              </motion.div>
            ) : null}
            {beat.title.trim() ? (
              <motion.h2
                variants={reduce ? {} : itm}
                className="font-display font-medium leading-[1.1] tracking-tight text-white"
                style={{ fontSize: "clamp(1.75rem, 3.2vw, 3rem)" }}
              >
                {beat.title}
              </motion.h2>
            ) : null}
          </div>
          {beat.body.trim() ? (
            <div className="scrollbar-none mt-4 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1 [-webkit-overflow-scrolling:touch]">
              <motion.p
                variants={reduce ? {} : itm}
                className="max-w-none whitespace-pre-line text-base leading-relaxed text-white/48 md:text-lg"
              >
                <PresentationBeatBody text={beat.body} />
              </motion.p>
            </div>
          ) : null}
          {beat.prototypeCta && prototypeHref ? (
            <motion.div variants={reduce ? {} : itm} className="mt-8 shrink-0 border-t border-transparent pt-2">
              <p className="mb-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-white/28">
                {beat.prototypeCta.intro}
              </p>
              <a
                href={prototypeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition hover:opacity-75"
                style={{ borderColor: accent, color: accent }}
              >
                {beat.prototypeCta.label} ↗
              </a>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    );
  }
  const displayedTextSlideFigures = textSlideFigures.slice(0, 2);
  const textSlideImageClass =
    "mx-auto block aspect-[4/3] w-full overflow-hidden rounded-[3rem] object-contain p-2";
  const textSlideSingleFullWidthImageClass =
    "mx-auto block h-auto w-full max-w-[96%] overflow-hidden rounded-[3rem] object-contain p-2";
  const textSlideGridClass =
    displayedTextSlideFigures.length >= 2
      ? "mx-auto grid w-full grid-cols-1 justify-items-center gap-4 md:grid-cols-2"
      : "mx-auto grid w-full max-w-6xl grid-cols-1 justify-items-center gap-4";
  const useTextSlideFullWidth = Boolean(beat.textSlideFullWidth) && textSlideFigures.length >= 1;
  if (useTextSlideFullWidth) {
    return (
      <div className="scrollbar-none flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-white/[0.025] px-6 py-8 lg:px-10 lg:py-12">
        <div className="flex min-h-0 w-full max-w-6xl flex-col">
          <p className="mb-2.5 shrink-0 text-center text-[11px] font-medium tracking-[0.14em] uppercase text-white/28">
            Design Decisions
          </p>
          <div className={textSlideGridClass}>
            {displayedTextSlideFigures.map((fig) => (
              <div key={fig.src} className="min-h-0 w-full">
                {displayedTextSlideFigures.length === 1 ? (
                  <div className="scrollbar-none max-h-[min(88vh,960px)] w-full overflow-y-auto overflow-x-hidden">
                    <motion.img
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      src={fig.src}
                      alt={fig.alt}
                      className={textSlideSingleFullWidthImageClass}
                      draggable={false}
                    />
                  </div>
                ) : (
                  <motion.img
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    src={fig.src}
                    alt={fig.alt}
                    className={textSlideImageClass}
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="flex min-h-0 flex-col px-8 py-12 lg:w-[42%] lg:px-12 lg:py-16">
        <motion.div
          variants={reduce ? {} : stagger}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          <div className="shrink-0">
            {beat.kicker ? (
              <motion.div variants={reduce ? {} : itm}>
                <KickerLabel kicker={beat.kicker} accent={accent} />
              </motion.div>
            ) : null}

            {BeatIcon ? (
              <motion.div variants={reduce ? {} : itm} className="mb-5">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/12"
                  style={{ color: accent, background: `${accent}1a` }}
                >
                  <BeatIcon className="h-6 w-6" />
                </span>
              </motion.div>
            ) : null}

            {beat.title.trim() ? (
              <motion.h2
                variants={reduce ? {} : itm}
                className="font-display font-medium leading-[1.1] tracking-tight text-white"
                style={{ fontSize: "clamp(1.75rem, 3.2vw, 3rem)" }}
              >
                {beat.title}
              </motion.h2>
            ) : null}
          </div>

          {beat.body.trim() ? (
            <div className="scrollbar-none mt-4 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1 [-webkit-overflow-scrolling:touch]">
              <motion.p
                variants={reduce ? {} : itm}
                className="max-w-none whitespace-pre-line text-base leading-relaxed text-white/48 md:text-lg"
              >
                <PresentationBeatBody text={beat.body} />
              </motion.p>
            </div>
          ) : null}

          {beat.prototypeCta && prototypeHref ? (
            <motion.div variants={reduce ? {} : itm} className="mt-6 shrink-0 border-t border-transparent pt-2">
              <p className="mb-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-white/28">
                {beat.prototypeCta.intro}
              </p>
              <a
                href={prototypeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition hover:opacity-75"
                style={{ borderColor: accent, color: accent }}
              >
                {beat.prototypeCta.label} ↗
              </a>
            </motion.div>
          ) : null}
        </motion.div>
      </div>

      <div className="scrollbar-none flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-white/[0.025] px-6 py-8 lg:px-10 lg:py-12">
        {useTextSlideTwoUp ? (
          <div className="w-full max-w-3xl">
            <p className="mb-2.5 text-center text-[11px] font-medium tracking-[0.14em] uppercase text-white/28">
              Design Decisions
            </p>
            <div className={textSlideGridClass}>
              {displayedTextSlideFigures.map((fig) => (
                <div key={fig.src} className="block w-full">
                  <motion.img
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    src={fig.src}
                    alt={fig.alt}
                    className={textSlideImageClass}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <motion.img
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              src={PRESENTATION_PLACEHOLDER_SRC}
              alt="Placeholder"
              className="block h-auto w-full rounded-xl"
              draggable={false}
            />
            <p className="mt-3 text-center font-mono text-[11px] tracking-[0.08em] text-white/22">
              placeholder@email.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Figure slide: text left, image right ─── */
function FigureSlide({
  beat,
  accent,
  BeatIcon,
  figures,
  useCarousel,
  reduce,
}: {
  beat: CaseStudyBeat;
  accent: string;
  BeatIcon: IconComp | null;
  figures: BeatFigure[];
  useCarousel: boolean;
  reduce: boolean;
}) {
  const prototypeHref = beat.prototypeCta?.href?.trim() ?? "";
  const hasAnyFigures = figures.length > 0;
  const figureSignature = figures.map((fig) => fig.src).join("|");
  const isActivationProblemSlide = beat.title.trim() === "The activation problem";
  const interactiveFigures = !useCarousel && figures.length > 1 ? figures : null;
  const stackedImages: BeatFigure[] = useCarousel ? figures : [];
  const showImageStack = useCarousel && stackedImages.length > 0;
  const [interactiveIndex, setInteractiveIndex] = useState(0);
  const [interactiveAspect, setInteractiveAspect] = useState<number | null>(null);
  const [showActivationOverlay, setShowActivationOverlay] = useState(false);
  const [activationSecondFrameVisible, setActivationSecondFrameVisible] = useState(false);
  const activationSwapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactiveFigure = interactiveFigures ? interactiveFigures[interactiveIndex] : figures[0];
  const shouldScaleInteractiveFrame = interactiveFigure?.src.includes("frame-16451.svg");
  const decorativePlaceholderZoom =
    !useCarousel && !interactiveFigures && figures.length === 1 && figures[0]?.src.includes("on-hover-we-show-code-name");

  useEffect(() => {
    setInteractiveIndex(0);
    setInteractiveAspect(null);
  }, [beat.title, interactiveFigures?.map((fig) => fig.src).join("|")]);

  useEffect(() => {
    setShowActivationOverlay(false);
    setActivationSecondFrameVisible(false);
    if (activationSwapTimeoutRef.current) {
      clearTimeout(activationSwapTimeoutRef.current);
      activationSwapTimeoutRef.current = null;
    }
    return () => {
      if (activationSwapTimeoutRef.current) {
        clearTimeout(activationSwapTimeoutRef.current);
        activationSwapTimeoutRef.current = null;
      }
    };
  }, [beat.title, figureSignature]);

  const handleInteractiveImageClick = () => {
    if (!interactiveFigures?.length) return;
    setInteractiveIndex((idx) => (idx + 1) % interactiveFigures.length);
  };

  const handleInteractiveImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    if (interactiveAspect) return;
    setInteractiveAspect(naturalWidth / naturalHeight);
  };

  const handleActivationSlideClick = () => {
    if (!isActivationProblemSlide || showActivationOverlay || activationSecondFrameVisible) return;
    setShowActivationOverlay(true);
    activationSwapTimeoutRef.current = setTimeout(() => {
      setShowActivationOverlay(false);
      setActivationSecondFrameVisible(true);
      activationSwapTimeoutRef.current = null;
    }, 2200);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* Left: kicker / title fixed; body scrolls independently */}
      <div className="flex min-h-0 flex-col px-8 py-12 lg:w-[42%] lg:px-12 lg:py-16">
        <motion.div
          variants={reduce ? {} : stagger}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          <div className="shrink-0">
            {beat.kicker ? (
              <motion.div variants={reduce ? {} : itm}>
                <KickerLabel kicker={beat.kicker} accent={accent} />
              </motion.div>
            ) : null}

            {BeatIcon ? (
              <motion.div variants={reduce ? {} : itm} className="mb-5">
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/12"
                  style={{ color: accent, background: `${accent}1a` }}
                >
                  <BeatIcon className="h-6 w-6" />
                </span>
              </motion.div>
            ) : null}

            <motion.h2
              variants={reduce ? {} : itm}
              className="font-display font-medium leading-[1.1] tracking-tight text-white"
              style={{ fontSize: "clamp(1.75rem, 3.2vw, 3rem)" }}
            >
              {beat.title}
            </motion.h2>
          </div>

          {beat.body.trim() || beat.figureSlideInsightCard ? (
            <div className="scrollbar-none mt-4 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1 [-webkit-overflow-scrolling:touch]">
              {beat.body.trim() ? (
                <motion.p
                  variants={reduce ? {} : itm}
                  className="whitespace-pre-line text-base leading-relaxed text-white/48 md:text-lg"
                >
                  <PresentationBeatBody text={beat.body} />
                </motion.p>
              ) : null}
              {beat.figureSlideInsightCard ? (
                <InsightCardPresentation
                  card={beat.figureSlideInsightCard}
                  beatAccent={accent}
                  reduce={reduce}
                  layout="inline"
                />
              ) : null}
            </div>
          ) : null}

          {beat.prototypeCta && prototypeHref ? (
            <motion.div variants={reduce ? {} : itm} className="mt-6 shrink-0 border-t border-transparent pt-2">
              <p className="mb-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-white/28">
                {beat.prototypeCta.intro}
              </p>
              <a
                href={prototypeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition hover:opacity-75"
                style={{ borderColor: accent, color: accent }}
              >
                {beat.prototypeCta.label} ↗
              </a>
            </motion.div>
          ) : null}
        </motion.div>
      </div>

      {/* Right: figure (independent scroll if stack is tall) */}
      <div className="scrollbar-none flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-white/[0.025] px-6 py-8 lg:px-10 lg:py-12">
        <div className="w-full max-w-2xl origin-center scale-[0.92]">
        {isActivationProblemSlide && figures.length >= 2 ? (
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={handleActivationSlideClick}
              className="group relative block w-full text-left"
              aria-label="Simulate 60 minute wait"
            >
              {!activationSecondFrameVisible ? (
                <div
                  className="relative w-full overflow-hidden rounded-xl bg-black/20"
                  style={{ aspectRatio: interactiveAspect ?? 549 / 364 }}
                >
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={figures[0]?.src}
                      src={figures[0]?.src}
                      alt={figures[0]?.alt ?? ""}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1, ease: "linear" }}
                      className={`absolute right-0 bottom-0 h-full w-full object-contain transition-opacity duration-300 ${
                        showActivationOverlay ? "opacity-35" : "opacity-100"
                      }`}
                      draggable={false}
                      onLoad={handleInteractiveImageLoad}
                    />
                  </AnimatePresence>
                  {showActivationOverlay ? (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/55 px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase text-white/90 backdrop-blur-sm">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/85 border-t-transparent" />
                        60 mins later...
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="scrollbar-none max-h-[min(85vh,900px)] w-full overflow-y-auto overflow-x-hidden rounded-xl bg-black/20">
                  <motion.img
                    key={figures[1]?.src}
                    src={figures[1]?.src}
                    alt={figures[1]?.alt ?? ""}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="block h-auto w-full max-w-full"
                    draggable={false}
                  />
                </div>
              )}
            </button>
          </div>
        ) : showImageStack ? (
          <div className="flex w-full max-w-2xl flex-col gap-4">
            {stackedImages.map((fig) => (
              <motion.img
                key={fig.src}
                src={fig.src}
                alt={fig.alt ?? ""}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="block h-auto w-full rounded-xl"
                draggable={false}
              />
            ))}
          </div>
        ) : interactiveFigures ? (
          <div className="relative w-full max-w-2xl">
            <button
              type="button"
              onClick={handleInteractiveImageClick}
              className="group relative block w-full text-left"
              aria-label="Show next image"
            >
              <div
                className="relative w-full overflow-hidden rounded-xl bg-black/20"
                style={{ aspectRatio: interactiveAspect ?? 549 / 364 }}
              >
                <AnimatePresence mode="sync">
                  <motion.img
                    key={interactiveFigure?.src}
                    src={interactiveFigure?.src}
                    alt={interactiveFigure?.alt ?? ""}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.08, ease: "linear" }}
                    className={`absolute right-0 bottom-0 h-full w-full object-contain transition-transform duration-150 ${
                      shouldScaleInteractiveFrame ? "scale-[1.06]" : "scale-100"
                    }`}
                    draggable={false}
                    onLoad={handleInteractiveImageLoad}
                  />
                </AnimatePresence>
              </div>
            </button>
          </div>
        ) : hasAnyFigures ? (
          <div className="relative w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={figures[0]?.src}
                src={figures[0]?.src}
                alt={figures[0]?.alt ?? ""}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: decorativePlaceholderZoom ? 1.08 : 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="block h-auto w-full rounded-xl"
                draggable={false}
              />
            </AnimatePresence>
          </div>
        ) : null}
        </div>
      </div>
    </div>
  );
}

/** Same shell as cards in `InsightCardGridSlide` — grid columns vs inline under figure-slide body. */
function InsightCardPresentation({
  card,
  beatAccent,
  reduce,
  layout,
}: {
  card: CaseStudyInsightCard;
  beatAccent: string;
  reduce: boolean;
  layout: "grid" | "inline";
}) {
  const cardAccent = kickerAccent(card.kicker);
  const Icon = card.icon ? CASE_STUDY_ICONS[card.icon] : null;
  const ctaHref = card.prototypeCta?.href?.trim() ?? "";
  const shellClass =
    layout === "grid"
      ? "flex min-h-0 flex-col rounded-2xl border border-white/[0.09] p-6 md:min-h-[min(520px,70vh)] md:p-7"
      : "mt-6 flex min-h-0 flex-col rounded-2xl border border-white/[0.09] p-6 md:p-7";

  return (
    <motion.div variants={reduce ? {} : itm} className={shellClass} style={{ background: `${beatAccent}0d` }}>
      {card.kicker ? (
        <div className="mb-4">
          <KickerLabel kicker={card.kicker} accent={cardAccent} />
        </div>
      ) : null}
      {Icon ? (
        <span
          className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"
          style={{ color: cardAccent, background: `${cardAccent}20` }}
        >
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
      <h3 className="mb-3 text-base font-medium leading-snug text-white md:text-[17px]">{card.title}</h3>
      <div className="min-h-0 flex-1 text-left whitespace-pre-line text-sm leading-relaxed text-white/48 md:text-base">
        <PresentationBeatBody text={card.body} />
      </div>
      {card.prototypeCta && ctaHref ? (
        <motion.div variants={reduce ? {} : itm} className="mt-5 shrink-0 border-t border-white/[0.08] pt-4">
          <p className="mb-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-white/28">
            {card.prototypeCta.intro}
          </p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition hover:opacity-75"
            style={{ borderColor: cardAccent, color: cardAccent }}
          >
            {card.prototypeCta.label} ↗
          </a>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

/* ─── Merged beats: 3-column card grid (trust / process / outcome) ─── */
function InsightCardGridSlide({
  beat,
  accent,
  reduce,
}: {
  beat: CaseStudyBeat;
  accent: string;
  reduce: boolean;
}) {
  const cards = beat.insightCardGrid ?? [];
  return (
    <div className="scrollbar-none flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-12 md:px-12 md:py-14">
      <motion.div
        variants={reduce ? {} : stagger}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="mx-auto w-full max-w-6xl"
      >
        {beat.title.trim() ? (
          <motion.h2
            variants={reduce ? {} : itm}
            className="mb-8 font-display text-3xl font-medium tracking-tight text-white md:mb-10 md:text-4xl"
          >
            {beat.title}
          </motion.h2>
        ) : null}

        <div className="grid gap-5 md:grid-cols-3 md:gap-7">
          {cards.map((card, i) => (
            <InsightCardPresentation
              key={`${card.title}-${i}`}
              card={card}
              beatAccent={accent}
              reduce={reduce}
              layout="grid"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Learnings slide: 3-column grid ─── */
function LearningsSlide({
  beat,
  accent,
  reduce,
}: {
  beat: CaseStudyBeat;
  accent: string;
  reduce: boolean;
}) {
  const cols = beat.learningColumns ?? [];
  return (
    <div className="scrollbar-none flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-12 md:px-12 md:py-14">
      <motion.div
        variants={reduce ? {} : stagger}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <motion.h2
          variants={reduce ? {} : itm}
          className="mb-8 font-display text-3xl font-medium tracking-tight text-white md:mb-10 md:text-4xl"
        >
          {beat.title}
        </motion.h2>

        <div className="grid gap-5 md:grid-cols-3 md:gap-7">
          {cols.map((col, i) => {
            const Icon = col.icon ? CASE_STUDY_ICONS[col.icon] : null;
            return (
              <motion.div
                key={`${col.title}-${i}`}
                variants={reduce ? {} : itm}
                className="flex flex-col rounded-2xl border border-white/[0.09] p-6 md:p-7"
                style={{ background: `${accent}0d` }}
              >
                {Icon ? (
                  <span
                    className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"
                    style={{ color: accent, background: `${accent}20` }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                ) : null}
                <h3 className="mb-3 text-base font-medium leading-snug text-white md:text-[17px]">
                  {col.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/48 md:text-base">
                  {col.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
