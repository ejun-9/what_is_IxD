import { ScrollZoomSection } from "@/components/ui/ScrollZoomSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/FadeIn";
import {
  PresentationSectionRail,
  type PresentationSection,
} from "@/components/ui/PresentationSectionRail";
import { IconLightbulb, KomodoRowIcon, LuneRowIcon } from "@/components/icons/LuneShiftIcons";
import { CASE_STUDY_ICONS } from "@/components/icons/CaseStudyLearningIcons";

const ReflectionIconValue = CASE_STUDY_ICONS.assumptions;
const ReflectionIconScope = CASE_STUDY_ICONS.insight;

const reflectionHighlight =
  "rounded-sm bg-[var(--accent)]/14 px-1.5 py-0.5 text-[var(--ink)] [box-decoration-break:clone]";

const komodoRows = [
  {
    label: "Change a color token",
    text: "File a Jira ticket. Wait for an engineer to update the Storybook source. Review in staging. Merge. Days or weeks.",
  },
  {
    label: "Update documentation",
    text: "Write the content. Hand off to engineering. Wait for the MDX file to be updated and deployed. Can't do it yourself.",
  },
  {
    label: "Add a new component",
    text: "Design in Figma, write specs, hand to eng, wait for build, review implementation, revise. Multiple people, multiple weeks.",
  },
  {
    label: "Make a decision",
    text: "Slack thread. Design review. Stakeholder input. Cross functional alignment. The system belongs to everyone, which means it belongs to no one.",
  },
];

const luneRows = [
  {
    label: "Change a color token",
    text: "Update the CSS variable in the foundation file. Push to Cursor. Live. The designer does it in minutes, alone.",
  },
  {
    label: "Update documentation",
    text: "Figma doc pages owned by design. Connected via MCP, any update reflects immediately. No tickets. No waiting.",
  },
  {
    label: "Add a new component",
    text: "Pull from Tailwind's library. Apply brand tokens in Cursor. Document in Figma. Done in one session, one person.",
  },
  {
    label: "Make a decision",
    text: "Think through it with Claude. Make the call. Build it. The designer decides: AI is the thinking partner, not a blocker.",
  },
];

const processSteps = [
  {
    n: "01",
    title: "Brand foundation in conversation",
    body: "Instead of a brand sprint with a room full of stakeholders, the brand foundation was built through direct conversation with Claude. Color roles, type pairing, spacing logic: every decision made by the designer, with AI as a thinking partner. The output wasn't a slide deck. It was a living set of decisions, reasoned through and ready to implement.",
    calloutTitle: "What changed",
    callout:
      "Brand decisions at Komodo went through brand teams, legal review, and accessibility checks across multiple tools. Here, I made the decision, stress tested it with Claude, and moved. Same rigor, fraction of the calendar time.",
  },
  {
    n: "02",
    title: "Tokens documented in Figma via MCP",
    body: "Token pages for color, typography, spacing, and radius, built directly in Figma using the Claude MCP connection. No export scripts. No Storybook MDX. Documentation lives in the same tool as the design, updated by the designer, immediately accurate. When the token changes, the doc changes.",
    calloutTitle: "What changed",
    callout:
      "At Komodo, Figma and Storybook were separate systems that constantly drifted. A token could be updated in one and not the other for weeks. Here there's one source and one owner.",
  },
  {
    n: "03",
    title: "Tailwind as the component layer",
    body: "Lune doesn't need a custom component library. It needs a brand foundation that shapes existing, battle tested components. Tailwind provides the primitives. The design system provides the tokens that make them feel like Lune. This is the right scope for a two person startup, and AI helped clarify that by helping reason through it, not by automating the decision.",
    calloutTitle: "What changed",
    callout:
      "The instinct at Komodo was always to build more. More components, more documentation, more coverage. The better question for a startup is: what do you actually need? AI helped me ask that honestly.",
  },
  {
    n: "04",
    title: "Color as semantic signal",
    body: "One of the sharpest decisions in Lune's system: slate green is reserved exclusively for AI intelligence states. When Lune is actively curating or orchestrating, green appears. Everywhere else, it doesn't. The design system carries the meaning, decided by the designer in one conversation, without a committee, and shipped the same day.",
    calloutTitle: "What changed",
    callout:
      "Semantic color at Komodo involved accessibility teams, engineering review, multiple stakeholders. The decision making was distributed. Here it was mine. And it shipped the same day I made it.",
  },
];

