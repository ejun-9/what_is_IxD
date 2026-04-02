import Image from "next/image";
import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { ScrollZoomFigure } from "@/components/ui/ScrollZoomFigure";
import { ScrollCarouselFigures } from "@/components/ui/ScrollCarouselFigures";

function resolvePrototypeHref(beatHref?: string) {
  const fromContent = beatHref?.trim();
  if (fromContent) return fromContent;
  return process.env.NEXT_PUBLIC_CASE_STUDY_PROTOTYPE_URL?.trim() ?? "";
}

export function CaseStudySection({ caseStudy }: { caseStudy: ProfileContent["caseStudy"] }) {
  const highlights = caseStudy.leadHighlights ?? [];
  const img = caseStudy.leadImage;

  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-10 md:py-14"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      disableScale
    >
      <SectionHeader
        className="!mb-5 md:!mb-7"
        partLabel={caseStudy.partLabel}
        title={caseStudy.chapterTitle}
      />
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
                  className="object-contain object-center p-6"
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

      <div className="space-y-12 md:space-y-20">
        {caseStudy.beats.map((beat, i) => {
          const isPlain = Boolean(beat.plain);
          const figures = beat.figures ?? [];
          const useCarousel = Boolean(beat.figuresCarousel && figures.length > 0);
          const prototypeHref = beat.prototypeCta
            ? resolvePrototypeHref(beat.prototypeCta.href)
            : "";
          const ctaOnTop = beat.prototypeCtaPlacement === "top";
          const ctaBlock =
            beat.prototypeCta ? (
              <div
                className={
                  ctaOnTop ? "mb-6 max-w-prose md:mb-8" : "mt-6 max-w-prose md:mt-8"
                }
              >
                <p className="text-sm font-medium tracking-wide text-[var(--muted)]">
                  {beat.prototypeCta.intro}
                </p>
                {prototypeHref ? (
                  <a
                    href={prototypeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex max-w-full text-center text-balance rounded-full border border-[var(--ink)] bg-[var(--ink)] px-5 py-3 text-sm font-medium leading-snug text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
                  >
                    {beat.prototypeCta.label}
                  </a>
                ) : null}
              </div>
            ) : null;

          const articleEl = (
            <article
              className={
                isPlain
                  ? "bg-transparent py-0"
                  : "rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-6 md:p-8"
              }
            >
              {ctaOnTop ? ctaBlock : null}
              {beat.kicker ? (
                <p className="mb-2 text-xs font-medium tracking-widest text-[var(--muted)]">
                  {beat.kicker}
                </p>
              ) : null}
              <h3
                className={
                  beat.learningColumns?.length
                    ? "font-display text-2xl font-medium leading-tight text-[var(--ink)] md:text-3xl"
                    : "font-display text-xl font-medium text-[var(--ink)] md:text-2xl"
                }
              >
                {beat.title}
              </h3>
              {beat.body.trim() ? (
                <p
                  className={
                    beat.learningColumns?.length
                      ? "mt-4 max-w-prose whitespace-pre-line leading-relaxed text-[var(--body)]"
                      : "mt-3 max-w-prose whitespace-pre-line leading-relaxed text-[var(--body)]"
                  }
                >
                  {beat.body}
                </p>
              ) : null}
              {beat.learningColumns && beat.learningColumns.length > 0 ? (
                <div className="mt-6 space-y-10 md:mt-8 md:space-y-12">
                  {beat.learningColumns.map((col, idx) => (
                    <div key={`${col.title}-${idx}`} className="max-w-prose">
                      <h4 className="font-display text-lg font-medium leading-snug text-[var(--ink)] md:text-xl">
                        {col.title}
                      </h4>
                      <p className="mt-3 text-base leading-relaxed text-[var(--body)] md:text-[17px] md:leading-relaxed">
                        {col.body}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {figures.length > 0 ? (
                <div className="mt-4 space-y-0 md:mt-5">
                  {useCarousel ? (
                    <ScrollCarouselFigures slides={figures} />
                  ) : (
                    figures.map((fig) => (
                      <ScrollZoomFigure key={fig.src} src={fig.src} alt={fig.alt} />
                    ))
                  )}
                </div>
              ) : null}
              {!ctaOnTop ? ctaBlock : null}
            </article>
          );

          const beatKey = `${beat.title}-${i}`;

          return useCarousel ? (
            <div key={beatKey}>{articleEl}</div>
          ) : (
            <FadeIn key={beatKey}>{articleEl}</FadeIn>
          );
        })}
      </div>
    </ScrollZoomSection>
  );
}
