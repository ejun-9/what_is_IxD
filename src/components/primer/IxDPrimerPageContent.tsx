import type { ProfileContent } from "@/content/profile";
import { ExplainerSection } from "@/components/sections/ExplainerSection";
import { DesignRealitySection } from "@/components/sections/DesignRealitySection";

/** Full interaction design explainer + myth/reality (standalone page). */
export function IxDPrimerPageContent({ profile }: { profile: ProfileContent }) {
  return (
    <>
      <ExplainerSection data={profile.interactionDesignExplainer} />
      <DesignRealitySection data={profile.designReality} />
    </>
  );
}
