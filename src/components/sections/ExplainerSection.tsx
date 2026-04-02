import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { ScrollCarouselPanels } from "@/components/ui/ScrollCarouselPanels";

export function ExplainerSection({
  data,
}: {
  data: ProfileContent["interactionDesignExplainer"];
}) {
  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-16 md:py-22"
      innerClassName="mx-auto max-w-content overflow-visible px-5 md:px-8"
      disableScale
    >
      <SectionHeader partLabel={data.partLabel} title={data.chapterTitle} />
      <FadeIn>
        <p className="mb-8 max-w-prose text-lg leading-relaxed text-[var(--body)]">{data.intro}</p>
      </FadeIn>
      <ScrollCarouselPanels className="mt-2 md:mt-4">
        {data.points.map((p, i) => (
          <article
            key={p.title}
            className="rounded-xl bg-[var(--wash)] p-6 shadow-sm ring-1 ring-black/[0.04] md:p-8 md:pl-10"
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display text-xl font-medium text-[var(--ink)] md:text-2xl">{p.title}</h3>
            <p className="mt-3 max-w-prose text-base leading-relaxed text-[var(--body)] md:text-lg md:leading-relaxed">
              {p.body}
            </p>
          </article>
        ))}
      </ScrollCarouselPanels>
    </ScrollZoomSection>
  );
}
