import Image from "next/image";
import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { FadeIn } from "@/components/ui/FadeIn";

export function HeroSection({ hero }: { hero: ProfileContent["hero"] }) {
  return (
    <ScrollZoomSection
      className="pt-12 pb-20 md:pt-20 md:pb-28"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      scaleRange={[0.9, 1, 0.98]}
    >
      <div
        className={
          hero.portraitSrc
            ? "grid gap-12 lg:grid-cols-[1fr_minmax(200px,280px)] lg:gap-16 lg:items-start"
            : ""
        }
      >
        <div>
          <FadeIn>
            <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.05] tracking-tight text-[var(--ink)]">
              {hero.name}
            </h1>
            <p className="mt-4 text-xl text-[var(--ink-soft)] md:text-2xl">{hero.role}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{hero.location}</p>
            <p className="mt-8 max-w-prose text-base leading-[1.75] text-[var(--body)]">{hero.intro}</p>
          </FadeIn>
        </div>
        {hero.portraitSrc ? (
          <aside className="lg:sticky lg:top-28">
            <FadeIn delay={0.1}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--wash-strong)] shadow-[var(--shadow-soft)]">
                <Image
                  src={hero.portraitSrc}
                  alt={hero.portraitAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 280px, 100vw"
                  priority
                />
              </div>
            </FadeIn>
          </aside>
        ) : null}
      </div>
    </ScrollZoomSection>
  );
}
