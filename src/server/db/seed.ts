import { db } from "./client";
import {
  caseStudies,
  pages,
  postCategories,
  posts,
  services,
  siteSettings,
  teamMembers,
} from "./schema";

async function seed() {
  console.log("🌱 Starting Finergetics database seeding...");

  // 1. Site Settings (Singleton)
  console.log("⏳ Seeding site settings...");
  const settingsData = {
    general: {
      siteName: "Finergetics Consulting Limited",
      tagline: "Consulting Limited",
      brandLine:
        "Helping businesses control risk, improve performance, and increase value.",
      missionStatement:
        "We help organisations strengthen financial controls, optimise commercial decisions, improve operational performance, and manage risk. Our practical, data-driven approach delivers actionable insights that support compliance, profitability, and sustainable growth.",
      defaultSeoTitle:
        "Finergetics Consulting Limited — Risk, Performance & Value",
      defaultSeoDescription:
        "Helping businesses control risk, improve performance, and increase value. Independent energy & financial advisory for oil & gas operators, JV partners, and energy investors.",
    },
    contact: {
      email: "info@finergetics.com",
      phone1: "+234 803 754 1083",
      phone2: "+234 810 040 3013",
      businessHours: "Mon – Fri: 8:00 AM – 6:00 PM (WAT / GMT+1)",
      address: "Lagos, Nigeria",
    },
    social: {
      linkedin: "https://www.linkedin.com/company/finergetics-consulting",
      twitter: "",
    },
    navigation: {
      header: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "About Us", href: "/about" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Insights", href: "/blog" },
      ],
      footerSections: [
        {
          title: "Core Services",
          links: [
            {
              label: "Financial Control & Advisory",
              href: "/services/financial-control-and-advisory",
            },
            {
              label: "Commercial Economics & Valuation",
              href: "/services/commercial-economics-and-investment-analysis",
            },
            {
              label: "E & P Fiscal Regime Advisory",
              href: "/services/ep-fiscal-regime-advisory",
            },
            {
              label: "Performance Diagnosis & Drivers",
              href: "/services/performance-diagnosis-and-improvement",
            },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About Us", href: "/about" },
            { label: "Consultant Team", href: "/about#team" },
            { label: "Case Studies", href: "/case-studies" },
            { label: "Latest Insights", href: "/blog" },
            { label: "Book an Advisory Call", href: "/book-a-call" },
          ],
        },
      ],
    },
    security: {
      recaptchaThreshold: 50,
    },
  };

  await db
    .insert(siteSettings)
    .values({
      id: 1,
      data: settingsData,
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        data: settingsData,
      },
    });

  // 2. Services (4 Core Services from Appendix A)
  console.log("⏳ Seeding core services...");
  const serviceList = [
    {
      slug: "financial-control-and-advisory",
      title: "Financial Control & Advisory Services",
      tagline: "Independent Reviews & Recommendations",
      summary:
        "We help organisations strengthen financial controls, optimise commercial decisions, improve operational performance, and manage risk with actionable, data-driven insights.",
      cardTone: "royal",
      sortOrder: 1,
      status: "published" as const,
      seoTitle: "Financial Control & Advisory — Finergetics",
      seoDescription:
        "Independent financial reviews, Joint Venture audit resolution, and governance risk mitigation.",
    },
    {
      slug: "commercial-economics-and-investment-analysis",
      title: "Commercial Economics & Investment Analysis",
      tagline: "Valuation & Scenario Analysis",
      summary:
        "Rigorous cash flow valuation, fiscal regime sensitivity runs, asset valuation, and commercial risk screening for high-capital investments.",
      cardTone: "charcoal",
      sortOrder: 2,
      status: "published" as const,
      seoTitle: "Commercial Economics & Investment Analysis — Finergetics",
      seoDescription:
        "Valuation models, scenario testing, and commercial decision support for energy assets.",
    },
    {
      slug: "ep-fiscal-regime-advisory",
      title: "E & P Fiscal Regime Advisory",
      tagline: "Cost Analysis & Fiscal Regime Implications",
      summary:
        "Strategic navigation of E&P contractual frameworks, joint operating agreements (JOA), production sharing contracts (PSC), and fiscal compliance.",
      cardTone: "navy",
      sortOrder: 3,
      status: "published" as const,
      seoTitle: "E & P Fiscal Regime Advisory — Finergetics",
      seoDescription:
        "Contractual frameworks, PSC cost recovery, and fiscal compliance advisory.",
    },
    {
      slug: "performance-diagnosis-and-improvement",
      title: "Performance Diagnosis & Improvement",
      tagline: "Operational Insights & Value Drivers",
      summary:
        "Data-driven diagnosis of financial performance drivers, working capital leakage, operational bottleneck resolution, and governance uplift.",
      cardTone: "slate",
      sortOrder: 4,
      status: "published" as const,
      seoTitle: "Performance Diagnosis & Improvement — Finergetics",
      seoDescription:
        "Financial performance diagnosis, bottleneck resolution, and operational efficiency.",
    },
  ];

  for (const s of serviceList) {
    await db.insert(services).values(s).onConflictDoUpdate({
      target: services.slug,
      set: s,
    });
  }

  // 3. Principal Consultants (Appendix A)
  console.log("⏳ Seeding principal consultants...");
  const consultants = [
    {
      slug: "rotimi-lawuyi",
      name: "Rotimi Lawuyi",
      role: "Lead Consultant",
      credentials: "FCA, FCIB, PhD",
      photo: {
        publicId: "/images/rotimi-lawuyi.jpg",
        width: 1200,
        height: 1600,
        alt: "Rotimi Lawuyi, Lead Consultant at Finergetics",
      },
      highlights: [
        "30+ years in banking & Oil & Gas Finance",
        "Specialist in business & financial controls",
        "Risk management and internal audit leadership across complex JVs",
      ],
      bio: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Over 30 years in banking and Oil & Gas Finance specializing in business & financial controls, risk management, and internal audits across complex joint ventures. Proven leadership advising major operators and institutional stakeholders on financial governance.",
              },
            ],
          },
        ],
      },
      linkedinUrl: "https://www.linkedin.com",
      sortOrder: 1,
      status: "published" as const,
    },
    {
      slug: "edidiong-eyoma",
      name: "Edidiong Eyoma",
      role: "Senior Consultant",
      credentials: "FMNES, MBA, MSc",
      highlights: [
        "Nearly 30 years in Oil & Gas Finance",
        "Experienced in Non-Operated Venture (NOV) oversight & governance",
        "Business performance management specialist",
      ],
      bio: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Nearly 30 years in Oil & Gas Finance, highly experienced in Non-Operated Venture (NOV) oversight, fiscal regime economics, and corporate performance management. Deep domain knowledge in upstream energy accounting and asset value optimization.",
              },
            ],
          },
        ],
      },
      linkedinUrl: "https://www.linkedin.com",
      sortOrder: 2,
      status: "published" as const,
    },
  ];

  for (const c of consultants) {
    await db.insert(teamMembers).values(c).onConflictDoUpdate({
      target: teamMembers.slug,
      set: c,
    });
  }

  // Retrieve consultant IDs for author linking
  const seededTeam = await db.select().from(teamMembers);
  const rotimiId = seededTeam.find((t) => t.slug === "rotimi-lawuyi")?.id;
  const edidiongId = seededTeam.find((t) => t.slug === "edidiong-eyoma")?.id;

  // 4. Post Categories
  console.log("⏳ Seeding blog categories...");
  const categories = [
    {
      slug: "energy-fiscal-regimes",
      name: "Energy Fiscal Regimes",
    },
    {
      slug: "jv-governance-and-audits",
      name: "JV Governance & Audits",
    },
    {
      slug: "commercial-economics",
      name: "Commercial Economics",
    },
    {
      slug: "performance-improvement",
      name: "Performance Improvement",
    },
  ];

  for (const cat of categories) {
    await db.insert(postCategories).values(cat).onConflictDoUpdate({
      target: postCategories.slug,
      set: cat,
    });
  }

  const seededCategories = await db.select().from(postCategories);
  const jvCatId = seededCategories.find(
    (c) => c.slug === "jv-governance-and-audits",
  )?.id;
  const fiscalCatId = seededCategories.find(
    (c) => c.slug === "energy-fiscal-regimes",
  )?.id;

  // 5. Initial Case Studies
  console.log("⏳ Seeding initial case studies...");
  const seededServices = await db.select().from(services);
  const finControlServiceId = seededServices.find(
    (s) => s.slug === "financial-control-and-advisory",
  )?.id;
  const fiscalServiceId = seededServices.find(
    (s) => s.slug === "ep-fiscal-regime-advisory",
  )?.id;

  const caseStudyList = [
    {
      slug: "jv-audit-cost-recovery",
      title: "Joint Venture Cost Recovery & Audit Dispute Resolution",
      clientName: "Confidential JV Operator",
      industry: "Oil & Gas Upstream",
      serviceId: finControlServiceId,
      summary:
        "Conducted an independent financial control review on $240M in disputed operator expenditure, unlocking verified audit settlement.",
      challenge: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "An offshore joint venture partner faced prolonged disputes over multi-year non-operator cost billings totaling $240 million, threatening JV partner consensus and capital expenditure approvals.",
              },
            ],
          },
        ],
      },
      approach: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Finergetics deployed a structured forensic audit protocol, sampling accounting ledgers, reconciling JOA cost-allocation keys, and conducting independent technical benchmarking against industry norms.",
              },
            ],
          },
        ],
      },
      outcome: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Achieved full bilateral agreement on $42M in reconciled cost-recovery credits and established an updated financial controls framework adopted by the operating committee.",
              },
            ],
          },
        ],
      },
      metrics: [
        { label: "Expenditure Reviewed", value: "$240M" },
        { label: "Cost Recovery Reconciled", value: "$42M+" },
        { label: "Audit Settlement Achieved", value: "100%" },
      ],
      featured: true,
      publishedAt: new Date("2026-03-15"),
      status: "published" as const,
      seoTitle: "JV Audit Cost Recovery Case Study — Finergetics",
      seoDescription:
        "Independent financial review reconciling $42M in joint venture cost recovery disputes.",
    },
    {
      slug: "fiscal-regime-evaluation",
      title: "Deepwater E&P Fiscal Regime Transition Economic Model",
      clientName: "Institutional Energy Investor",
      industry: "Energy Investment",
      serviceId: fiscalServiceId,
      summary:
        "Developed dynamic cash flow sensitivity models assessing transition implications of recent fiscal legislation on offshore concession assets.",
      challenge: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "An institutional energy consortium needed rigorous economic valuation models to assess capital allocation across deepwater concessions under newly enacted fiscal terms.",
              },
            ],
          },
        ],
      },
      approach: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Built integrated stochastic financial models incorporating royalty rate shifts, production allowance ceilings, and tax optimization pathways across a 25-year asset lifecycle.",
              },
            ],
          },
        ],
      },
      outcome: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Delivered investment committee sign-off with 18.5% IRR scenario precision, safeguarding $150M in subsequent offshore development financing.",
              },
            ],
          },
        ],
      },
      metrics: [
        { label: "Concession Value Screened", value: "$1.2B" },
        { label: "IRR Precision Model", value: "18.5%" },
        { label: "Capital Deployed Safely", value: "$150M" },
      ],
      featured: true,
      publishedAt: new Date("2026-06-20"),
      status: "published" as const,
      seoTitle: "Deepwater Fiscal Regime Transition Case Study — Finergetics",
      seoDescription:
        "Dynamic financial modeling evaluating deepwater E&P fiscal legislation impacts.",
    },
  ];

  for (const cs of caseStudyList) {
    await db.insert(caseStudies).values(cs).onConflictDoUpdate({
      target: caseStudies.slug,
      set: cs,
    });
  }

  // 6. Initial Blog Posts
  console.log("⏳ Seeding initial blog posts...");
  const postList = [
    {
      slug: "navigating-deepwater-psc-cost-recovery",
      title:
        "Navigating Deepwater PSC Cost Recovery: Critical Lessons for Non-Operating Partners",
      excerpt:
        "Why standard joint operating agreement procedures frequently fail to detect cost leakage in deepwater development projects—and how non-operating partners can protect their fiscal entitlements.",
      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "In deepwater exploration and production, production sharing contracts (PSCs) establish rigorous yet complex cost-recovery mechanisms. For non-operating partners and institutional investors, ensuring that operators correctly classify recoverable expenditures is fundamental to project economics.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              {
                type: "text",
                text: "Key Risk Areas in Joint Venture Accounting",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Discrepancies most frequently arise in shared overhead allocations, parent company technical service fees, and foreign exchange conversion timing. Independent audit reviews must combine legal contract interpretation with forensic ledger reconciliation to ensure audit exceptions are defensible.",
              },
            ],
          },
        ],
      },
      categoryId: fiscalCatId,
      authorId: rotimiId,
      readingMinutes: 6,
      publishedAt: new Date("2026-08-10"),
      status: "published" as const,
      seoTitle: "Deepwater PSC Cost Recovery Advisory — Finergetics",
      seoDescription:
        "Strategic insights on cost recovery governance in deepwater production sharing contracts.",
    },
    {
      slug: "strengthening-jv-internal-controls",
      title:
        "Strengthening JV Internal Controls: Practical Guidelines for Operating Committees",
      excerpt:
        "How operating committees can establish proactive, data-driven financial controls that prevent billing disputes, enforce contract compliance, and streamline annual audits.",
      body: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Joint ventures represent the prevailing operational model in high-capital energy exploration. However, governance friction between operators and non-operating venture (NOV) partners frequently stems from ambiguous reporting cadences and retroactive dispute management.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [
              {
                type: "text",
                text: "Establishing Continuous Governance Protocols",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "By establishing standardized quarterly exception reporting and agreed-upon benchmark cost indices, operating committees eliminate multi-year dispute backlogs and build institutional trust across all stakeholders.",
              },
            ],
          },
        ],
      },
      categoryId: jvCatId,
      authorId: edidiongId,
      readingMinutes: 5,
      publishedAt: new Date("2026-09-02"),
      status: "published" as const,
      seoTitle: "Strengthening JV Internal Controls — Finergetics",
      seoDescription:
        "Practical internal control guidelines for joint venture operating committees.",
    },
  ];

  for (const p of postList) {
    await db.insert(posts).values(p).onConflictDoUpdate({
      target: posts.slug,
      set: p,
    });
  }

  // 7. Pages with Section Data
  console.log("⏳ Seeding pages and section schemas...");
  const pageList = [
    {
      key: "home",
      title: "Home",
      seoTitle: "Finergetics Consulting Limited — Risk, Performance & Value",
      seoDescription:
        "Helping businesses control risk, improve performance, and increase value. Independent energy & financial advisory for oil & gas operators, JV partners, and energy investors.",
      sections: [
        {
          type: "hero",
          id: "hero-1",
          enabled: true,
          data: {
            headline: "HELPING BUSINESSES CONTROL RISK, IMPROVE PERFORMANCE,",
            highlightedText: "AND INCREASE VALUE",
            subheadline:
              "We provide independent financial control reviews, commercial economics, fiscal regime advisory, and performance diagnosis for oil & gas operators, JV partners, and energy investors.",
            ctaPrimaryText: "Book an Advisory Discussion",
            ctaPrimaryLink: "/book-a-call",
            ctaSecondaryText: "Our Core Services",
            ctaSecondaryLink: "/services",
            backgroundImage: {
              publicId: "/images/corporate_hero_bg.jpg",
              alt: "Corporate Energy & Financial Advisory Headquarters",
            },
          },
        },
        {
          type: "marquee",
          id: "marquee-1",
          enabled: true,
          data: {
            label: "WHO WE SERVE",
            items: [
              "Oil & Gas Operators",
              "Joint Venture Partners",
              "Oil & Gas Service Companies",
              "Energy Investors",
              "Financial Institutions",
              "Utilities & Regulators",
              "Infrastructure Companies",
              "Government Agencies",
            ],
            speed: 35,
          },
        },
        {
          type: "intro",
          id: "intro-1",
          enabled: true,
          data: {
            eyebrow: "• WHAT WE DO",
            title: "Independent Guidance for",
            highlight: "High-Stakes Energy Decisions",
            narrative:
              "We help organisations strengthen financial controls, optimise commercial decisions, improve operational performance, and manage risk. Our practical, data-driven approach delivers actionable insights that support compliance, profitability, and sustainable growth.",
            bullets: [
              "Independent Reviews & Recommendations",
              "Valuation & Scenario Analysis",
              "Cost Analysis & Fiscal Regime Implications",
              "Operational Insights & Value Drivers",
            ],
          },
        },
        {
          type: "services",
          id: "services-1",
          enabled: true,
          data: {
            eyebrow: "• OUR CORE SERVICES",
            title: "Specialised Financial &",
            highlight: "Commercial Advisory",
            description:
              "Four dedicated advisory disciplines engineered to control risk, optimize commercial decisions, and improve corporate performance.",
          },
        },
        {
          type: "process",
          id: "process-1",
          enabled: true,
          data: {
            eyebrow: "• HOW WE WORK",
            title: "Structured Two-Column",
            highlight: "Engagement Process",
            description:
              "Our battle-tested advisory roadmap delivers rigorous evidence, strategic clarity, and sustainable governance.",
            steps: [
              {
                number: "01",
                title: "Diagnostic & Scoping",
                subtitle: "Financial & Operating Controls Review",
                description:
                  "We begin with rigorous baseline data collection, reviewing existing JV contracts, financial reporting frameworks, and operational governance to isolate exposure areas.",
                deliverables: [
                  "Comprehensive Joint Operating Agreement (JOA) review",
                  "Historical cost billing & allocation audit trail",
                  "Gap analysis of financial control protocols",
                ],
                takeaway:
                  "A definitive diagnostic report establishing verified baselines and audit targets.",
                tone: "royal",
              },
              {
                number: "02",
                title: "Economic Modeling & Scenario Runs",
                subtitle: "Cash Flow & Fiscal Sensitivity",
                description:
                  "We construct custom financial and fiscal regime models, stress-testing commercial decisions against statutory mandates, oil price volatility, and discount curves.",
                deliverables: [
                  "Integrated upstream cash flow sensitivity models",
                  "PSC cost-recovery ceiling optimization",
                  "Tax position and fiscal regime impact screening",
                ],
                takeaway:
                  "Quantified commercial scenarios with defensible IRR, NPV, and cash flow projections.",
                tone: "charcoal",
              },
              {
                number: "03",
                title: "Independent Recommendations",
                subtitle: "Actionable Strategic Roadmap",
                description:
                  "Translating complex forensic analysis into clear, prioritized strategic recommendations with actionable execution plans.",
                deliverables: [
                  "Executive advisory findings pack",
                  "Specific cost-recovery dispute resolution positions",
                  "Operational bottleneck remediation roadmap",
                ],
                takeaway:
                  "Board-ready, evidence-backed strategy designed for decisive leadership execution.",
                tone: "navy",
              },
              {
                number: "04",
                title: "Implementation & Governance Support",
                subtitle: "Sustained Operational Uplift",
                description:
                  "We work shoulder-to-shoulder with management teams and operating committees to embed recommendations into daily workflows.",
                deliverables: [
                  "Updated financial controls policy & SOPs",
                  "Operating Committee briefing & alignment",
                  "Monitoring framework & periodic health checks",
                ],
                takeaway:
                  "Sustainable, repeatable performance governance embedded into your team.",
                tone: "slate",
              },
            ],
          },
        },
        {
          type: "why_us",
          id: "why-us-1",
          enabled: true,
          data: {
            eyebrow: "• WHY CHOOSE US",
            title: "Proven Expertise &",
            highlight: "Institutional Rigor",
            description:
              "Three distinct reasons leading energy operators, JV partners, and investors trust Finergetics with mission-critical financial mandates.",
            pillars: [
              {
                title: "Proven Expertise",
                description:
                  "Over 30 years of specialized leadership in E & P Finance, Joint Venture Management, and complex forensic reviews.",
              },
              {
                title: "Global Experience",
                description:
                  "Advisory track record spanning multiple energy jurisdictions, statutory frameworks, and international financial reporting standards.",
              },
              {
                title: "Tailored Solutions",
                description:
                  "Practical, evidence-backed recommendations directly aligned with local statutory realities and international best practice.",
              },
            ],
          },
        },
        {
          type: "team",
          id: "team-1",
          enabled: true,
          data: {
            eyebrow: "• PRINCIPAL CONSULTANTS",
            title: "Led by Experienced",
            highlight: "Industry Practitioners",
            description:
              "Our principals bring over 30 years of direct banking, oil & gas finance, and joint venture governance leadership.",
          },
        },
        {
          type: "faq",
          id: "faq-1",
          enabled: true,
          data: {
            eyebrow: "• FREQUENTLY ASKED QUESTIONS",
            title: "Common Client",
            highlight: "Inquiries & Details",
            description:
              "Direct answers on how our independent advisory engagements are scoped, executed, and governed.",
            items: [
              {
                question: "What makes Finergetics' advisory independent?",
                answer:
                  "Finergetics is an independent advisory firm with zero commercial affiliations to audit firms, brokers, or operators. Our principal consultants provide unbiased, evidence-backed recommendations directly aligned with institutional shareholder value.",
              },
              {
                question: "How are joint venture financial audits scoped?",
                answer:
                  "Audits begin with an initial scoping review of the Joint Operating Agreement (JOA), followed by rigorous accounting ledger sampling, cost-allocation verifications, and bench-marking against international petroleum industry norms.",
              },
              {
                question:
                  "Can Finergetics work with overseas or multi-jurisdictional assets?",
                answer:
                  "Yes. Our consultants possess over 30 years of global experience across multiple energy jurisdictions, tailoring economic models to both local statutory mandates and international financial reporting standards.",
              },
            ],
          },
        },
        {
          type: "cta",
          id: "cta-1",
          enabled: true,
          data: {
            eyebrow: "DIRECT PRINCIPAL ENGAGEMENT",
            title: "Ready for an Initial Strategic Advisory Discussion?",
            lead: "Connect directly with our Lead Consultants to discuss financial controls, JV governance, or fiscal regime optimization.",
            buttonText: "Book an Advisory Discussion",
            buttonLink: "/book-a-call",
            secondaryText: "Email info@finergetics.com",
            secondaryLink: "mailto:info@finergetics.com",
          },
        },
      ],
      status: "published" as const,
    },
    {
      key: "about",
      title: "About Us",
      seoTitle: "About Us — Finergetics Consulting Limited",
      seoDescription:
        "Learn about Finergetics, our mission, and the experienced team of consultants advising energy and infrastructure leaders.",
      sections: [
        {
          type: "hero",
          id: "about-hero-1",
          enabled: true,
          data: {
            headline: "EXPERIENCED ADVISORY RIGOR IN HIGH-STAKES",
            highlightedText: "ENERGY SECTORS",
            subheadline:
              "Finergetics is an independent advisory firm dedicated to helping oil & gas operators, joint venture partners, and institutional investors control financial risk, optimize commercial structures, and safeguard capital.",
            ctaPrimaryText: "Consult Our Lead Partners",
            ctaPrimaryLink: "/book-a-call",
            ctaSecondaryText: "Our Practice Disciplines",
            ctaSecondaryLink: "/services",
            backgroundImage: {
              publicId: "/images/about_hero_bg.jpg",
              alt: "Finergetics Corporate Advisory Leadership",
            },
          },
        },
        {
          type: "intro",
          id: "about-intro-1",
          enabled: true,
          data: {
            eyebrow: "• FIRM ORIGIN & THESIS",
            title: "Independent Counsel",
            highlight: "Unbiased by Transactional Confines",
            narrative:
              "Founded by senior energy economists and chartered financial controllers with over 30 years of direct petroleum finance oversight, Finergetics delivers unvarnished truth. We operate with zero affiliations to audit brokers or operators, ensuring every recommendation is solely focused on long-term shareholder value and fiduciary compliance.",
            bullets: [
              "Over three decades of direct upstream and joint venture financial leadership",
              "Specialized in deepwater fiscal regimes, PSC cost-recovery, and statutory compliance",
              "Practical, implementable governance roadmaps designed for operating committees",
              "Uncompromising confidentiality and institutional integrity in every engagement",
            ],
          },
        },
        {
          type: "why_us",
          id: "about-why-us-1",
          enabled: true,
          data: {
            eyebrow: "• INSTITUTIONAL TENETS",
            title: "The Principles That Guide",
            highlight: "Every Strategic Engagement",
            description:
              "Our advisory engagements are guided by three foundational tenets that guarantee rigorous empirical defense and boardroom clarity.",
            pillars: [
              {
                title: "Empirical Rigor",
                description:
                  "Every model and recommendation is backed by verifiable historical accounting ledgers, contract terms, and audited petroleum economics.",
              },
              {
                title: "Independent Clarity",
                description:
                  "We provide impartial guidance free of conflicts, giving boards and investors unvarnished visibility into asset exposure.",
              },
              {
                title: "Sustainable Value",
                description:
                  "We do not leave you with theoretical slide decks—we embed operational controls into your ongoing management cadence.",
              },
            ],
          },
        },
        {
          type: "team",
          id: "about-team-1",
          enabled: true,
          data: {
            eyebrow: "• THE FINERGETICS TEAM",
            title: "The Finergetics Team of",
            highlight: "Experienced Consultants",
            description:
              "Meet the senior petroleum economists, chartered accountants, and joint venture advisors leading our practice areas.",
          },
        },
        {
          type: "cta",
          id: "about-cta-1",
          enabled: true,
          data: {
            eyebrow: "ADVISORY ENGAGEMENTS",
            title: "Discuss a Confidential Corporate Mandate",
            lead: "Speak directly with our Lead Consultants regarding joint venture governance, fiscal regime transition, or financial controls.",
            buttonText: "Schedule an Executive Discussion",
            buttonLink: "/book-a-call",
            secondaryText: "Email info@finergetics.com",
            secondaryLink: "mailto:info@finergetics.com",
          },
        },
      ],
      status: "published" as const,
    },
    {
      key: "services",
      title: "Our Services",
      seoTitle: "Advisory Services — Finergetics Consulting Limited",
      seoDescription:
        "Explore our 4 core advisory disciplines: financial control, commercial economics, fiscal regimes, and performance improvement.",
      sections: [
        {
          type: "hero",
          id: "services-hero-1",
          enabled: true,
          data: {
            headline: "FOUR CORE ADVISORY DISCIPLINES",
            highlightedText: "ENGINEERED FOR VALUE",
            subheadline:
              "From joint venture audit resolution and financial control frameworks to deepwater fiscal regime modeling and operational performance optimization.",
            ctaPrimaryText: "Book an Advisory Discussion",
            ctaPrimaryLink: "/book-a-call",
            ctaSecondaryText: "Advisory Methodology",
            ctaSecondaryLink: "#methodology",
          },
        },
        {
          type: "services",
          id: "services-list-1",
          enabled: true,
          data: {
            eyebrow: "• OUR PRACTICE DISCIPLINES",
            title: "Specialised Financial &",
            highlight: "Commercial Advisory",
            description:
              "Four dedicated practices engineered to control risk, optimize commercial decisions, and improve corporate performance.",
          },
        },
        {
          type: "process",
          id: "services-process-1",
          enabled: true,
          data: {
            eyebrow: "• HOW ENGAGEMENTS ARE STRUCTURED",
            title: "Structured Two-Column",
            highlight: "Engagement Process",
            description:
              "Our battle-tested advisory roadmap delivers rigorous evidence, strategic clarity, and sustainable governance.",
            steps: [
              {
                number: "01",
                title: "Diagnostic & Scoping",
                subtitle: "Financial & Operating Controls Review",
                description:
                  "We begin with rigorous baseline data collection, reviewing existing JV contracts, financial reporting frameworks, and operational governance to isolate exposure areas.",
                deliverables: [
                  "Comprehensive Joint Operating Agreement (JOA) review",
                  "Historical cost billing & allocation audit trail",
                  "Gap analysis of financial control protocols",
                ],
                takeaway:
                  "A definitive diagnostic report establishing verified baselines and audit targets.",
                tone: "royal",
              },
              {
                number: "02",
                title: "Economic Modeling & Scenario Runs",
                subtitle: "Cash Flow & Fiscal Sensitivity",
                description:
                  "We construct custom financial and fiscal regime models, stress-testing commercial decisions against statutory mandates, oil price volatility, and discount curves.",
                deliverables: [
                  "Integrated upstream cash flow sensitivity models",
                  "PSC cost-recovery ceiling optimization",
                  "Tax position and fiscal regime impact screening",
                ],
                takeaway:
                  "Quantified commercial scenarios with defensible IRR, NPV, and cash flow projections.",
                tone: "charcoal",
              },
              {
                number: "03",
                title: "Independent Recommendations",
                subtitle: "Actionable Strategic Roadmap",
                description:
                  "Translating complex forensic analysis into clear, prioritized strategic recommendations with actionable execution plans.",
                deliverables: [
                  "Executive advisory findings pack",
                  "Specific cost-recovery dispute resolution positions",
                  "Operational bottleneck remediation roadmap",
                ],
                takeaway:
                  "Board-ready, evidence-backed strategy designed for decisive leadership execution.",
                tone: "navy",
              },
              {
                number: "04",
                title: "Implementation & Governance Support",
                subtitle: "Sustained Operational Uplift",
                description:
                  "We work shoulder-to-shoulder with management teams and operating committees to embed recommendations into daily workflows.",
                deliverables: [
                  "Updated financial controls policy & SOPs",
                  "Operating Committee briefing & alignment",
                  "Monitoring framework & periodic health checks",
                ],
                takeaway:
                  "Sustainable, repeatable performance governance embedded into your team.",
                tone: "slate",
              },
            ],
          },
        },
        {
          type: "faq",
          id: "services-faq-1",
          enabled: true,
          data: {
            eyebrow: "• ADVISORY SCOPE FAQ",
            title: "Frequently Asked Questions",
            highlight: "On Engagement Logistics",
            description:
              "Clear answers on how we scope, contract, and execute independent advisory mandates.",
            items: [
              {
                question:
                  "Can Finergetics support non-operated joint venture (NOV) audits?",
                answer:
                  "Yes. NOV financial oversight is one of our primary core specializations. We represent non-operators in joint venture audit reviews, verifying billing debits against Joint Operating Agreements and securing multi-million dollar reconciliations.",
              },
              {
                question: "How long does a typical advisory review take?",
                answer:
                  "Diagnostic reviews typically conclude within 3 to 6 weeks depending on data availability. Deep fiscal modeling and joint venture renegotiation mandates run across customized milestones tailored to client transaction timelines.",
              },
              {
                question:
                  "Do you advise on the Nigerian Petroleum Industry Act (PIA)?",
                answer:
                  "Yes. Our lead consultants have modeled upstream concession conversions, host community development trusts, and hydrocarbon tax implications under the PIA across onshore, shallow water, and deepwater assets.",
              },
            ],
          },
        },
        {
          type: "cta",
          id: "services-cta-1",
          enabled: true,
          data: {
            eyebrow: "REQUEST AN ADVISORY DISCUSSION",
            title: "Ready to Explore How We Can Protect Your Asset?",
            lead: "Schedule a confidential session with our Lead Consultants to review your joint venture or financial control needs.",
            buttonText: "Book an Advisory Discussion",
            buttonLink: "/book-a-call",
            secondaryText: "Email Advisory Desk",
            secondaryLink: "mailto:info@finergetics.com",
          },
        },
      ],
      status: "published" as const,
    },
    {
      key: "case-studies",
      title: "Case Studies",
      seoTitle: "Case Studies & Track Record — Finergetics Consulting Limited",
      seoDescription:
        "Proven engagements in JV audit reconciliation, fiscal regime economic modeling, and financial risk control.",
      sections: [
        {
          type: "hero",
          id: "cs-hero-1",
          enabled: true,
          data: {
            headline: "MEASURABLE OUTCOMES IN",
            highlightedText: "HIGH-CAPITAL ENERGY ASSETS",
            subheadline:
              "Explore how Finergetics has resolved complex joint venture expenditure disputes, stress-tested multi-billion-dollar fiscal regimes, and restored capital discipline.",
            ctaPrimaryText: "Discuss Your Scenario",
            ctaPrimaryLink: "/book-a-call",
          },
        },
        {
          type: "cta",
          id: "cs-cta-1",
          enabled: true,
          data: {
            eyebrow: "CONFIDENTIAL CONSULTATION",
            title: "Facing a Similar Commercial or JV Challenge?",
            lead: "Our Lead Consultants provide prompt, confidential advisory reviews to assess dispute exposure or valuation scenarios.",
            buttonText: "Schedule a Consultation",
            buttonLink: "/book-a-call",
            secondaryText: "Email info@finergetics.com",
            secondaryLink: "mailto:info@finergetics.com",
          },
        },
      ],
      status: "published" as const,
    },
    {
      key: "blog",
      title: "Latest Insights",
      seoTitle: "Energy & Financial Insights — Finergetics Consulting Limited",
      seoDescription:
        "Thought leadership, petroleum fiscal regime analysis, and joint venture governance perspectives from our Lead Consultants.",
      sections: [
        {
          type: "hero",
          id: "blog-hero-1",
          enabled: true,
          data: {
            headline: "EXECUTIVE PERSPECTIVES ON",
            highlightedText: "PETROLEUM ECONOMICS & GOVERNANCE",
            subheadline:
              "Authoritative analysis on petroleum fiscal regimes, joint venture accounting, upstream cost recovery, and corporate capital discipline.",
            ctaPrimaryText: "Consult Our Authors",
            ctaPrimaryLink: "/book-a-call",
            backgroundImage: {
              publicId: "/images/insights_hero_bg.jpg",
              alt: "Finergetics Energy Economics & Insights Intelligence",
            },
          },
        },
        {
          type: "cta",
          id: "blog-cta-1",
          enabled: true,
          data: {
            eyebrow: "DIRECT CONSULTATION",
            title: "Have a Question on Energy Governance or Fiscal Economics?",
            lead: "Connect directly with Rotimi Lawuyi and Edidiong Eyoma for confidential discussions on sector implications.",
            buttonText: "Book an Advisory Discussion",
            buttonLink: "/book-a-call",
          },
        },
      ],
      status: "published" as const,
    },
    {
      key: "contact",
      title: "Book an Advisory Discussion",
      seoTitle: "Book an Advisory Discussion — Finergetics Consulting Limited",
      seoDescription:
        "Schedule an executive consultation with Finergetics Advisory Partners. Independent advisory for oil & gas operators, JV partners, energy investors, and infrastructure institutions.",
      sections: [
        {
          type: "hero",
          id: "contact-hero-1",
          enabled: true,
          data: {
            headline: "LET'S DISCUSS YOUR COMMERCIAL & FISCAL OBJECTIVES",
            highlightedText: "CONFIDENTIAL ADVISORY",
            subheadline:
              "Connect directly with our senior energy economists and financial controllers. Whether navigating joint venture audits, PIA fiscal transitions, or asset valuations, we deliver independent clarity.",
            ctaPrimaryText: "Schedule a Session",
            ctaPrimaryLink: "#consultation-form",
            ctaSecondaryText: "Email Advisory Desk",
            ctaSecondaryLink: "mailto:info@finergetics.com",
          },
        },
        {
          type: "faq",
          id: "contact-faq-1",
          enabled: true,
          data: {
            title: "Frequently Asked Questions",
            highlight: "On Advisory Consultations",
            description:
              "Answers to common questions regarding confidential scoping, partner availability, and engagement logistics.",
            items: [
              {
                question: "Who leads the initial advisory discussion?",
                answer:
                  "Every consultation is conducted directly by our Principal Consultants (Rotimi Lawuyi or Edidiong Eyoma) rather than junior account managers, ensuring immediate technical depth and commercial authority.",
              },
              {
                question:
                  "Are preliminary discussions governed by confidentiality?",
                answer:
                  "Yes. All preliminary briefings and technical inquiries are governed by strict institutional non-disclosure covenants and professional fiduciary privilege.",
              },
              {
                question: "How quickly can Finergetics mobilize on a mandate?",
                answer:
                  "Diagnostic reviews and dispute analysis can typically be mobilized within 5 to 7 business days following execution of engagement terms.",
              },
            ],
          },
        },
      ],
      status: "published" as const,
    },
    {
      key: "privacy",
      title: "Privacy Policy",
      seoTitle: "Privacy Policy — Finergetics Consulting Limited",
      seoDescription:
        "Finergetics Consulting Limited privacy policy and data governance commitments.",
      sections: [
        {
          type: "hero",
          id: "privacy-hero-1",
          enabled: true,
          data: {
            headline: "PRIVACY POLICY &",
            highlightedText: "DATA GOVERNANCE",
            subheadline:
              "Finergetics Consulting Limited is committed to the highest standards of confidentiality, client privacy, and strict data governance.",
          },
        },
      ],
      status: "published" as const,
    },
    {
      key: "terms",
      title: "Terms of Engagement",
      seoTitle: "Terms of Engagement — Finergetics Consulting Limited",
      seoDescription:
        "Terms and conditions governing advisory engagements with Finergetics Consulting Limited.",
      sections: [
        {
          type: "hero",
          id: "terms-hero-1",
          enabled: true,
          data: {
            headline: "TERMS OF ADVISORY",
            highlightedText: "ENGAGEMENT",
            subheadline:
              "Standard terms, fiduciary duties, and confidentiality covenants governing professional engagements with Finergetics Consulting Limited.",
          },
        },
      ],
      status: "published" as const,
    },
  ];

  for (const p of pageList) {
    await db.insert(pages).values(p).onConflictDoUpdate({
      target: pages.key,
      set: p,
    });
  }

  console.log("✅ Finergetics database seeding completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Fatal error during database seed:", err);
    process.exit(1);
  });
