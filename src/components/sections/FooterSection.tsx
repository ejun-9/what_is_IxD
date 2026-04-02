import type { ProfileContent } from "@/content/profile";
import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { FadeIn } from "@/components/ui/FadeIn";

export function FooterSection({ contact }: { contact: ProfileContent["contact"] }) {
  return (
    <ScrollZoomSection
      className="border-t border-[var(--rule)] py-16 md:py-20"
      innerClassName="mx-auto max-w-content px-5 md:px-8"
      scaleRange={[0.98, 1, 1]}
    >
      <FadeIn>
        <h2 className="font-display text-3xl font-medium text-[var(--ink)] md:text-4xl">Say hello</h2>
        <ul className="mt-8 space-y-4 text-lg">
          <li>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="text-[var(--ink-soft)] underline decoration-[var(--rule-strong)] underline-offset-4 transition hover:text-[var(--ink)] hover:decoration-[var(--accent)]"
            >
              {contact.phone}
            </a>
          </li>
          <li>
            <a
              href={contact.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink-soft)] underline decoration-[var(--rule-strong)] underline-offset-4 transition hover:text-[var(--ink)] hover:decoration-[var(--accent)]"
            >
              {contact.portfolioLabel}
            </a>
          </li>
          <li>
            <a
              href={contact.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink-soft)] underline decoration-[var(--rule-strong)] underline-offset-4 transition hover:text-[var(--ink)] hover:decoration-[var(--accent)]"
            >
              {contact.linkedInLabel}
            </a>
          </li>
        </ul>
      </FadeIn>
    </ScrollZoomSection>
  );
}
