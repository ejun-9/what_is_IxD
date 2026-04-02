type SectionHeaderProps = {
  partLabel?: string;
  title: string;
  className?: string;
};

export function SectionHeader({ partLabel, title, className = "" }: SectionHeaderProps) {
  return (
    <header className={`mb-7 md:mb-10 ${className}`}>
      {partLabel ? (
        <p className="mb-3 text-xs font-medium tracking-[0.12em] text-[var(--muted)]">
          {partLabel}
        </p>
      ) : null}
      <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-[var(--ink)]">
        {title}
      </h2>
    </header>
  );
}
