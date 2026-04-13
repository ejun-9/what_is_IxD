type SectionHeaderProps = {
  partLabel?: string;
  title: string;
  className?: string;
  /** When set with `partLabel`, the eyebrow is a subtle control (e.g. start presentation). */
  onPartLabelClick?: () => void;
};

export function SectionHeader({
  partLabel,
  title,
  className = "",
  onPartLabelClick,
}: SectionHeaderProps) {
  const partLabelBase =
    "mb-2 text-xs font-medium tracking-[0.12em] text-[var(--muted)]";
  const partLabelStatic = `${partLabelBase} transition hover:text-[var(--body)]`;

  return (
    <header className={`mb-5 md:mb-7 ${className}`}>
      {partLabel && onPartLabelClick ? (
        <button
          type="button"
          onClick={onPartLabelClick}
          className={`${partLabelBase} block w-full max-w-prose cursor-default border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]`}
          aria-label={`Start presentation: ${partLabel}`}
        >
          {partLabel}
        </button>
      ) : partLabel ? (
        <p className={partLabelStatic}>{partLabel}</p>
      ) : null}
      <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-[var(--ink)]">
        {title}
      </h2>
    </header>
  );
}
