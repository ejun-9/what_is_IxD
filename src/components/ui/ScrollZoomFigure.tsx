type Props = {
  src: string;
  alt: string;
  className?: string;
};

/** Case study figure: static image, same layout shell as before (no scroll-linked zoom). */
export function ScrollZoomFigure({ src, alt, className = "" }: Props) {
  return (
    <div
      className={`relative pt-1.5 pb-0 sm:pt-2 md:pt-2 ${className}`}
    >
      <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 xl:-mx-16">
        <div className="rounded-xl p-3 sm:p-4 md:mx-auto md:max-w-5xl md:p-5">
          <img
            src={src}
            alt={alt}
            className="block h-auto w-full rounded-lg"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}
