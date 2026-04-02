type SectionHeaderProps = {
  partLabel?: string;
  title: string;
  className?: string;
};

export function SectionHeader({ partLabel, title, className = "" }: SectionHeaderProps) {
  return (
    <header className={`mb-5 md:mb-7 ${className}`}>
      {partLabel ? (
        <p className="mb-2 text-xs font-medium tracking-[0.12em] text-[var(--muted)]">
          {partLabel}
        </p>
      ) : null}
      <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-[var(--ink)]">
        {title}
      </h2>
    </header>
  );
}
