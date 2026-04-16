import caseStudyData from "./case-study.json";
import cohortDetailsPresentationBeats from "./cohort-details-presentation.json";
import luneCaseStudyData from "./lune-case-study.json";

export type CarouselPanel = {
  title: string;
  focusLabel?: string;
  highlights: string[];
};

export type TimelineEntry = {
  title: string;
  organization: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  /** Use when this role is a single job with multiple lenses (e.g. AI vs platform). */
  carouselPanels?: CarouselPanel[];
  highlights: string[];
};

export type EducationEntry = {
  degree: string;
  school: string;
  year: string;
  place: string;
  /** Optional photo under `public/` (e.g. `/images/education/...`). */
  imageSrc?: string;
  imageAlt?: string;
};

export type MythReality = { myth: string; reality: string };
export type SkillGroup = { label: string; items: string[] };

export type CaseStudyPrototypeCta = {
  /** Line above the button, e.g. “View clickable prototype:” */
  intro: string;
  label: string;
  /** Figma / web prototype URL; falls back to NEXT_PUBLIC_CASE_STUDY_PROTOTYPE_URL. */
  href?: string;
};

export type CaseStudyIconKey =
  | "assumptions"
  | "documentation"
  | "confidence"
  | "insight"
  | "partnership"
  | "activation"
  | "workflow"
  | "sparkles";

export type ExplainerPoint = { title: string; body: string; icon?: CaseStudyIconKey };

/** Intro copy with optional per-span emphasis (see ProductDesignAiEraSection). */
export type TextSegment = { text: string; highlight?: "mark" | "strong" };

export type CaseStudyLearningColumn = {
  title: string;
  body: string;
  /** Decorative icon beside the learning title (Learnings section). */
  icon?: CaseStudyIconKey;
};

/** One card in a merged multi-beat grid (presentation). */
export type CaseStudyInsightCard = {
  kicker?: string;
  title: string;
  body: string;
  icon?: CaseStudyIconKey;
  prototypeCta?: CaseStudyPrototypeCta;
};

export type CaseStudyBeat = {
  kicker?: string;
  title: string;
  body: string;
  /** Decorative icon beside the beat title (omit when using learning columns). */
  icon?: CaseStudyIconKey;
  /** Three-up takeaways (e.g. Learnings). When set, render a column grid below the title. */
  learningColumns?: CaseStudyLearningColumn[];
  /** Multiple narrative cards on one slide (e.g. merged beats). Checked before `figures`. */
  insightCardGrid?: CaseStudyInsightCard[];
  /** Single insight card below the body on figure slides (same visual as `insightCardGrid` cards). */
  figureSlideInsightCard?: CaseStudyInsightCard;
  /** Text-only slide: no right image panel (presentation). */
  presentationTextOnly?: boolean;
  /** No card border; use for hero-style problem slides. */
  plain?: boolean;
  /** SVG paths under public/ with scroll-zoom. */
  figures?: {
    src: string;
    alt: string;
    /** Paired with the next figure: click first image to slide in the next + this caption. */
    clickRevealCaption?: string;
  }[];
  /** When true, `figures` use a horizontal scroll carousel (slide + zoom) instead of per-image zoom. */
  figuresCarousel?: boolean;
  /** Optional right-panel images for text-only slides (e.g. two-up visual comparison). */
  textSlideFigures?: {
    src: string;
    alt: string;
  }[];
  /** When true with `textSlideFigures`, render visuals full-width across the slide. */
  textSlideFullWidth?: boolean;
  /** Figure slide: oversized right-panel image that may extend past the default frame. */
  figureSlideLargeFigure?: boolean;
  prototypeCta?: CaseStudyPrototypeCta;
  /** Where the prototype CTA sits relative to the beat text and figures. Default `bottom`. */
  prototypeCtaPlacement?: "top" | "bottom";
};

export type CaseStudyLeadHighlight = {
  label: string;
  text: string;
};

export type CaseStudyLeadImage = {
  src: string;
  alt: string;
};

