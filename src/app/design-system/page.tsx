import type { Metadata } from "next";
import { CountUp } from "@/components/motion/count-up";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { type StepItem, StickyStack } from "@/components/motion/sticky-stack";
import { CaseStudyCard } from "@/components/site/cards/case-study-card";
import { ServiceCard } from "@/components/site/cards/service-card";
import { TeamCard } from "@/components/site/cards/team-card";
import { CtaButton } from "@/components/site/cta-button";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { SectionHeading } from "@/components/site/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Design System & Motion Showcase — Finergetics",
  description:
    "Internal design system showcase for Finergetics Consulting Limited.",
  robots: {
    index: false,
    follow: false,
  },
};

const COLOR_TOKENS = [
  {
    name: "Navy 950",
    hex: "#061061",
    role: "Primary dark background, cover blocks",
    tone: "dark",
  },
  {
    name: "Royal 800",
    hex: "#072B8E",
    role: "Principal cards, deep headers",
    tone: "dark",
  },
  {
    name: "Royal 700",
    hex: "#04309F",
    role: "Heading blue, hover states",
    tone: "dark",
  },
  {
    name: "Royal 600",
    hex: "#1649B9",
    role: "Brand primary, active buttons, links",
    tone: "dark",
  },
  {
    name: "Charcoal Ink 900",
    hex: "#22262B",
    role: "Service card 2, dark typography",
    tone: "dark",
  },
  {
    name: "Slate 600",
    hex: "#565B64",
    role: "Service card 4, secondary text",
    tone: "dark",
  },
  {
    name: "Silver 400",
    hex: "#B1B3B8",
    role: "Hairline borders, subtle text",
    tone: "light",
  },
  {
    name: "Sky 100",
    hex: "#CDE2F7",
    role: "Backdrop tint, badge highlights",
    tone: "light",
  },
  {
    name: "Sky 50",
    hex: "#F6F9FC",
    role: "Page background light, cards",
    tone: "light",
  },
  {
    name: "White",
    hex: "#FFFFFF",
    role: "Card backgrounds, text on dark",
    tone: "light",
  },
];

