import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { SiteNav } from "@/components/layout/SiteNav";
import { LuneDesignSystemContent } from "@/components/case-studies/LuneDesignSystemContent";
import { FooterSection } from "@/components/sections/FooterSection";
export const metadata: Metadata = {
  title: "From consensus to control · Lune · Eun Ji Jung",
  description:
    "How building a design system with AI changed what it means for a designer to own the full stack, from brand decision to shipped token.",
  openGraph: {
    title: "From consensus to control · Lune Design Foundation and System",
    description:
      "Design Systems · 2026. Komodo Fire vs. Lune: two power structures, one designer owning the stack with Claude, Figma MCP, Cursor, and Tailwind.",
    type: "article",
  },
};

export default function LuneDesignSystemPage() {
  return (
    <div className="min-h-full">
      <SiteNav />
      <main>
        <LuneDesignSystemContent />
      </main>
      <FooterSection contact={profile.contact} />
    </div>
  );
}
