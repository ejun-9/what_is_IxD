"use client";

import { useState } from "react";
import type { ProfileContent } from "@/content/profile";
import { ExplainerSection } from "@/components/sections/ExplainerSection";
import { DesignRealitySection } from "@/components/sections/DesignRealitySection";

type Props = {
  profile: ProfileContent;
};

/** Optional explainer + myth/reality block, toggled from a control under Education. */
export function IxDPrimerSection({ profile }: Props) {
  const [showIxD, setShowIxD] = useState(false);

  return (
    <>
      <section className="py-8 md:py-10" aria-label="More on interaction design">
        <div className="mx-auto max-w-content px-5 md:px-8">
          <button
            type="button"
            onClick={() => setShowIxD((v) => !v)}
            className="group flex w-full items-center justify-between gap-4 rounded-xl border border-[var(--rule)] bg-[var(--wash)] px-5 py-4 text-left shadow-[var(--shadow-soft)] transition hover:border-[var(--ink-soft)] md:px-6 md:py-5"
            aria-expanded={showIxD}
            aria-controls="ixd-primer"
          >
            <span className="font-display text-lg font-medium leading-snug text-[var(--ink)] md:text-xl">
              {showIxD ? "Nevermind I know this" : "Tell me more about interaction design"}
            </span>
            <span
              className="shrink-0 text-lg text-[var(--muted)] transition group-hover:text-[var(--ink)]"
              aria-hidden
            >
              {showIxD ? "↑" : "↓"}
            </span>
          </button>
        </div>
      </section>

      {showIxD ? (
        <div id="ixd-primer">
          <ExplainerSection data={profile.interactionDesignExplainer} hideTopBorder />
          <DesignRealitySection data={profile.designReality} />
        </div>
      ) : null}
    </>
  );
}
