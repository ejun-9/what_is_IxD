import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Vertical stack of panel children (no scroll-linked animation). */
export function ScrollCarouselPanels({ children, className = "" }: Props) {
  return <div className={`space-y-5 ${className}`}>{children}</div>;
}