/** Public narrative: learnings only (e.g. Lune), not a full branding case study. */
export type LuneCaseStudyLearning = { title: string; body: string };

export type LuneCaseStudy = {
  chapterTitle: string;
  eyebrow?: string;
  /** Short preview only; full narrative is behind the expand control. */
  teaser: string;
  lead: string;
  scopeNote?: string;
  framing: { title: string; body: string };
  comparison: {
    aiColumnTitle: string;
    aiBody: string;
    traditionalColumnTitle: string;
    traditionalBody: string;
  };
  learnings: LuneCaseStudyLearning[];
};

export type ProfileContent = {
  hero: {
    name: string;
    role: string;
    location: string;
    intro: string;
    portraitSrc: string | null;
    portraitAlt: string;
  };
  /** Draggable image playground directly under the hero (“peel the onion”). */
  onionPeel: {
    partLabel?: string;
    title: string;
    lead: string;
    hint: string;
    images: { src: string; alt: string; caption?: string; /** Cutout PNG + sticker styling */ sticker?: boolean }[];
  };
  education: {
    /** Optional kicker above the chapter title. */
    partLabel?: string;
    chapterTitle: string;
    lead: string;
    entries: EducationEntry[];
  };
  experience: {
    partLabel?: string;
    chapterTitle: string;
    lead: string;
    timeline: TimelineEntry[];
  };
  interactionDesignExplainer: {
    partLabel?: string;
    chapterTitle: string;
    intro: string;
    points: ExplainerPoint[];
  };
  designReality: {
    partLabel?: string;
    chapterTitle: string;
    items: MythReality[];
  };
  /** Product design craft when AI is in the product, not model training, but experience and judgment. */
  productDesignAiEra: {
    partLabel?: string;
    chapterTitle: string;
    lead: TextSegment[];
    /** Optional second intro block (e.g. future-shaping, ethics of defaults). */
    leadSecondary?: TextSegment[];
    points: ExplainerPoint[];
  };
  practice: {
    partLabel?: string;
    chapterTitle: string;
    lead: string;
    skillGroups: SkillGroup[];
    languages: string;
  };
  caseStudy: {
    partLabel?: string;
    chapterTitle: string;
    /** Shown only on the password gate; omitted after unlock (not part of the case study body). */
    gateTeaser?: string;
    subtitle?: string;
    lead: string;
    leadHighlights?: CaseStudyLeadHighlight[];
    leadImage?: CaseStudyLeadImage | null;
    beats: CaseStudyBeat[];
    /**
     * Fixed-length presentation deck (e.g. interview walkthrough). Same slide styling as scroll beats;
     * opens from “Presentation mode” on the case study page. Omit intro slide; length is explicit.
     */
    detailsPresentationBeats?: CaseStudyBeat[];
  };
  /** Second case study: public, learnings-focused (no password). */
  luneCaseStudy: LuneCaseStudy;
  contact: {
    phone: string;
    portfolioUrl: string;
    portfolioLabel: string;
    linkedInUrl: string;
    linkedInLabel: string;
  };
  credits: {
    body: string;
    referenceUrl: string;
    referenceLabel: string;
  };
};

