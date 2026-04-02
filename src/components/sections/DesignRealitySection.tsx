import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollCarouselPanels } from "@/components/ui/ScrollCarouselPanels";

export function DesignRealitySection({ data }: { data: ProfileContent["designReality"] }) {
  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-20 md:py-28"
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
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">Common take</p>
              <p className="mt-2 font-display text-lg italic text-[var(--ink-soft)]">{row.myth}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">Closer to the work</p>
              <p className="mt-2 leading-relaxed text-[var(--body)]">{row.reality}</p>
            </div>
          </div>
        ))}
      </ScrollCarouselPanels>
    </ScrollZoomSection>
  );
}
