import Link from "next/link";
import type { LuneCaseStudy } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";

export function LuneCaseStudySection({ data }: { data: LuneCaseStudy }) {
  return (
    <ScrollZoomSection
      id="case-studies"
      className="border-t border-[var(--rule)] scroll-mt-20 py-12 md:py-16 md:scroll-mt-24"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      disableScale
    >
      <SectionHeader partLabel={data.eyebrow} title={data.chapterTitle} />

      <FadeIn>
        <p className="max-w-prose text-lg leading-relaxed text-[var(--body)]">{data.teaser}</p>
        <p className="mt-6 md:mt-8">
          <Link
            href="/lune-design-system"
            className="text-sm font-medium text-[var(--accent)] underline decoration-[var(--rule-strong)] underline-offset-4 transition hover:text-[var(--ink)] hover:decoration-[var(--accent)]"
          >
            Read more about it
          </Link>
        </p>
      </FadeIn>
    </ScrollZoomSection>
  );
}
