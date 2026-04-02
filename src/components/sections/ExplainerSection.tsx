import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import { ScrollCarouselPanels } from "@/components/ui/ScrollCarouselPanels";

export function ExplainerSection({
  data,
  /** When nested under the IxD primer control, skip the top rule so it doesn’t stack under the button. */
  hideTopBorder = false,
}: {
  data: ProfileContent["interactionDesignExplainer"];
  hideTopBorder?: boolean;
}) {
  return (
    <ScrollZoomSection
      className={`py-12 md:py-16 ${hideTopBorder ? "" : "border-t border-[var(--rule)]"}`}
      innerClassName="mx-auto max-w-content overflow-visible px-5 md:px-8"
      disableScale
    >
      <SectionHeader partLabel={data.partLabel} title={data.chapterTitle} />
      <FadeIn>
        <p className="mb-6 max-w-prose text-lg leading-relaxed text-[var(--body)]">{data.intro}</p>
      </FadeIn>
      <ScrollCarouselPanels className="mt-0 md:mt-2">
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
