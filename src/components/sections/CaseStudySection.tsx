"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { ScrollZoomFigure } from "@/components/ui/ScrollZoomFigure";
import { ClickRevealFigure } from "@/components/ui/ClickRevealFigure";
import { ScrollCarouselFigures } from "@/components/ui/ScrollCarouselFigures";
import { CASE_STUDY_ICONS } from "@/components/icons/CaseStudyLearningIcons";
import { PresentationSectionRail } from "@/components/ui/PresentationSectionRail";
import { PresentationSlideshow, kickerAccent } from "@/components/ui/PresentationSlideshow";

type BeatFigure = NonNullable<ProfileContent["caseStudy"]["beats"][number]["figures"]>[number];

function renderBeatFigures(figures: BeatFigure[], useCarousel: boolean): ReactNode {
  if (useCarousel) {
    return <ScrollCarouselFigures slides={figures} />;
  }
  const skip = new Set<number>();
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < figures.length; i++) {
    if (skip.has(i)) continue;
    const fig = figures[i];
    const next = figures[i + 1];
    const caption = fig.clickRevealCaption?.trim();
    if (caption && next) {
      skip.add(i);
      skip.add(i + 1);
      blocks.push(
        <ClickRevealFigure
          key={`${fig.src}-reveal`}
          first={fig}
          second={next}
          caption={caption}
        />,
      );
    } else {
      blocks.push(<ScrollZoomFigure key={fig.src} src={fig.src} alt={fig.alt} />);
    }
  }
  return <>{blocks}</>;
}

function resolvePrototypeHref(beatHref?: string) {
  const fromContent = beatHref?.trim();
  if (fromContent) return fromContent;
  return process.env.NEXT_PUBLIC_CASE_STUDY_PROTOTYPE_URL?.trim() ?? "";
}

/** Set to true to show the Present control and fullscreen slideshow entry. */
const SHOW_PRESENT_BUTTON = false;

/* ─── Present button ─── */
function PresentButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] transition hover:bg-[var(--ink-soft)] active:scale-[0.97]"
    >
      <span aria-hidden>▶</span>
      Present
    </button>
  );
}

