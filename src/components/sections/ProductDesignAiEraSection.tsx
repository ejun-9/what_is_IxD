import type { ProfileContent, TextSegment } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { CASE_STUDY_ICONS } from "@/components/icons/CaseStudyLearningIcons";

const introMarkClass =
  "rounded-sm bg-[var(--accent)]/14 px-1.5 py-0.5 text-[var(--ink)] [box-decoration-break:clone]";
const introStrongClass = "font-semibold text-[var(--ink)]";

function IntroSegments({ segments }: { segments: TextSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.highlight === "mark") {
          return (
            <mark key={i} className={`${introMarkClass} font-normal`}>
              {seg.text}
            </mark>
          );
        }
        if (seg.highlight === "strong") {
          return (
            <strong key={i} className={introStrongClass}>
              {seg.text}
            </strong>
          );
        }
        return <span key={i}>{seg.text}</span>;
      })}
    </>
  );
}

export function ProductDesignAiEraSection({
  data,
}: {
  data: ProfileContent["productDesignAiEra"];
}) {
  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-12 md:py-16"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      disableScale
    >
      <SectionHeader partLabel={data.partLabel} title={data.chapterTitle} />
      <FadeIn>
        <div className="mb-10 max-w-prose space-y-6 text-lg leading-relaxed text-[var(--body)]">
          <p>
            <IntroSegments segments={data.lead} />
          </p>
          {data.leadSecondary ? (
            <p>
              <IntroSegments segments={data.leadSecondary} />
            </p>
          ) : null}
        </div>
      </FadeIn>
      <ul className="space-y-8 md:space-y-9">
        {data.points.map((p) => {
          const Icon = p.icon ? CASE_STUDY_ICONS[p.icon] : null;
          return (
            <FadeIn key={p.title}>
              <li className="border-l-2 border-[var(--accent)] pl-5 md:pl-6">
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
                    <h3 className="font-display text-lg font-medium text-[var(--ink)] md:text-xl">{p.title}</h3>
                    <p className="mt-2 max-w-prose leading-relaxed text-[var(--body)]">{p.body}</p>
                  </div>
                </div>
              </li>
            </FadeIn>
          );
        })}
      </ul>
    </ScrollZoomSection>
  );
}
