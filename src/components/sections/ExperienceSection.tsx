import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { ExperienceScrollCarousel } from "@/components/sections/ExperienceScrollCarousel";

export function ExperienceSection({ experience }: { experience: ProfileContent["experience"] }) {
  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-12 md:py-16"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      scaleRange={[0.95, 1, 0.97]}
    >
      <SectionHeader partLabel={experience.partLabel} title={experience.chapterTitle} />
      <FadeIn>
        <p className="mb-6 max-w-prose text-lg leading-relaxed text-[var(--body)]">{experience.lead}</p>
      </FadeIn>
      <ol className="relative space-y-10 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-[var(--rule-strong)] md:before:left-[9px]">
        {experience.timeline.map((job, i) => {
          const hasCarousel = Boolean(job.carouselPanels?.length);
          return (
            <FadeIn key={`${job.organization}-${job.start}-${i}`}>
              <li className="relative pl-8 md:pl-10">
                <span
                  className="absolute left-0 top-2 size-4 rounded-full border-2 border-[var(--paper)] bg-[var(--accent)] md:top-2.5 md:size-[18px]"
                  aria-hidden
                />
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="font-display text-lg font-medium text-[var(--ink)] md:text-xl">{job.title}</h3>
                </div>
                <p className="mt-1 text-[var(--ink-soft)]">{job.organization}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {job.start} to {job.end}
                  {job.location ? ` · ${job.location}` : ""}
                </p>
                {hasCarousel ? (
                  <ExperienceScrollCarousel job={job} />
                ) : (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--body)] leading-relaxed">
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
              </li>
            </FadeIn>
          );
        })}
      </ol>
    </ScrollZoomSection>
  );
}