const reflectionTags = [
  "Design Systems",
  "Figma MCP",
  "Claude",
  "Tailwind CSS",
  "Cursor",
  "Brand Identity",
  "Design Tokens",
  "Startup Design",
];

const LUNE_PRESENTATION_SECTIONS: PresentationSection[] = [
  { id: "lune-intro", label: "From consensus to control" },
  {
    id: "lune-background",
    label: "Background. Two systems. Two completely different power structures.",
  },
  { id: "lune-shift", label: "The Shift. Same craft. Different power structure." },
  {
    id: "lune-process",
    label: "How it was built. The process wasn't about moving fast. It was about staying in control.",
  },
  { id: "lune-outcome", label: "Outcome. A complete design system. One designer. Zero tickets." },
  {
    id: "lune-reflection",
    label: "Reflection. What this changed about how I think about design systems.",
  },
];

export function LuneDesignSystemContent() {
  return (
    <>
      <PresentationSectionRail sections={LUNE_PRESENTATION_SECTIONS} />
      {/* Hero */}
      <ScrollZoomSection
        id="lune-intro"
        className="scroll-mt-24 border-b border-[var(--rule)] py-12 md:scroll-mt-28 md:py-16"
        innerClassName="mx-auto max-w-content px-5 md:px-8"
        disableScale
      >
        <FadeIn>
          <p className="mb-3 text-xs font-medium tracking-[0.12em] text-[var(--muted)]">Design Systems · 2026</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-[var(--ink)]">
            From consensus to control.
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-[var(--body)] md:text-xl">
            How building a design system with AI changed what it means for a designer to own the full stack, from brand decision to
            shipped token.
          </p>
          <dl className="mt-10 grid gap-4 border-t border-[var(--rule)] pt-8 text-sm md:grid-cols-2 md:gap-x-8 md:gap-y-5">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Project</dt>
              <dd className="mt-1.5 text-[var(--ink)]">Lune, Wedding Planning App</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Role</dt>
              <dd className="mt-1.5 text-[var(--ink)]">Product Designer · Design System Lead</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Stack</dt>
              <dd className="mt-1.5 text-[var(--ink)]">Claude · Figma MCP · Cursor · Tailwind</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Year</dt>
              <dd className="mt-1.5 text-[var(--ink)]">2026</dd>
            </div>
          </dl>
        </FadeIn>
      </ScrollZoomSection>

      {/* Section 1: Background */}
      <ScrollZoomSection
        id="lune-background"
        className="scroll-mt-24 border-b border-[var(--rule)] py-12 md:scroll-mt-28 md:py-16"
        innerClassName="mx-auto max-w-content px-5 md:px-8"
        disableScale
      >
        <SectionHeader partLabel="Background" title="Two systems. Two completely different power structures." />
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-8">
          <FadeIn>
            <div className="h-full rounded-xl border border-[var(--rule)] bg-[var(--wash)] p-4 md:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Komodo Health · Fire Design System</p>
              <p className="mt-4 leading-relaxed text-[var(--body)]">
                A mature, team maintained system built in Storybook and documented through engineering. Thorough, consistent, and
                completely out of a designer&apos;s hands.
              </p>
              <p className="mt-4 leading-relaxed text-[var(--body)]">
                Every token change, every documentation update, every small correction required a Jira ticket, engineering bandwidth, and a
                review cycle that could take weeks. The system was well built. The designer was a passenger.
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="h-full rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-4 md:p-5 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">Lune · Built with AI</p>
              <p className="mt-4 leading-relaxed text-[var(--body)]">
                A brand foundation built directly with Claude: token decisions, type pairing, color roles, spacing logic. No Storybook. No
                handoff docs. No tickets.
              </p>
              <p className="mt-4 leading-relaxed text-[var(--body)]">
                Documented in Figma via MCP. Components sourced from Tailwind and shaped to the brand in Cursor. The designer controls the
                entire stack, from the first decision to the deployed screen.
              </p>
            </div>
          </FadeIn>
        </div>
      </ScrollZoomSection>

      {/* Section 2: The Shift */}
      <ScrollZoomSection
        id="lune-shift"
        className="scroll-mt-24 border-b border-[var(--rule)] py-12 md:scroll-mt-28 md:py-16"
        innerClassName="mx-auto max-w-content px-5 md:px-8"
        disableScale
      >
        <SectionHeader partLabel="The Shift" title="Same craft. Different power structure." />
        <div className="mt-10 space-y-10 md:space-y-12">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Before: Komodo · Fire Design System</p>
            <ul className="space-y-6">
              {komodoRows.map((row, index) => (
                <li key={row.label} className="flex gap-4 border-l-2 border-[var(--rule-strong)] pl-5">
                  <KomodoRowIcon index={index} />
                  <div>
                    <p className="font-display font-medium text-[var(--ink)]">{row.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--body)] md:text-base">{row.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">After: Lune · Built with AI</p>
            <ul className="space-y-6">
              {luneRows.map((row, index) => (
                <li key={row.label} className="flex gap-4 border-l-2 border-[var(--accent)] pl-5">
                  <LuneRowIcon index={index} />
                  <div>
                    <p className="font-display font-medium text-[var(--ink)]">{row.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--body)] md:text-base">{row.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollZoomSection>

      {/* Section 3: Process */}
      <ScrollZoomSection
        id="lune-process"
        className="scroll-mt-24 border-b border-[var(--rule)] py-12 md:scroll-mt-28 md:py-16"
        innerClassName="mx-auto max-w-content px-5 md:px-8"
        disableScale
      >
        <SectionHeader partLabel="How it was built" title="The process wasn't about moving fast. It was about staying in control." />
        <div className="mt-10 space-y-14 md:mt-12 md:space-y-16">
          {processSteps.map((step) => (
            <FadeIn key={step.n}>
              <div>
                <p className="font-display text-sm font-medium tabular-nums text-[var(--muted)]">{step.n}</p>
                <div className="mt-2 grid gap-8 md:grid-cols-[1fr_minmax(260px,320px)] md:gap-10 lg:gap-12">
                  <div>
                    <h3 className="font-display text-xl font-medium text-[var(--ink)] md:text-2xl">{step.title}</h3>
                    <p className="mt-4 leading-relaxed text-[var(--body)] md:text-lg">{step.body}</p>
                  </div>
                  <aside className="rounded-xl border border-[var(--rule)] bg-[var(--wash)] p-4 md:p-5 md:self-start">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{step.calloutTitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--body)]">{step.callout}</p>
                  </aside>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </ScrollZoomSection>

      {/* Section 4: Outcome */}
      <ScrollZoomSection
        id="lune-outcome"
        className="scroll-mt-24 border-b border-[var(--rule)] py-12 md:scroll-mt-28 md:py-16"
        innerClassName="mx-auto max-w-content px-5 md:px-8"
        disableScale
      >
        <SectionHeader partLabel="Outcome" title="A complete design system. One designer. Zero tickets." />
        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-6">
          <FadeIn className="h-full">
            <div className="flex h-full flex-col rounded-xl border border-[var(--rule)] bg-[var(--wash)] p-4 text-center md:p-5">
              <p className="font-display text-4xl font-medium text-[var(--accent)] md:text-5xl">1</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--body)]">
                Designer owned the entire system, from brand decision to deployed token. No engineering dependency on documentation or token
                updates.
              </p>
            </div>
          </FadeIn>
          <FadeIn className="h-full">
            <div className="flex h-full flex-col rounded-xl border border-[var(--rule)] bg-[var(--wash)] p-4 text-center md:p-5">
              <p className="font-display text-4xl font-medium text-[var(--accent)] md:text-5xl">0</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--body)]">
                Jira tickets filed to update design system documentation. All token and doc changes made directly by the designer.
              </p>
            </div>
          </FadeIn>
          <FadeIn className="h-full">
            <div className="flex h-full flex-col rounded-xl border border-[var(--rule)] bg-[var(--wash)] p-4 text-center md:p-5">
              <p className="font-display text-4xl font-medium text-[var(--accent)] md:text-5xl">↑</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--body)]">
                Decisions made with higher confidence in far less calendar time. AI as thinking partner, not gatekeeper.
              </p>
            </div>
          </FadeIn>
        </div>
      </ScrollZoomSection>

      {/* Section 5: Reflection */}
      <ScrollZoomSection
        id="lune-reflection"
        className="scroll-mt-24 py-12 md:scroll-mt-28 md:py-16"
        innerClassName="mx-auto max-w-content px-5 md:px-8"
        disableScale
      >
        <SectionHeader partLabel="Reflection" title="What this changed about how I think about design systems." />
        <FadeIn>
          <div className="mt-8 space-y-10 text-base leading-relaxed text-[var(--body)] md:mt-10 md:space-y-12 md:text-lg">
            <div className="flex gap-4 md:gap-5">
              <span
                className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--wash)] text-[var(--accent)]"
                aria-hidden
              >
                <ReflectionIconValue className="h-5 w-5" />
              </span>
              <p className="min-w-0 flex-1">
                A design system&apos;s value isn&apos;t in its completeness. It&apos;s in{" "}
                <mark className={reflectionHighlight}>
                  how quickly the people who use it can make decisions
                </mark>
                . The Fire design system at Komodo was comprehensive and well built. But it was slow to change, hard to influence, and owned
                by a committee.{" "}
                <strong className="font-semibold text-[var(--ink)]">
                  Right model for a large org. Wrong model for a startup.
                </strong>
              </p>
            </div>
            <div className="flex gap-4 md:gap-5">
              <span
                className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--wash)] text-[var(--accent)]"
                aria-hidden
              >
                <ReflectionIconScope className="h-5 w-5" />
              </span>
              <p className="min-w-0 flex-1">
                Building Lune&apos;s system taught me to ask a different question. Not &ldquo;what should a design system include?&rdquo; but{" "}
                <mark className={reflectionHighlight}>&ldquo;what does this team actually need to ship?&rdquo;</mark> The answer:{" "}
                <strong className="font-semibold text-[var(--ink)]">
                  a clear brand foundation, semantic token decisions, and a component strategy
                </strong>{" "}
                that doesn&apos;t require reinventing what already exists.
              </p>
            </div>
            <div className="flex gap-4 md:gap-5">
              <span
                className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--wash)] text-[var(--accent)]"
                aria-hidden
              >
                <IconLightbulb className="h-5 w-5" />
              </span>
              <p className="min-w-0 flex-1">
                <mark className={reflectionHighlight}>AI didn&apos;t replace design judgment.</mark> It{" "}
                <strong className="font-semibold text-[var(--ink)]">eliminated the friction that slows judgment down.</strong> Every
                decision in Lune&apos;s system (the color roles, the type pairing, the green for AI only rule) was made by a designer.{" "}
                <mark className={reflectionHighlight}>Claude helped me think faster, not think less.</mark>
              </p>
            </div>
          </div>
          <ul
            className="mt-10 flex flex-wrap gap-2"
            aria-label="Topics"
          >
            {reflectionTags.map((tag) => (
              <li key={tag}>
                <span className="inline-flex rounded-full border border-[var(--rule)] bg-[var(--wash)] px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)]">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </ScrollZoomSection>
    </>
  );
}
