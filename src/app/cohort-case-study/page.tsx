import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { SiteNav } from "@/components/layout/SiteNav";
import { CaseStudyGate } from "@/components/sections/CaseStudyGate";
import { FooterSection } from "@/components/sections/FooterSection";

const cs = profile.caseStudy;
const description = cs.gateTeaser?.trim() || cs.lead;

export const metadata: Metadata = {
  title: `${cs.chapterTitle} · Eun Ji Jung`,
  description,
  openGraph: {
    title: `${cs.chapterTitle} · Case study`,
    description,
    type: "article",
  },
};

export default function CohortCaseStudyPage() {
  return (
    <div className="min-h-full">
      <SiteNav />
      <main>
        <CaseStudyGate caseStudy={profile.caseStudy} />
      </main>
      <FooterSection contact={profile.contact} />
    </div>
  );
}
