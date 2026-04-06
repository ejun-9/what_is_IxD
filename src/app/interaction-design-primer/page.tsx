import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { SiteNav } from "@/components/layout/SiteNav";
import { IxDPrimerPageContent } from "@/components/primer/IxDPrimerPageContent";
import { FooterSection } from "@/components/sections/FooterSection";

const intro = profile.interactionDesignExplainer.intro;

export const metadata: Metadata = {
  title: `${profile.interactionDesignExplainer.chapterTitle} · Eun Ji Jung`,
  description: intro.length > 160 ? `${intro.slice(0, 157)}…` : intro,
  openGraph: {
    title: `${profile.interactionDesignExplainer.chapterTitle} · Interaction design`,
    description: intro.length > 160 ? `${intro.slice(0, 157)}…` : intro,
    type: "article",
  },
};

export default function InteractionDesignPrimerPage() {
  return (
    <div className="min-h-full">
      <SiteNav />
      <main>
        <IxDPrimerPageContent profile={profile} />
      </main>
      <FooterSection contact={profile.contact} />
    </div>
  );
}
