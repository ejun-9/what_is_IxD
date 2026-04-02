import type { ProfileContent } from "@/content/profile";
import { FadeIn } from "@/components/ui/FadeIn";

export function CreditsSection({ credits }: { credits: ProfileContent["credits"] }) {
  return (
    <footer className="border-t border-[var(--rule)] bg-[var(--wash)] py-8">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <FadeIn>
          <p className="max-w-prose text-sm leading-relaxed text-[var(--muted)]">{credits.body}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Layout inspiration:{" "}
            <a
              href={credits.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--ink-soft)] underline underline-offset-2 hover:text-[var(--ink)]"
            >
              {credits.referenceLabel}
            </a>
          </p>
        </FadeIn>
      </div>
    </footer>
  );
}
