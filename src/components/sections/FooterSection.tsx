import type { ProfileContent } from "@/content/profile";
import { FadeIn } from "@/components/ui/FadeIn";

/** Site footer; contact links only (no scroll-scale; uses a semantic footer element). */
export function FooterSection({ contact }: { contact: ProfileContent["contact"] }) {
  return (
    <footer className="relative border-t border-[var(--rule)] bg-[var(--wash)] py-7 md:py-9">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <FadeIn>
          <h2 className="font-display text-xl font-medium tracking-tight text-[var(--ink)] md:text-2xl">
            Say hello
          </h2>
          <ul className="mt-4 space-y-2 text-sm md:text-base">
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
      </div>
    </footer>
  );
}
