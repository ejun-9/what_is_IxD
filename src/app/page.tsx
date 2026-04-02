import { profile } from "@/content/profile";
import { HeroSection } from "@/components/sections/HeroSection";
import { OnionPeelSection } from "@/components/sections/OnionPeelSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { IxDPrimerSection } from "@/components/sections/IxDPrimerSection";
import { ProductDesignAiEraSection } from "@/components/sections/ProductDesignAiEraSection";
import { PracticeSection } from "@/components/sections/PracticeSection";
import { CaseStudyGate } from "@/components/sections/CaseStudyGate";
import { FooterSection } from "@/components/sections/FooterSection";
import { CreditsSection } from "@/components/sections/CreditsSection";

export default function Home() {
  return (
    <div className="min-h-full">
      <main>
        <HeroSection hero={profile.hero} />
        <OnionPeelSection data={profile.onionPeel} />
        <EducationSection education={profile.education} />
        <IxDPrimerSection profile={profile} />
        <ExperienceSection experience={profile.experience} />
        <ProductDesignAiEraSection data={profile.productDesignAiEra} />
        <PracticeSection practice={profile.practice} />
        <CaseStudyGate caseStudy={profile.caseStudy} />
        <FooterSection contact={profile.contact} />
      </main>
      <CreditsSection credits={profile.credits} />
    </div>
  );
}
