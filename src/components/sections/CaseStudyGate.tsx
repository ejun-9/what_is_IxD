"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ProfileContent } from "@/content/profile";
import {
  getExpectedCaseStudyPassword,
  persistCaseStudyUnlocked,
  readCaseStudyUnlockedFromSession,
} from "@/lib/case-study-unlock";

const CaseStudySection = dynamic(
  () => import("./CaseStudySection").then((m) => m.CaseStudySection),
  { ssr: false, loading: () => null },
);

type Props = {
  caseStudy: ProfileContent["caseStudy"];
  /** When true, locked state omits title/teaser (e.g. preview block above already showed them). */
  suppressLockedIntro?: boolean;
  /** When false with suppressLockedIntro, locked form is hidden until user requests it (e.g. preview “open” click). */
  revealForm?: boolean;
};

export function CaseStudyGate({ caseStudy, suppressLockedIntro = false, revealForm = true }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (readCaseStudyUnlockedFromSession()) setUnlocked(true);
    setSessionChecked(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.trim() === getExpectedCaseStudyPassword()) {
      persistCaseStudyUnlocked();
      setUnlocked(true);
      setError(false);
      setPassword("");
    } else {
      setError(true);
    }
  }

  if (unlocked) {
    return <CaseStudySection caseStudy={caseStudy} />;
  }

  if (!sessionChecked) {
    return null;
  }

  if (suppressLockedIntro && !revealForm) {
    return null;
  }

  return (
    <section
      id="cohort-case-study"
      className="border-t border-[var(--rule)] py-12 md:py-16"
      aria-labelledby={suppressLockedIntro ? "case-study-gate-form-title" : "case-study-gate-heading"}
    >
      <div className="mx-auto max-w-content px-5 md:px-8">
        {suppressLockedIntro ? null : (
          <header className="mb-5 md:mb-7">
            {caseStudy.partLabel ? (
              <p className="mb-3 text-xs font-medium tracking-[0.12em] text-[var(--muted)]">{caseStudy.partLabel}</p>
            ) : null}
            <h2
              id="case-study-gate-heading"
              className="font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-[var(--ink)]"
            >
              {caseStudy.chapterTitle}
            </h2>
            {caseStudy.gateTeaser ? (
              <p className="mt-4 max-w-prose text-base leading-relaxed text-[var(--body)]">
                {caseStudy.gateTeaser}
              </p>
            ) : null}
          </header>
        )}

        <div className="mx-auto max-w-md rounded-xl border border-[var(--rule)] bg-[var(--wash)] p-4 shadow-[var(--shadow-soft)] md:p-5">
          {suppressLockedIntro ? (
            <h2
              id="case-study-gate-form-title"
              className="font-display text-lg font-medium text-[var(--ink)] md:text-xl"
            >
              Unlock cohort case study
            </h2>
          ) : null}
          <p className={suppressLockedIntro ? "mt-2 text-sm leading-relaxed text-[var(--body)]" : "text-sm leading-relaxed text-[var(--body)]"}>
            This section is password-protected. Enter the password to continue reading the case study.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="case-study-password" className="sr-only">
                Password
              </label>
              <input
                id="case-study-password"
                name="case-study-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full rounded-lg border border-[var(--rule-strong)] bg-[var(--paper)] px-4 py-3 text-[var(--ink)] outline-none ring-0 transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                placeholder="Password"
              />
              {error ? (
                <p className="mt-2 text-sm text-red-700" role="alert">
                  That password didn’t match. Try again.
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full rounded-full border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 text-sm font-medium text-[var(--paper)] transition hover:bg-[var(--ink-soft)]"
            >
              Unlock case study
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
