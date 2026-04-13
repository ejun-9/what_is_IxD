"use client";

import { useState, useEffect, useCallback, type SVGProps } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { CaseStudyBeat, CaseStudyLeadHighlight } from "@/content/profile";
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
  "Design decisions":   "#6a9a6a",
  "Impact":             "#c8a840",
};
export const DEFAULT_ACCENT = "#8b7355";

const PRESENTATION_PLACEHOLDER_SRC = "/images/presentation-placeholders/slide-placeholder.svg";

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
  if (beat.learningColumns?.length) return "Learnings";
  const k = beat.kicker?.trim();
  if (!k) return null;
  const byKicker: Record<string, string> = {
    "Context & stakes": "Context",
    Research: "Research",
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
  const reduce = useReducedMotion();

  const go = useCallback(
    (delta: number) => {
      setDir(delta);
      setCurrent((c) => Math.max(0, Math.min(total - 1, c + delta)));
    },
    [total],
  );

  const goTo = useCallback((i: number) => {
    setDir(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault(); go(1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault(); go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

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
          <span className="font-mono text-[11px] text-white/22">
            {current + 1} / {total}
          </span>
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
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-10 py-14 lg:px-16 lg:py-16">
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
  const useCarousel = Boolean(beat.figuresCarousel && figures.length > 1);

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

            <motion.h2
              variants={reduce ? {} : itm}
              className="font-display font-medium leading-[1.1] tracking-tight text-white"
              style={{ fontSize: "clamp(1.75rem, 3.2vw, 3rem)" }}
            >
              {beat.title}
            </motion.h2>
          </div>

          {beat.body.trim() ? (
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1 [-webkit-overflow-scrolling:touch]">
              <motion.p
                variants={reduce ? {} : itm}
                className="max-w-none whitespace-pre-line text-base leading-relaxed text-white/48 md:text-lg"
              >
                {beat.body}
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

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-white/[0.025] px-6 py-8 lg:px-10 lg:py-12">
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
  const pairedFigures =
    Boolean(figures[0]?.clickRevealCaption?.trim() && figures[1]) ? figures.slice(0, 2) : null;
  const stackedImages: BeatFigure[] = useCarousel ? figures : pairedFigures ?? [];
  const showImageStack =
    stackedImages.length > 0 && (useCarousel || Boolean(pairedFigures));

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

          {beat.body.trim() ? (
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1 [-webkit-overflow-scrolling:touch]">
              <motion.p
                variants={reduce ? {} : itm}
                className="whitespace-pre-line text-base leading-relaxed text-white/48 md:text-lg"
              >
                {beat.body}
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

      {/* Right: figure (independent scroll if stack is tall) */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-white/[0.025] px-6 py-8 lg:px-10 lg:py-12">
        {showImageStack ? (
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
        ) : (
          <div className="relative w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={figures[0]?.src}
                src={figures[0]?.src}
                alt={figures[0]?.alt ?? ""}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="block h-auto w-full rounded-xl"
                draggable={false}
              />
            </AnimatePresence>
          </div>
        )}
      </div>
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
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-12 md:px-12 md:py-14">
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

        {beat.body.trim() ? (
          <motion.p
            variants={reduce ? {} : itm}
            className="mt-10 max-w-3xl whitespace-pre-line border-t border-white/[0.08] pt-8 text-base leading-relaxed text-white/50 md:text-lg"
          >
            {beat.body}
          </motion.p>
        ) : null}
      </motion.div>
    </div>
  );
}
