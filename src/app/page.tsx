import { profile } from "@/content/profile";
import { HeroSection } from "@/components/sections/HeroSection";
import { OnionPeelSection } from "@/components/sections/OnionPeelSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { StoryContinuation } from "@/components/sections/StoryContinuation";
import { FooterSection } from "@/components/sections/FooterSection";
import { CreditsSection } from "@/components/sections/CreditsSection";

export default function Home() {
  return (
    <div className="min-h-full">
      <main>
        <HeroSection hero={profile.hero} />
        <OnionPeelSection data={profile.onionPeel} />
        <EducationSection education={profile.education} />
        <ExperienceSection experience={profile.experience} />
        <StoryContinuation profile={profile} />
        <FooterSection contact={profile.contact} />
      </main>
      <CreditsSection credits={profile.credits} />
    </div>
  );
}
