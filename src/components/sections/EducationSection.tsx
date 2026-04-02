import Image from "next/image";
import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";

export function EducationSection({ education }: { education: ProfileContent["education"] }) {
  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-12 md:py-16"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      scaleRange={[0.96, 1, 0.98]}
    >
      <SectionHeader partLabel={education.partLabel} title={education.chapterTitle} />
      <FadeIn>
        <p className="mb-6 max-w-prose text-lg leading-relaxed text-[var(--body)]">{education.lead}</p>
      </FadeIn>
      <ul className="space-y-10 md:space-y-12">
        {education.entries.map((e) => (
          <FadeIn key={`${e.degree}-${e.school}`}>
            <li
              className={
                e.imageSrc
                  ? "grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] md:items-start md:gap-8"
                  : ""
              }
            >
              <div className="border-l-2 border-[var(--accent)] pl-6">
                <p className="font-display text-xl font-medium text-[var(--ink)]">{e.degree}</p>
                <p className="mt-1 text-[var(--ink-soft)]">{e.school}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {e.year} · {e.place}
                </p>
              </div>
              {e.imageSrc && e.imageAlt ? (
                <figure className="overflow-hidden rounded-xl bg-[var(--wash)] shadow-[var(--shadow-soft)]">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={e.imageSrc}
                      alt={e.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 320px, 100vw"
                      unoptimized
                    />
                  </div>
                </figure>
              ) : null}
            </li>
          </FadeIn>
        ))}
      </ul>
    </ScrollZoomSection>
  );
}
