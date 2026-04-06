/** Shared with CaseStudyGate and cohort preview popover (sessionStorage). */
export const CASE_STUDY_UNLOCK_STORAGE_KEY = "case-study-unlocked-v1";

export function getExpectedCaseStudyPassword(): string {
  return process.env.NEXT_PUBLIC_CASE_STUDY_PASSWORD ?? "lucaiscute!!";
}

export function readCaseStudyUnlockedFromSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(CASE_STUDY_UNLOCK_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function persistCaseStudyUnlocked(): void {
  try {
    sessionStorage.setItem(CASE_STUDY_UNLOCK_STORAGE_KEY, "1");
  } catch {
    /* private mode */
  }
}
