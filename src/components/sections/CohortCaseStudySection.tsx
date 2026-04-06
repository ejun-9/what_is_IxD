import Link from "next/link";
import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";

/** Matches {@link LuneCaseStudySection}; full case study and password gate live on `/cohort-case-study`. */
const openLinkClassName =
  "text-sm font-medium text-[var(--accent)] underline decoration-[var(--rule-strong)] underline-offset-4 transition hover:text-[var(--ink)] hover:decoration-[var(--accent)]";

export function CohortCaseStudySection({ caseStudy }: { caseStudy: ProfileContent["caseStudy"] }) {
  const teaser = caseStudy.gateTeaser?.trim() || caseStudy.lead;

  return (
    <ScrollZoomSection
      id="cohort-case-study"
      className="scroll-mt-20 border-t border-[var(--rule)] py-12 md:py-16 md:scroll-mt-24"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      disableScale
    >
      <SectionHeader
        partLabel={caseStudy.partLabel ?? "Case study presentation"}
        title={caseStudy.chapterTitle}
      />

      <FadeIn>
        <p className="max-w-prose text-lg leading-relaxed text-[var(--body)]">{teaser}</p>
        <p className="mt-6 md:mt-8">
          <Link href="/cohort-case-study" className={openLinkClassName}>
            Open cohort case study (password protected) →
          </Link>
        </p>
      </FadeIn>
    </ScrollZoomSection>
  );
}
