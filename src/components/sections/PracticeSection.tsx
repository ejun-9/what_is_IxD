import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";

export function PracticeSection({ practice }: { practice: ProfileContent["practice"] }) {
  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-16 md:py-22"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      scaleRange={[0.96, 1, 0.97]}
    >
      <SectionHeader partLabel={practice.partLabel} title={practice.chapterTitle} />
      <FadeIn>
        <p className="mb-8 max-w-prose text-lg leading-relaxed text-[var(--body)]">{practice.lead}</p>
      </FadeIn>
      <div className="space-y-7">
        {practice.skillGroups.map((g) => (
          <FadeIn key={g.label}>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">
                {g.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[var(--rule)] bg-[var(--wash)] px-3 py-1.5 text-sm text-[var(--ink-soft)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn>
        <p className="mt-12 text-sm text-[var(--muted)]">{practice.languages}</p>
      </FadeIn>
    </ScrollZoomSection>
  );
}