const ADVISORY_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Diagnostic & Scoping",
    subtitle: "Financial & Operating Controls Review",
    description:
      "We begin with rigorous baseline data collection, reviewing existing JV contracts, financial reporting frameworks, and operational governance to isolate exposure areas.",
    deliverables: [
      "Initial Risk & Compliance Assessment",
      "Governance & JV Agreement Gap Analysis",
      "Targeted Value Opportunity Scope",
    ],
    takeaway:
      "Complete clarity on critical financial exposures and high-impact levers.",
    tone: "royal",
  },
  {
    number: "02",
    title: "Economic Modeling & Analysis",
    subtitle: "Fiscal Regime & Valuation Rigor",
    description:
      "Our team constructs dynamic valuation models and fiscal regime sensitivity scenarios to assess cash flow vulnerability under shifting regulatory and market conditions.",
    deliverables: [
      "Custom Cash Flow & Fiscal Models",
      "Scenario Sensitivity & Break-even Runs",
      "Benchmark Comparison against Peers",
    ],
    takeaway:
      "Defensible, auditable financial models ready for board and investor scrutiny.",
    tone: "charcoal",
  },
  {
    number: "03",
    title: "Actionable Recommendations",
    subtitle: "Independent, Senior-Level Guidance",
    description:
      "Independent advisory formulated by consultants with 30+ years of direct oil & gas finance oversight, providing unvarnished recommendations.",
    deliverables: [
      "Executive Advisory Roadmap",
      "Cost Recovery Strategy Document",
      "Contractual Renegotiation Guidance",
    ],
    takeaway:
      "Pragmatic, high-conviction decision roadmaps that protect margin and cash.",
    tone: "navy",
  },
  {
    number: "04",
    title: "Implementation & Oversight",
    subtitle: "Governance & Sustainable Value",
    description:
      "We partner with executive teams to install strengthened internal controls, monitor ongoing compliance, and verify bottom-line value capture.",
    deliverables: [
      "Internal Audit & Control Metrics",
      "Executive Dashboard Reporting",
      "Post-Implementation Value Audit",
    ],
    takeaway:
      "Sustainable, repeatable performance governance embedded into your team.",
    tone: "slate",
  },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-sky-50 text-ink-900 overflow-x-hidden max-w-full w-full">
      <Header />

      <main className="pt-32 pb-24 space-y-32 overflow-x-hidden max-w-full">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <Reveal>
            <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-16 border border-silver-400/25 shadow-sm space-y-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-royal-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-royal-600" />
                Internal Engineering Artifact · Phase 2 Design System
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-navy-950">
                Finergetics Design System & Motion Specification
              </h1>
              <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                Patterned after the Webflow People Work™ UX rhythm, typography
                hierarchy, and motion vocabulary—built with flat corporate brand
                tokens, strict accessibility compliance, and zero gradients.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Section 1: Color Palette */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
          <SectionHeading
            eyebrow="01 · Brand Color System"
            title="Curated Corporate"
            highlight="Color Palette"
            description="Flat solid fills only. Strictly NO gradients, NO glowing neon borders, and NO synthetic purple/teal AI palettes."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.hex}
                className="rounded-2xl p-5 border border-silver-400/25 shadow-sm flex flex-col justify-between h-48 transition-transform hover:-translate-y-1"
                style={{ backgroundColor: token.hex }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      token.tone === "dark"
                        ? "text-xs font-bold uppercase tracking-wider text-white"
                        : "text-xs font-bold uppercase tracking-wider text-ink-900"
                    }
                  >
                    {token.name}
                  </span>
                </div>
                <div>
                  <p
                    className={
                      token.tone === "dark"
                        ? "text-xs text-silver-400 leading-tight mb-2"
                        : "text-xs text-slate-600 leading-tight mb-2"
                    }
                  >
                    {token.role}
                  </p>
                  <p
                    className={
                      token.tone === "dark"
                        ? "font-mono text-xs font-semibold text-sky-100"
                        : "font-mono text-xs font-semibold text-royal-700"
                    }
                  >
                    {token.hex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Typography Scale */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
          <SectionHeading
            eyebrow="02 · Typography Scale"
            title="Editorial Authority &"
            highlight="Display Contrast"
            description="Display headings leverage Gabriel Sans Black / Archivo Black, UI chrome and interactive elements use Outfit, and body text utilizes Open Sans."
          />

          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 border border-silver-400/25 space-y-10">
            <div className="space-y-2 border-b border-silver-400/20 pb-8">
              <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
                Display Headline 1 · font-display / Archivo Black
              </span>
              <p className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-navy-950">
                Helping businesses control risk & increase value
              </p>
            </div>

            <div className="space-y-2 border-b border-silver-400/20 pb-8">
              <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
                Editorial Heading Pair · Display + Italic Subhead
              </span>
              <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-navy-950">
                Independent Reviews &{" "}
                <span className="font-ui font-bold italic normal-case text-royal-600">
                  Strategic Recommendations
                </span>
              </h2>
            </div>

            <div className="space-y-2 border-b border-silver-400/20 pb-8">
              <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
                Section Heading Eyebrow · bullet-dot prefix
              </span>
              <div className="text-xs font-semibold tracking-widest uppercase text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-royal-600" />
                <span>• OUR CORE SERVICES</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
                Body Copy & Narrative Rhythm · font-body / Open Sans
              </span>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
                We help organisations strengthen financial controls, optimise
                commercial decisions, improve operational performance, and
                manage risk. Our practical, data-driven approach delivers
                actionable insights that support compliance, profitability, and
                sustainable growth.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive CTA Buttons */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
          <SectionHeading
            eyebrow="03 · Action Components"
            title="High-Converting"
            highlight="CTA Buttons"
            description="Pill-shaped action buttons featuring circular arrow indicators that animate with translate and rotation micro-interactions on hover."
          />

          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 border border-silver-400/25 space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <CtaButton href="#buttons" variant="primary" size="lg">
                Primary Advisory Pill (lg)
              </CtaButton>
              <CtaButton href="#buttons" variant="primary" size="md">
                Standard Button (md)
              </CtaButton>
              <CtaButton href="#buttons" variant="primary" size="sm">
                Compact Nav (sm)
              </CtaButton>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-silver-400/20">
              <CtaButton href="#buttons" variant="secondary" size="md">
                Navy Secondary
              </CtaButton>
              <CtaButton href="#buttons" variant="outline" size="md">
                Hairline Outline
              </CtaButton>
              <div className="bg-navy-950 p-3 rounded-2xl inline-flex">
                <CtaButton href="#buttons" variant="white" size="md">
                  High-Contrast White
                </CtaButton>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Motion Primitives Demo */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
          <SectionHeading
            eyebrow="04 · Motion Primitives"
            title="Scroll Reveals &"
            highlight="Micro-Interactions"
            description="Hardware-accelerated transforms honoring prefers-reduced-motion with zero layout shifts."
          />

          {/* Reveal & Stagger Grid */}
          <div className="space-y-6">
            <h3 className="font-display text-xl uppercase tracking-wider text-slate-600">
              Reveal Directions & Stagger
            </h3>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StaggerItem>
                <div className="p-8 rounded-3xl bg-white border border-silver-400/25 shadow-sm space-y-3">
                  <span className="font-display text-2xl text-royal-600">
                    01
                  </span>
                  <h4 className="font-display text-xl uppercase text-ink-900">
                    Fade & Translate Up
                  </h4>
                  <p className="text-sm text-slate-600">
                    Smooth 700ms entrance with cubic-bezier(0.22, 1, 0.36, 1)
                    easing.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-8 rounded-3xl bg-white border border-silver-400/25 shadow-sm space-y-3">
                  <span className="font-display text-2xl text-royal-600">
                    02
                  </span>
                  <h4 className="font-display text-xl uppercase text-ink-900">
                    Sequential Stagger
                  </h4>
                  <p className="text-sm text-slate-600">
                    Each card animates with an 80ms sequential incremental
                    delay.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-8 rounded-3xl bg-white border border-silver-400/25 shadow-sm space-y-3">
                  <span className="font-display text-2xl text-royal-600">
                    03
                  </span>
                  <h4 className="font-display text-xl uppercase text-ink-900">
                    Reduced Motion Guard
                  </h4>
                  <p className="text-sm text-slate-600">
                    Users with reduced-motion preference see instant opacity
                    with zero movement.
                  </p>
                </div>
              </StaggerItem>
            </Stagger>
          </div>

          {/* Animated Stats CountUp */}
          <div className="bg-navy-950 text-white rounded-3xl p-10 md:p-14 border border-white/10">
            <p className="text-xs font-semibold tracking-widest uppercase text-sky-100 mb-6">
              Animated Metric Counters (&lt;CountUp /&gt;)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <span className="font-display text-4xl sm:text-6xl text-white block">
                  <CountUp end={30} suffix="+" />
                </span>
                <span className="text-xs uppercase tracking-wider text-silver-400 font-semibold mt-1 block">
                  Years Industry Experience
                </span>
              </div>
              <div>
                <span className="font-display text-4xl sm:text-6xl text-sky-100 block">
                  <CountUp end={100} prefix="$" suffix="M+" />
                </span>
                <span className="text-xs uppercase tracking-wider text-silver-400 font-semibold mt-1 block">
                  JV Value Analyzed
                </span>
              </div>
              <div>
                <span className="font-display text-4xl sm:text-6xl text-white block">
                  <CountUp end={4} />
                </span>
                <span className="text-xs uppercase tracking-wider text-silver-400 font-semibold mt-1 block">
                  Core Advisory Disciplines
                </span>
              </div>
              <div>
                <span className="font-display text-4xl sm:text-6xl text-sky-100 block">
                  <CountUp end={100} suffix="%" />
                </span>
                <span className="text-xs uppercase tracking-wider text-silver-400 font-semibold mt-1 block">
                  Independent & Conflict-Free
                </span>
              </div>
            </div>
          </div>

          {/* Infinite Marquee Ticker */}
          <div className="space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-slate-600">
              Infinite Horizontal Marquee (&lt;Marquee /&gt;)
            </h3>
            <div className="py-6 bg-white rounded-2xl border border-silver-400/25 overflow-hidden">
              <Marquee speed={30}>
                {[
                  "Oil & Gas Operators",
                  "Joint Venture Partners",
                  "Oil & Gas Service Companies",
                  "Energy Investors",
                  "Financial Institutions",
                  "Utilities & Regulators",
                  "Infrastructure Companies",
                  "Government Agencies",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold tracking-wider uppercase text-slate-600 px-4"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-royal-600" />
                    {item}
                  </span>
                ))}
              </Marquee>
            </div>
          </div>
        </section>

        {/* Section 5: The 4-Tone Core Service Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
          <SectionHeading
            eyebrow="05 · Service Card Grid"
            title="The 4-Tone Solid"
            highlight="Card Palette"
            description="Alternating solid tones from the Finergetics corporate palette: Royal Blue, Charcoal Ink, Deep Navy, and Slate Grey with interactive arrow pill rotation."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceCard
              index={0}
              slug="financial-control-and-advisory"
              title="Financial Control & Advisory Services"
              tagline="Independent Reviews & Recommendations"
              summary="We help organisations strengthen financial controls, optimise commercial decisions, improve operational performance, and manage risk with actionable insights."
              tone="royal"
            />
            <ServiceCard
              index={1}
              slug="commercial-economics-and-investment-analysis"
              title="Commercial Economics & Investment Analysis"
              tagline="Valuation & Scenario Analysis"
              summary="Rigorous cash flow valuation, fiscal regime sensitivity runs, asset valuation, and commercial risk screening for high-capital investments."
              tone="charcoal"
            />
            <ServiceCard
              index={2}
              slug="ep-fiscal-regime-advisory"
              title="E & P Fiscal Regime Advisory"
              tagline="Cost Analysis & Fiscal Regime Implications"
              summary="Strategic navigation of E&P contractual frameworks, joint operating agreements (JOA), production sharing contracts (PSC), and fiscal compliance."
              tone="navy"
            />
            <ServiceCard
              index={3}
              slug="performance-diagnosis-and-improvement"
              title="Performance Diagnosis & Improvement"
              tagline="Operational Insights & Value Drivers"
              summary="Data-driven diagnosis of financial performance drivers, working capital leakage, operational bottleneck resolution, and governance uplift."
              tone="slate"
            />
          </div>
        </section>

        {/* Section 6: Sticky-Stack Process Tracker */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
          <SectionHeading
            eyebrow="06 · Signature People Work™ Pattern"
            title="Two-Column"
            highlight="Sticky-Stack Process"
            description="The left index column pins to the viewport while right cards scroll past, updating the active stage indicator dynamically."
          />

          <StickyStack steps={ADVISORY_STEPS} />
        </section>

        {/* Section 7: Principal Consultants & Case Studies */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
          <SectionHeading
            eyebrow="07 · Credentials & Case Studies"
            title="Team & Proof"
            highlight="Card Geometry"
            description="Structured cards for Principal Consultants and verifiable case studies."
          />

          {/* Consultants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TeamCard
              slug="rotimi-lawuyi"
              name="Rotimi Lawuyi"
              roleTitle="Lead Consultant"
              credentials="FCA, FCIB, PhD"
              bioSummary="Over 30 years in banking and Oil & Gas Finance specializing in business & financial controls, risk management, and internal audits across complex joint ventures."
              highlights={[
                "30+ years in banking & Oil & Gas Finance",
                "Specialist in business & financial controls",
                "Risk management and internal audit leadership",
              ]}
              linkedinUrl="https://linkedin.com"
            />
            <TeamCard
              slug="edidiong-eyoma"
              name="Edidiong Eyoma"
              roleTitle="Senior Consultant"
              credentials="FMNES, MBA, MSc"
              bioSummary="Nearly 30 years in Oil & Gas Finance, highly experienced in Non-Operated Venture (NOV) oversight, fiscal regime economics, and corporate performance management."
              highlights={[
                "Nearly 30 years in Oil & Gas Finance",
                "Experienced in NOV oversight & governance",
                "Business performance management specialist",
              ]}
              linkedinUrl="https://linkedin.com"
            />
          </div>

          {/* Case Studies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <CaseStudyCard
              slug="jv-audit-cost-recovery"
              title="Joint Venture Cost Recovery & Audit Dispute Resolution"
              industry="Oil & Gas Upstream"
              clientName="Confidential JV Operator"
              summary="Conducted an independent financial control review on $240M in disputed operator expenditure, unlocking verified audit settlement."
              metricValue="$42M+"
              metricLabel="Cost Recovery Value Reconciled"
            />
            <CaseStudyCard
              slug="fiscal-regime-evaluation"
              title="Deepwater E&P Fiscal Regime Transition Economic Model"
              industry="Energy Investment"
              clientName="Institutional Energy Investor"
              summary="Developed dynamic cash flow sensitivity models assessing transition implications of recent fiscal legislation on offshore concession assets."
              metricValue="18.5%"
              metricLabel="IRR Scenario Precision Delivered"
            />
          </div>
        </section>

        {/* Section 8: Accordions & FAQ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-8">
          <SectionHeading
            eyebrow="08 · Collapsible Accordion"
            title="Smooth Grid-Height"
            highlight="Accordion Pattern"
            description="Minimalist hairline-bordered collapsible rows with smooth height interpolation and 180° rotation."
          />

          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 border border-silver-400/25 max-w-4xl mx-auto">
            <Accordion className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-display text-lg uppercase text-ink-900 hover:text-royal-600">
                  What makes Finergetics' advisory independent?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm leading-relaxed">
                  Finergetics is an independent advisory firm with zero
                  commercial affiliations to audit firms, brokers, or operators.
                  Our principal consultants provide unbiased, evidence-backed
                  recommendations directly aligned with institutional
                  shareholder value.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-display text-lg uppercase text-ink-900 hover:text-royal-600">
                  How are joint venture financial audits scoped?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm leading-relaxed">
                  Audits begin with an initial scoping review of the Joint
                  Operating Agreement (JOA), followed by rigorous accounting
                  ledger sampling, cost-allocation verifications, and
                  bench-marking against international petroleum industry norms.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-display text-lg uppercase text-ink-900 hover:text-royal-600">
                  Can Finergetics work with overseas or multi-jurisdictional
                  assets?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm leading-relaxed">
                  Yes. Our consultants possess over 30 years of global
                  experience across multiple energy jurisdictions, tailoring
                  economic models to both local statutory mandates and
                  international financial reporting standards.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Section 9: Pre-Footer CTA Card */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="rounded-3xl bg-navy-950 text-white p-6 sm:p-10 md:p-16 border border-white/10 text-center space-y-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-sky-100 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-100" />
              Direct Principal Engagement
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight max-w-2xl mx-auto leading-tight">
              Ready for an Initial Advisory Discussion?
            </h2>
            <p className="text-silver-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Connect directly with our Lead Consultants to discuss financial
              controls, JV governance, or fiscal regime optimization.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <CtaButton href="/book-a-call" size="lg" variant="primary">
                Book an Advisory Discussion
              </CtaButton>
              <CtaButton
                href="mailto:info@finergetics.com"
                size="lg"
                variant="white"
              >
                Email info@finergetics.com
              </CtaButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
