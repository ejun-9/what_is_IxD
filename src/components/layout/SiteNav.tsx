import Link from "next/link";

export function SiteNav() {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-[var(--rule)] bg-[var(--paper)]/95 backdrop-blur-sm"
      aria-label="Site"
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <Link
          href="/#case-studies"
          className="text-sm font-medium tracking-wide text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
          scroll
        >
          ← Back to case studies
        </Link>
      </div>
    </nav>
  );
}
