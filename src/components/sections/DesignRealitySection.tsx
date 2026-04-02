import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollCarouselPanels } from "@/components/ui/ScrollCarouselPanels";

export function DesignRealitySection({ data }: { data: ProfileContent["designReality"] }) {
  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-16 md:py-22"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      disableScale
    >
      <SectionHeader partLabel={data.partLabel} title={data.chapterTitle} />
      <ScrollCarouselPanels className="mt-2 md:mt-4">
        {data.items.map((row) => (
          <div
            key={row.myth}
            className="grid gap-4 rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-6 md:grid-cols-2 md:gap-8 md:p-8"
          >
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--muted)] sm:text-sm">
                Common take
              </p>
              <p className="mt-2.5 font-display text-xl italic leading-snug text-[var(--ink-soft)] md:text-[1.35rem] md:leading-snug">
                {row.myth}
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)] sm:text-sm">
                Closer to the work
              </p>
              <p className="mt-2.5 text-base leading-[1.7] text-[var(--body)] md:text-lg md:leading-relaxed">
                {row.reality}
              </p>
            </div>
          </div>
        ))}
      </ScrollCarouselPanels>
    </ScrollZoomSection>
  );
}