export const profile: ProfileContent = {
  hero: {
    name: "Eun Ji Jung",
    role: "Senior Product Designer",
    location: "Fullerton, CA",
    intro:
      "I’m a product designer focused on how people understand complex software: data-heavy tools, multi-step workflows, and AI products. My job isn’t the model; it’s the experience around it, where transparency, progressive disclosure, and trust patterns matter as much as the interface. This page is a short scroll through who I am, what interaction design means, and what that looks like in practice.",
    portraitSrc: null,
    portraitAlt: "Portrait of Eun Ji Jung",
  },
  onionPeel: {
    partLabel: "But first let’s make a collage… because why not?",
    title: "Get to know me",
    lead:
      "These are images of things that I have baked, crochet, or my dog being a fashion icon. Drag any photo and move it around, and let’s make a collage together (cause I like making collages too haha).",
    hint: "Click and drag inside the frame to arrange your collage.",
    images: [
      {
        src: "/images/onion-peel/luca-hoodie-full.jpg",
        alt: "Luca the dog lying on a bed wearing a peach, purple, and light blue hoodie",
        caption: "Luca",
        sticker: false,
      },
      {
        src: "/images/onion-peel/luca-crochet-full.jpg",
        alt: "Luca wearing a yellow crochet hat and a tan crochet cowl",
        caption: "Crochet + Luca",
        sticker: false,
      },
      {
        src: "/images/onion-peel/crochet-hat-full.jpg",
        alt: "Top view of a yellow crochet sun hat on Luca’s head",
        caption: "Crochet",
        sticker: false,
      },
      {
        src: "/images/onion-peel/collage-0695.svg",
        alt: "Collage illustration",
        sticker: true,
      },
      {
        src: "/images/onion-peel/collage-1118.svg",
        alt: "Collage illustration",
        sticker: true,
      },
      {
        src: "/images/onion-peel/collage-1119.svg",
        alt: "Collage illustration",
        sticker: true,
      },
      {
        src: "/images/onion-peel/collage-1195.svg",
        alt: "Collage illustration",
        sticker: true,
      },
      {
        src: "/images/onion-peel/collage-1351.svg",
        alt: "Collage illustration",
        sticker: true,
      },
      {
        src: "/images/onion-peel/collage-1408.svg",
        alt: "Collage illustration",
        sticker: true,
      },
      {
        src: "/images/onion-peel/collage-image-118.svg",
        alt: "Collage illustration",
        sticker: true,
      },
      {
        src: "/images/onion-peel/collage-1191.svg",
        alt: "Collage illustration",
        sticker: true,
      },
      {
        src: "/images/onion-peel/collage-3207.svg",
        alt: "Collage illustration",
        sticker: true,
      },
    ],
  },
  education: {
    chapterTitle: "How I got here",
    lead: "Industrial things first, then digital behavior and systems, two degrees that map how I think about products end to end.",
    entries: [
      {
        degree: "MDes, Interaction Design",
        school: "California College of the Arts",
        year: "2021",
        place: "San Francisco, CA",
        imageSrc: "/images/education/cca-mdes.png",
        imageAlt: "CCA cohort in front of the California College of the Arts building",
      },
      {
        degree: "BFA, Industrial Design",
        school: "University of Illinois at Urbana-Champaign",
        year: "2018",
        place: "Champaign, IL",
        imageSrc: "/images/education/uiuc-bfa.png",
        imageAlt: "Graduation day on the University of Illinois campus",
      },
    ],
  },
  experience: {
    chapterTitle: "Where I’ve worked",
    lead: "A path from physical healthcare hardware to platform tools and AI-first workflows, always with research, systems, and cross-functional partners in the loop.",
    timeline: [
      {
        title: "Product Designer III",
        organization: "Komodo Health",
        location: "San Francisco, CA (remote)",
        start: "Jan 2022",
        end: "Present",
        current: true,
        highlights: [],
        carouselPanels: [
          {
            focusLabel: "AI products",
            title: "Product Designer III, AI Products",
            highlights: [
              "Led design for the AI-First Cohort Builder (natural language), cutting new-user activation from months to about a minute for key flows.",
              "Designed for mixed expertise: transparency, progressive disclosure, and graceful failure when AI-generated logic needs human judgment.",
              "Ran a “Search to AI Strategy” research thread that helped pivot the org toward AI-first workflows.",
              "Partnered with engineering and data science on how the AI layer abstracts complex data models for all users.",
            ],
          },
          {
            focusLabel: "Platform & data tools",
            title: "Product Designer III, Platform & Data Tools",
            highlights: [
              "Owned end-to-end design for MapLab Cohort Builder (700+ active users), a strategic re-architecture, not just a reskin.",
              "Turned cohort definitions into reusable platform assets to unlock downstream analytics.",
              "Shipped aggregate previews, reusable codesets, and a Figma component library for consistent patterns across the suite.",
              "Research and usability with healthcare analysts; workshops and design critiques with partners.",
            ],
          },
        ],
      },
      {
        title: "Design Consultant, PRIDENet",
        organization: "CCA Social Lab",
        location: "San Francisco, CA",
        start: "May 2021",
        end: "Aug 2021",
        highlights: [
          "Stakeholder workshops aligning goals with community needs for a research-sharing portal.",
          "Shipped a portal to share findings and engage the LGBTQ+ community around health equity.",
          "Participatory design so the product reflected lived experience, not only institutional needs.",
        ],
      },
      {
        title: "Design Consultant",
        organization: "The San Francisco School, CCA Social Lab",
        location: "San Francisco, CA",
        start: "Jan 2021",
        end: "May 2021",
        highlights: [
          "Mapped the summer camp registration journey end to end; interviews with parents and administrators.",
          "Redesigned enrollment to reduce complexity for first-time families across a multi-step flow.",
        ],
      },
      {
        title: "Design Intern",
        organization: "Digital Design NYC",
        location: "New York, NY",
        start: "Mar 2021",
        end: "Apr 2021",
        highlights: [
          "Improved accessibility and flows on e-commerce and B2B surfaces.",
          "Heuristic evaluations and interaction recommendations grounded in UX best practices.",
        ],
      },
      {
        title: "Industrial Designer",
        organization: "Vitrix Health",
        location: "Chicago, IL",
        start: "Dec 2018",
        end: "Aug 2019",
        highlights: [
          "End-to-end design of a cervical cancer screening device, from research and prototyping through 3D modeling, CMF, and manufacturing coordination.",
          "Synthesized clinical insights from field testing into ergonomic and workflow requirements.",
          "Project-managed across engineering and manufacturing under real constraints.",
        ],
      },
    ],
  },
  interactionDesignExplainer: {
    chapterTitle: "What interaction design is",
    intro:
      "Interaction design (IxD) is the craft of how people and systems meet: what happens when someone taps, types, waits, or gets stuck, and how we make that understandable, fair, and resilient. It’s not the same as “only visuals”; it’s the behavior layer that sits between strategy and engineering.",
    points: [
      {
        title: "Clarity under complexity",
        body: "Behind most products the stack is messy, and with AI in the loop, even more so. IxD is how we sequence information, set expectations, and expose the right detail at the right moment, so experts aren’t overwhelmed and newcomers aren’t lost.",
      },
      {
        title: "Flows, not just screens",
        body: "A product is a path over time: onboarding, recovery from errors, handoffs between tools. Interaction designers map those paths, prototype them, and test whether they hold up for real work.",
      },
      {
        title: "Trust and transparency",
        body: "When software infers, recommends, or automates, people need to see what happened, what they can change, and what comes next. That’s interaction and content design working together: patterns like progressive disclosure and graceful failure are part of the job.",
      },
      {
        title: "Systems and reuse",
        body: "Design systems aren’t decoration kits. They encode how decisions get made once so teams don’t reinvent patterns, freeing energy for harder product problems.",
      },
    ],
  },
  designReality: {
    chapterTitle: "What designers actually do",
    items: [
      {
        myth: "“Design is making it pretty.”",
        reality:
          "A huge slice of the job is problem framing, tradeoffs, and alignment: turning ambiguity into something buildable, then iterating with research and engineering.",
      },
      {
        myth: "“UX is wireframes.”",
        reality:
          "Wireframes are one output. The work includes research synthesis, journey mapping, prototyping, usability, and crit, often owning the story of why a direction is right.",
      },
      {
        myth: "“The designer hands off to dev and walks away.”",
        reality:
          "The best outcomes come from tight loops with engineering and partners in research and data, especially when the product is AI- or data-heavy, where the experience has to line up with how the system actually behaves.",
      },
    ],
  },
  productDesignAiEra: {
    chapterTitle: "Product design in the age of AI",
    lead: [
      { text: "AI in the product changes the shape of the work: it adds " },
      {
        text: "inference, confidence, and failure modes that aren’t visible in a static mock",
        highlight: "mark",
      },
      { text: ". Being a product designer today still means owning " },
      { text: "clarity, flow, and trust", highlight: "strong" },
      {
        text: "; it also means partnering with engineers and data folks so what we ship matches ",
      },
      { text: "how the system actually behaves", highlight: "mark" },
      { text: ", not only how we wish it behaved." },
    ],
    leadSecondary: [
      { text: "We’re also in the business of designing and shaping the future in small but real ways: " },
      {
        text: "what gets automated first, what stays slow on purpose, who benefits when the system is wrong, and what “normal” looks like once a workflow sticks",
        highlight: "mark",
      },
      { text: ". The interfaces and patterns we ship don’t just solve today; they " },
      { text: "train habits and expectations for tomorrow", highlight: "strong" },
      { text: "." },
    ],
    points: [
      {
        icon: "insight",
        title: "Experience over the model",
        body: "Most of us aren’t training models; we’re designing what people see, do, and understand when a model is in the loop: empty states, loading, corrections, and what happens when the system is wrong. That’s the product surface.",
      },
      {
        icon: "workflow",
        title: "Judgment and sequencing",
        body: "The craft is still sequencing information, setting expectations, and choosing what to automate vs. leave explicit. AI can compress steps; the design job is to make sure that compression doesn’t erase accountability.",
      },
      {
        icon: "partnership",
        title: "Same partnership, sharper loops",
        body: "Tight collaboration with engineering (and research, when you have it) isn’t new; it’s just higher stakes when behavior can drift with data and prompts. Design helps the team align on what “good” looks like for real users, not only for demos.",
      },
      {
        icon: "confidence",
        title: "What stays constant",
        body: "Tools and buzzwords will keep changing. What doesn’t is advocating for understandable, fair, and resilient experiences, whether the backend is rules, ML, or something in between.",
      },
    ],
  },
  practice: {
    chapterTitle: "How I practice",
    lead: "Skills and tools I reach for most often, grounded in product work, research, and AI-era workflows.",
    skillGroups: [
      {
        label: "Core craft",
        items: [
          "Product design & UX",
          "AI experience design (transparency, trust, progressive disclosure)",
          "User research & synthesis",
          "Design systems",
        ],
      },
      {
        label: "Design & whiteboarding",
        items: [
          "Figma (advanced)",
          "FigJam",
          "Figma Make",
          "Figma AI",
          "Adobe Creative Suite",
          "Miro",
        ],
      },
      {
        label: "Prototyping & build-adjacent",
        items: ["Cursor", "Claude Code", "Responsive web design"],
      },
      {
        label: "AI workflow",
        items: ["Claude", "ChatGPT", "Gemini", "NotebookLM", "Perplexity"],
      },
      {
        label: "Research & analytics",
        items: ["Dovetail", "Amplitude", "Appcues"],
      },
      {
        label: "Collaboration",
        items: ["Jira", "Confluence", "Notion"],
      },
    ],
    languages: "English: fluent · Korean: fluent · Spanish: native",
  },
  caseStudy: {
    ...(caseStudyData as ProfileContent["caseStudy"]),
    detailsPresentationBeats: cohortDetailsPresentationBeats as NonNullable<
      ProfileContent["caseStudy"]["detailsPresentationBeats"]
    >,
  },
  luneCaseStudy: luneCaseStudyData as LuneCaseStudy,
  contact: {
    phone: "+1 (217) 778-7540",
    portfolioUrl: "https://eunji.design",
    portfolioLabel: "eunji.design",
    linkedInUrl: "https://www.linkedin.com/in/ejung96",
    linkedInLabel: "linkedin.com/in/ejung96",
  },
  credits: {
    body: "Single-page story built with Next.js and Framer Motion. Content reflects my resume; case study deck at the end; layout inspired by editorial scrollytelling.",
    referenceUrl: "https://searchingforbirds.visualcinnamon.com/",
    referenceLabel: "Searching for Birds · Visual Cinnamon",
  },
};
