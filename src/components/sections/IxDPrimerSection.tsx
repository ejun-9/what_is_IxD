import Link from "next/link";
import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";

/** Matches case study preview blocks; full explainer lives on `/interaction-design-primer`. */
const openLinkClassName =
  "text-sm font-medium text-[var(--accent)] underline decoration-[var(--rule-strong)] underline-offset-4 transition hover:text-[var(--ink)] hover:decoration-[var(--accent)]";

export function IxDPrimerSection({ profile }: { profile: ProfileContent }) {
  const data = profile.interactionDesignExplainer;

  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-8 md:py-10"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      disableScale
    >
      <SectionHeader partLabel={data.partLabel} title={data.chapterTitle} />
      <FadeIn>
        <p className="max-w-prose text-lg leading-relaxed text-[var(--body)]">{data.intro}</p>
        <p className="mt-6 md:mt-8">
          <Link href="/interaction-design-primer" className={openLinkClassName}>
            Read more about it
          </Link>
        </p>
      </FadeIn>
    </ScrollZoomSection>
  );
}