export function CaseStudySection({ caseStudy }: { caseStudy: ProfileContent["caseStudy"] }) {
  const [presenting, setPresenting] = useState(false);
  const highlights = caseStudy.leadHighlights ?? [];
  const img = caseStudy.leadImage;

  const presentationSections = [
    { id: "case-study-intro", label: caseStudy.chapterTitle },
    ...caseStudy.beats.map((beat, i) => ({
      id: `case-study-beat-${i}`,
      label: beat.kicker ? `${beat.kicker} · ${beat.title}` : beat.title,
    })),
  ];

  return (
    <>
      {presenting ? (
        <PresentationSlideshow
          beats={caseStudy.beats}
          chapterTitle={caseStudy.chapterTitle}
          lead={caseStudy.lead}
          leadHighlights={caseStudy.leadHighlights}
          onClose={() => setPresenting(false)}
        />
      ) : null}

      <PresentationSectionRail sections={presentationSections} />
      <ScrollZoomSection
        className="border-t border-[var(--rule)] py-10 md:py-14"
        innerClassName="mx-auto max-w-content px-5 md:px-8"
        disableScale
      >
        <div id="case-study-intro" className="scroll-mt-24 md:scroll-mt-28">
          <div
            className={
              SHOW_PRESENT_BUTTON
                ? "flex flex-wrap items-start justify-between gap-4 !mb-5 md:!mb-7"
                : "!mb-5 md:!mb-7"
            }
          >
            <SectionHeader
              className="!mb-0"
              partLabel={caseStudy.partLabel}
              title={caseStudy.chapterTitle}
            />
            {SHOW_PRESENT_BUTTON ? (
              <div className="pt-1">
                <PresentButton onClick={() => setPresenting(true)} />
              </div>
            ) : null}
          </div>
          <FadeIn>
            <div
              className={
                img
                  ? "mb-8 grid gap-6 lg:grid-cols-[1fr_minmax(240px,320px)] lg:items-start lg:gap-8"
                  : "mb-8"
              }
            >
          <div>
            <p className="max-w-prose text-lg leading-relaxed text-[var(--body)]">{caseStudy.lead}</p>
            {highlights.length > 0 ? (
              <ul className="mt-8 space-y-5 border-l-2 border-[var(--accent)] pl-5">
                {highlights.map((h) => (
                  <li key={h.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {h.label}
                    </p>
                    <p className="mt-1.5 max-w-prose leading-relaxed text-[var(--body)]">{h.text}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {img ? (
            <figure className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--wash)] shadow-[var(--shadow-soft)] lg:mx-0 lg:max-w-none lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-contain object-center p-3 sm:p-4 md:p-5"
                  sizes="(min-width: 1024px) 320px, 100vw"
                  unoptimized
                />
              </div>
            </figure>
          ) : null}
            </div>
          </FadeIn>
          {caseStudy.subtitle ? (
            <FadeIn>
              <p className="mb-8 text-sm font-medium tracking-widest text-[var(--muted)]">
                {caseStudy.subtitle}
              </p>
            </FadeIn>
          ) : null}
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
        {caseStudy.beats.map((beat, i) => {
          const isPlain = Boolean(beat.plain);
          const figures = beat.figures ?? [];
          const useCarousel = Boolean(beat.figuresCarousel && figures.length > 0);
          const prototypeHref = beat.prototypeCta
            ? resolvePrototypeHref(beat.prototypeCta.href)
            : "";
          const ctaOnTop = beat.prototypeCtaPlacement === "top";
          const hasLearningColumns = Boolean(beat.learningColumns?.length);
          const BeatIcon =
            beat.icon && !hasLearningColumns ? CASE_STUDY_ICONS[beat.icon] : null;
          const accent = kickerAccent(beat.kicker);

          const ctaInner = beat.prototypeCta ? (
            <>
              <p className="text-sm font-medium tracking-wide text-[var(--muted)]">
                {beat.prototypeCta.intro}
              </p>
              {prototypeHref ? (
                <a
                  href={prototypeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex max-w-full text-left text-balance rounded-full border border-[var(--ink)] bg-[var(--ink)] px-5 py-3 text-sm font-medium leading-snug text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
                >
                  {beat.prototypeCta.label}
                </a>
              ) : null}
            </>
          ) : null;

          const ctaAlignsWithIconTitle = Boolean(BeatIcon) && !ctaOnTop;

          const ctaBlock =
            beat.prototypeCta && ctaInner ? (
              ctaOnTop ? (
                <div className="mb-6 max-w-prose md:mb-8">{ctaInner}</div>
              ) : ctaAlignsWithIconTitle ? (
                <div className="mt-6 flex gap-4 md:mt-8">
                  <span className="mt-1 inline-flex h-10 w-10 shrink-0" aria-hidden />
                  <div className="min-w-0 flex-1 max-w-prose">{ctaInner}</div>
                </div>
              ) : (
                <div className="mt-6 max-w-prose md:mt-8">{ctaInner}</div>
              )
            ) : null;

          const textContent = (
            <>
              {beat.kicker ? (
                <p
                  className="mb-2 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase"
                  style={{ color: accent }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: accent }}
                    aria-hidden
                  />
                  {beat.kicker}
                </p>
              ) : null}
              {BeatIcon ? (
                <div className="flex gap-4">
                  <span
                    className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--wash)]"
                    style={{ color: accent }}
                    aria-hidden
                  >
                    <BeatIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={
                        hasLearningColumns
                          ? "font-display text-2xl font-medium leading-tight text-[var(--ink)] md:text-3xl"
                          : "font-display text-2xl font-medium text-[var(--ink)] md:text-[2rem]"
                      }
                    >
                      {beat.title}
                    </h3>
                    {beat.body.trim() ? (
                      <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed text-[var(--body)]">
                        {beat.body}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <>
                  <h3
                    className={
                      hasLearningColumns
                        ? "font-display text-2xl font-medium leading-tight text-[var(--ink)] md:text-3xl"
                        : "font-display text-2xl font-medium text-[var(--ink)] md:text-[2rem]"
                    }
                  >
                    {beat.title}
                  </h3>
                  {beat.body.trim() ? (
                    <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed text-[var(--body)]">
                      {beat.body}
                    </p>
                  ) : null}
                </>
              )}
            </>
          );

          const articleEl = (
            <article
              id={`case-study-beat-${i}`}
              className={`scroll-mt-24 md:scroll-mt-28 ${
                isPlain
                  ? "bg-transparent py-0"
                  : "rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-4 md:p-5"
              }`}
            >
              {useCarousel && figures.length > 0 ? (
                <>
                  {textContent}
                  <div className="mt-2 space-y-0 md:mt-3">{renderBeatFigures(figures, true)}</div>
                </>
              ) : (
                <>
              {ctaOnTop ? ctaBlock : null}
              {textContent}
              {beat.learningColumns && beat.learningColumns.length > 0 ? (
                <div className="mt-6 space-y-10 md:mt-8 md:space-y-12">
                  {beat.learningColumns.map((col, idx) => {
                    const Icon = col.icon ? CASE_STUDY_ICONS[col.icon] : null;
                    return (
                      <div key={`${col.title}-${idx}`} className="max-w-prose">
                        <div className="flex gap-4">
                          {Icon ? (
                            <span
                              className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--wash)] text-[var(--accent)]"
                              aria-hidden
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-display text-lg font-medium leading-snug text-[var(--ink)] md:text-xl">
                              {col.title}
                            </h4>
                            <p className="mt-3 text-base leading-relaxed text-[var(--body)] md:text-[17px] md:leading-relaxed">
                              {col.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {figures.length > 0 ? (
                <div className="mt-2 space-y-0 md:mt-3">{renderBeatFigures(figures, useCarousel)}</div>
              ) : null}
              {!ctaOnTop ? ctaBlock : null}
                </>
              )}
            </article>
          );

          const beatKey = `${beat.title}-${i}`;

          return <FadeIn key={beatKey}>{articleEl}</FadeIn>;
        })}
        </div>
      </ScrollZoomSection>
    </>
  );
}
