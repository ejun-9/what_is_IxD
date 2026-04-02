"use client";

import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Bleed layout for explainer cards; no scroll-linked zoom. */
export function ScrollZoomCard({ children, className = "" }: Props) {
  return (
    <div
      className={`relative overflow-visible py-4 sm:py-6 md:min-h-[min(42vh,360px)] md:py-8 ${className}`}
    >
      <div className="-mx-3 sm:-mx-5 md:-mx-8 lg:-mx-10">
        <div className="p-[min(6%,1.75rem)]">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
