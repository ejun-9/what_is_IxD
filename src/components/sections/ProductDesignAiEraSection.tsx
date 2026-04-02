import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";

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
          <p>{data.lead}</p>
          {data.leadSecondary ? <p>{data.leadSecondary}</p> : null}
        </div>
      </FadeIn>
      <ul className="space-y-8 md:space-y-9">
        {data.points.map((p) => (
          <FadeIn key={p.title}>
            <li className="border-l-2 border-[var(--accent)] pl-6">
              <h3 className="font-display text-lg font-medium text-[var(--ink)] md:text-xl">{p.title}</h3>
              <p className="mt-2 max-w-prose leading-relaxed text-[var(--body)]">{p.body}</p>
            </li>
          </FadeIn>
        ))}
      </ul>
    </ScrollZoomSection>
  );
}
