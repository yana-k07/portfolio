// One entry per case. Cover images live in src/assets (same file names to swap them).
// `cardCover` is optional: a separate crop for the home page card; without it the card uses `cover`.
import organizerHero from "../assets/organizer/hero.webp";
import organizerPhoneBefore from "../assets/organizer/phone-before.webp";
import organizerPhoneJourney from "../assets/organizer/phone-journey.webp";
import organizerPhoneOptions from "../assets/organizer/phone-options.webp";
import organizerPhoneFinal from "../assets/organizer/phone-final.webp";
import organizerCaMapping from "../assets/organizer/ca-mapping.webp";
import organizerCaOptions from "../assets/organizer/ca-options.webp";
import organizerCaHint from "../assets/organizer/ca-hint.webp";
import organizerCaError from "../assets/organizer/ca-error.webp";
import organizerCaPreview from "../assets/organizer/ca-preview.webp";
import quorsoAtomic from "../assets/quorso/atomic-text-input.webp";
import quorsoTokensBase from "../assets/quorso/tokens-base.webp";
import quorsoTokensSemantic from "../assets/quorso/tokens-semantic.webp";
import tradezellaReports from "../assets/tradezella/reports.webp";
import tradezellaCompareBefore from "../assets/tradezella/compare-before.webp";
import tradezellaCompareAfter from "../assets/tradezella/compare-after.webp";
import tradezellaMobileHeader from "../assets/tradezella/mobile-header.webp";
import tradezellaMobileBody from "../assets/tradezella/mobile-body.webp";
import tradezellaMetricsMp4 from "../assets/tradezella/metrics.mp4";
import tradezellaMetricsWebm from "../assets/tradezella/metrics.webm";
import tradezellaMetricsPoster from "../assets/tradezella/metrics-poster.webp";
import tradezellaDiffMp4 from "../assets/tradezella/compare-summary.mp4";
import tradezellaDiffWebm from "../assets/tradezella/compare-summary.webm";
import tradezellaDiffPoster from "../assets/tradezella/compare-summary-poster.webp";
import tradezellaBeforeOverview from "../assets/tradezella/before-overview.webp";
import tradezellaBeforeReport from "../assets/tradezella/before-report.webp";
import yetloCover from "../assets/yetlo/cover.webp";
import yetloCardCover from "../assets/yetlo/cover-card.webp";
import yetloFlows from "../assets/yetlo/send-flows.webp";
import yetloMobileAnnotated from "../assets/yetlo/mobile-transfer-annotated.webp";
import yetloMobileDark from "../assets/yetlo/mobile-transfer-dark.webp";
import yetloWebAnnotated from "../assets/yetlo/web-transfer-annotated.webp";
import yetloWebHome from "../assets/yetlo/web-home.webp";
import yetloRegCompany from "../assets/yetlo/business-registration-company.webp";
import yetloRegPersonal from "../assets/yetlo/business-registration-personal.webp";
import yetloDashboardDark from "../assets/yetlo/business-dashboard-dark.webp";

// Chapter text below is draft copy: replace it with your own (or pull it from Notion).
//
// Each chapter holds blocks. Available block types:
//   { type: "p", text: "Text with **bold** key phrases." }
//   { type: "h3", text: "Sub-heading inside a chapter" }
//   { type: "image", src: importedImage, caption: "Caption under the image.", big: false }  // click to enlarge
//   { type: "video", src: mp4, webm: webmOptional, poster: still, caption: "..." }   // silent looping screen recording
//   { type: "phone", header: fixedTopPart, body: scrollingPart, caption: "..." }   // phone that scrolls a tall screenshot by itself
//   { type: "list", items: ["**Lead-in:** detail", "..."], ordered: false }
//   { type: "stats", caption: "optional source line", items: [{ value: "250k", label: "Subscribers", note: "optional second line" }, ...] }   // only with real numbers
//   { type: "quote", text: "...", author: "Name", role: "Role, Company" }

const draft = (hint) => `Draft: ${hint}`;

// Two shapes of case:
// Every case ends with an Impact chapter.
// - One story (Tradezella): Context, Problem, Approach, Solution, Impact.
// - Several tasks (Yetlo): Context, then one chapter per task with h3 Challenge / Approach / Solution, then Impact.

export const projects = [
  {
    slug: "tradezella",
    title: "Tradezella — Redesigning 50+ trading reports",
    cardTitle: "Tradezella",
    blurb: "A trading journal and analytics platform for traders.",
    summary:
      "A trading journal and analytics platform for traders. I redesigned its reports to make the data clearer and more personal, which lifted report views by 15%.",
    link: { label: "tradezella.com", url: "https://www.tradezella.com/" },
    // Shown as cards at the top instead of the Focus / Timeline / Platform cards (only this case has results)
    results: [
      { label: "Total report views", value: "15.38%" },
      { label: "Avg. engagement time across all reports", value: "10.56%", note: "From 4m 34s to 5m 03s" },
      { label: "Views per active user", value: "8.62%" },
    ],
    cover: tradezellaReports, // home page card
    // Case page: a before/after slider instead of the cover image (both images are 16:10)
    compare: {
      before: tradezellaCompareBefore,
      after: tradezellaCompareAfter,
      beforeAlt: "The Reports overview before the redesign: a long table of raw stats",
      afterAlt: "The Reports overview after the redesign: charts with selectable metrics and a summary",
      caption: "Drag to compare the Reports overview before and after the redesign.",
    },
    chapters: [
      {
        id: "context",
        title: "Context",
        blocks: [
          { type: "p", text: "TradeZella is a **trading journal and analytics platform** designed to help traders of all levels improve their performance through data-driven insights. The platform serves thousands of active traders worldwide, from beginners learning market fundamentals to **professional traders managing multiple accounts**." },
          { type: "stats", caption: "Public figures from tradezella.com, Instagram and Discord.", items: [
            { value: "100K+", label: "Traders using the platform" },
            { value: "130K+", label: "Instagram followers", note: "@tradezella" },
            { value: "27K+", label: "Discord community members" },
          ] },
        ],
      },
      {
        id: "problem",
        title: "Problem",
        blocks: [
          { type: "p", text: "Traders were **not meaningfully engaging with performance data**. Key issues included:" },
          { type: "list", items: ["Overwhelming interfaces with too many raw metrics", "Lack of actionable insight hierarchy", "No guidance on which reports to use when", "Poor mobile accessibility"] },
          { type: "p", text: "Analytics confirmed low engagement:" },
          { type: "list", items: ["Average time on report pages: **4m 34s**", "Return visit rate for reports: **below 30%**", "User feedback indicated confusion about how to extract insights"] },
          { type: "image", src: tradezellaBeforeOverview, caption: "Before: the Overview page, with all stats in two long tables of raw numbers." },
          { type: "image", src: tradezellaBeforeReport, caption: "Before: a single report (days till expiration), with two bar charts and a summary table." },
        ],
      },
      {
        id: "approach",
        title: "Approach",
        blocks: [
          { type: "h3", text: "Discovery" },
          { type: "list", items: [
            "**Stakeholder interviews** to align on KPIs and retention goals",
            "**User interviews** (5) with active and inactive traders across different experience levels, to understand their needs and frustrations",
            "**Heuristic audit** of current report flows",
            "**Competitor analysis:** Tradervue, Tradersync, Edgewonk, FxReplay",
            "**Quantitative analysis** via GA4 (Pages & Screens report)",
          ] },
          { type: "p", text: "A few clear themes emerged from the interviews:" },
          { type: "list", items: [
            "Reports were seen as either **too data-heavy** or **not actionable enough**",
            "Traders found the **visual hierarchy confusing**, especially on mobile",
            "Performance-focused users wanted **faster insight into strategy-level outcomes**, not just trades",
            "**Professional traders** (20%) needed advanced customization and comparison tools",
          ] },
          { type: "p", text: "These conversations reshaped our thinking around how reports should be structured, how filters and summaries should work, and what types of feedback loops traders needed. We weren’t just aiming to reformat charts. We wanted to **eliminate unnecessary friction and surface clarity**." },
          { type: "h3", text: "Definition" },
          { type: "p", text: "We worked in focused, **weekly sprints**, shipping usable builds fast and refining based on real trader feedback. As the sole designer, I constantly moved between Figma iterations, product discussions, and dev-ready handoffs." },
          { type: "p", text: "Based on usage data and interview feedback, we started by launching the **first 2 core reports** (Performance, Day and time) to validate layout clarity and user value. Since the structure proved successful, we **reused the visual and interaction patterns** across the rest of the reporting suite." },
        ],
      },
      {
        id: "solution",
        title: "Solution",
        blocks: [
          { type: "h3", text: "Performance dashboard" },
          { type: "p", text: "I redesigned the **Performance report dashboard** to show Net P&L, Win Rate, and Trade Count trends side by side, making patterns instantly visible across trading sessions. A **flexible metric selector** lets users choose from a wide range of performance indicators and customize how data is charted." },
          { type: "video", src: tradezellaMetricsMp4, webm: tradezellaMetricsWebm, poster: tradezellaMetricsPoster, caption: "Configuring a chart: search any metric in a grouped list, then choose how it is drawn (line, area or column) and its colour." },
          { type: "h3", text: "Personalization" },
          { type: "p", text: "A **guided onboarding** learns user preferences, and a **personalized widget system** shows the most relevant reports first, so traders no longer have to guess which of the 50+ reports to open." },
          { type: "h3", text: "Making data actionable" },
          { type: "p", text: "I introduced **microcopy** for tooltips and insight banners. A **dynamic comparison layer** inside each report helps traders instantly understand **what’s changing, and why it matters**. **Cross-analysis** compares performance across different timeframes, strategies, and market conditions." },
          { type: "video", src: tradezellaDiffMp4, webm: tradezellaDiffWebm, poster: tradezellaDiffPoster, caption: "The comparison layer in the Summary: every metric shows how it changed against another period, tooltips explain the metric and name the period, and “Show difference” turns the changes on or off." },
          { type: "h3", text: "Mobile" },
          { type: "p", text: "I built **mobile wireframes** and tested them in responsive previews, to fix the confusing hierarchy traders reported on small screens." },
          { type: "phone", header: tradezellaMobileHeader, body: tradezellaMobileBody, caption: "Mobile Reports: the Performance chart and the Summary rebuilt for a narrow screen, with the change shown under each metric." },
        ],
      },
      {
        id: "impact",
        title: "Impact",
        blocks: [
          { type: "p", text: "After Reports 2.0 (Q1 2025), total report views grew by **15.38%**. Traders also stayed longer, with average engagement time across all reports up **10.56%** to 5m 03s, and opened more reports each, with views per active user up **8.62%**." },
        ],
      },
    ],
  },
  {
    slug: "yetlo",
    title: "Yetlo — Designing scalable money transfer flows",
    cardTitle: "Yetlo",
    blurb: "A fintech app for low-commission money transfers across Europe.",
    summary:
      "A fintech app for low-commission transfers across European countries, spanning personal and business accounts on iOS, Android, and web.",
    link: null,
    meta: [
      { label: "Focus", value: "Money transfers & business onboarding" },
      { label: "Industry", value: "Fintech" },
      { label: "Platform", value: "iOS, Android, web" },
    ],
    cover: yetloCover, // full mockup, shown on the case page
    cardCover: yetloCardCover, // zoomed crop, shown on the home page card
    chapters: [
      {
        id: "context",
        title: "Context",
        blocks: [
          { type: "p", text: "Yetlo lets users **transfer money across European countries** with low commission and favorable exchange rates. The product covers both **personal and business accounts**, managed through mobile apps and a web platform, with euro and dollar cards planned for a later phase." },
          { type: "p", text: "As the **sole designer**, I worked end-to-end across every surface — iOS, Android, web app, admin panel, email templates, the marketing site, and dark theme adaptation for all platforms." },
        ],
      },
      {
        id: "send-money",
        title: "Task 1: Send money",
        blocks: [
          { type: "h3", text: "Challenge" },
          { type: "p", text: "The core challenge was making transfers between accounts feel effortless — letting users pick accounts, see balances and account descriptions, and choose the right transfer method. Critically, this had to be built as a **reusable module**: the same solution needed to work for business users sending SEPA transfers and Yetlo-link payments." },
          { type: "h3", text: "Approach" },
          { type: "p", text: "We identified **four sending methods**:" },
          { type: "list", ordered: true, items: ["SEPA transfer", "Transfer between your own wallets", "Transfer to a Yetlo user by email", "Transfer to a Yetlo user via Yetlo link"] },
          { type: "image", src: yetloFlows, big: true, caption: "Send flows, from the account page through each sending method to the success screen. Click to enlarge." },
          { type: "h3", text: "Solution" },
          { type: "p", text: "The solution centered on a **flexible transfer module** handling multiple user types (personal and business) and multiple methods — designed for reusability, scalability, and compliance with the different requirements of each transfer type." },
          { type: "image", src: yetloMobileAnnotated, caption: "Mobile transfer screen: account selector, entering the full amount in one tap, account description, transfer time and exchange rates." },
          { type: "image", src: yetloMobileDark, caption: "Dark theme: a transfer between currencies, and the error state when the balance is too low." },
          { type: "p", text: "To keep the experience consistent across devices, I brought the **same functionality to web** — where business users, who rely on web access for complex transactions like SEPA, could transfer funds, view balances, and manage accounts seamlessly." },
          { type: "image", src: yetloWebAnnotated, caption: "The same module on web, with transfer time and fee shown before confirming." },
          { type: "image", src: yetloWebHome, caption: "Web app home: accounts, cards, balances and transactions." },
        ],
      },
      {
        id: "business-registration",
        title: "Task 2: Business registration",
        blocks: [
          { type: "p", text: "Yetlo Business is a part of the Yetlo project that specializes in business accounts. Companies can create **multi-currency accounts**, add employees to an account with specific roles or customize permissions for them." },
          { type: "h3", text: "Challenge" },
          { type: "p", text: draft("what a company needs to get through to sign up: a **multi-step registration** with edge cases, and **team management** with roles and custom permissions.") },
          { type: "h3", text: "Approach" },
          { type: "p", text: "My responsibilities:" },
          { type: "list", items: ["Modifying the current implementation of the **admin panel** to fit the new requirements.", "Generating ideas and concepts for **new products or features** based on user research and business requirements."] },
          { type: "p", text: draft("**interviews** with businesses on how they organise access to financial data, **competitor analysis** (Wise, Revolut), and work with **compliance** on business and client verification.") },
          { type: "h3", text: "Solution" },
          { type: "p", text: "I split registration into **distinct steps** rather than one long form." },
          { type: "p", text: "Step one collects the company — name, registration number, country of registration. Step two collects the person. Splitting it this way wasn’t cosmetic: it let us **check the database** for an existing company registration number and an existing user before either party got deep into the process, so duplicates and half-finished registrations surface early instead of at submission." },
          { type: "image", src: yetloRegCompany, caption: "Step one: company information." },
          { type: "image", src: yetloRegPersonal, caption: "Step two: personal details of the person registering." },
          { type: "image", src: yetloDashboardDark, caption: "Business web app in dark theme: the first-run state of a new account." },
        ],
      },
      {
        id: "impact",
        title: "Impact",
        blocks: [
          { type: "p", text: "Designing within an inherited codebase meant balancing ambition with constraint on every screen. The through-line was **building for reuse** — every flow I shipped for personal users was structured to extend cleanly to business accounts, which kept the system coherent as scope grew across multiple transfer methods and platforms. Working as the sole designer across web, mobile, and admin also taught me to make decisions that hold up without a team to catch gaps." },
        ],
      },
    ],
  },
  {
    slug: "organizer",
    title: "Organizer — Designing phone banking and data import for campaign teams",
    cardTitle: "Organizer",
    blurb: "A data and mobilization platform for nonprofits and campaigns.",
    summary:
      "A people-centric data and mobilization platform for nonprofit and campaign teams. I designed its phone banking session page and a safer way to create custom attributes during data import.",
    link: { label: "murmuration.org", url: "https://murmuration.org/organizer-by-murmuration" },
    meta: [
      { label: "Focus", value: "Phone banking & data import" },
      { label: "Industry", value: "Civic tech" },
      { label: "Platform", value: "Web & mobile" },
    ],
    cover: organizerHero,
    coverNatural: true, // the hero is wider than 16:10, so show it uncropped on the case page
    cardCover: organizerPhoneFinal,
    chapters: [
      {
        id: "context",
        title: "Context",
        blocks: [
          { type: "p", text: "Organizer by Murmuration is a **people-centric data platform** with built-in mobilization and engagement tools. Nonprofit and campaign teams use it to understand their audience and reach it, with analytics, data management and a fully integrated CRM in one place instead of data scattered across separate tools." },
          { type: "p", text: "In 2023 I worked on two features with a design lead, a project manager and developers: **phone banking** and **custom attributes in data import**." },
        ],
      },
      {
        id: "phone-banking",
        title: "Task 1: Phone banking",
        blocks: [
          { type: "h3", text: "Challenge" },
          { type: "p", text: "Phone banking existed on the platform only as a rough sketch. The goal was to turn it into a working tool: volunteers **call from the platform or from their own number**, **fill in a survey during the call**, and teams get **call analytics**. The most important piece was the **session page**, the screen a volunteer works in for the whole call." },
          { type: "image", src: organizerPhoneBefore, caption: "Before: the rough session page that already existed on the platform." },
          { type: "h3", text: "Approach" },
          { type: "p", text: "I started by **defining the product**. Kick-off meetings with the product manager, Head of UX, VP of Product, design lead and a frontend engineer gave me the requirements and constraints. We chose the **volunteers who make the calls** as the main users and mapped their journey." },
          { type: "image", src: organizerPhoneJourney, caption: "The volunteer’s journey through a phone bank session." },
          { type: "p", text: "Next came **research**: a detailed competitor analysis, with HubDialer as the main reference." },
          { type: "p", text: "The session page has many dependencies. What it shows depends on the call result selected, on whether the form is filled in and on which buttons are active. I collected every case in **Confluence** and walked through the possible scenarios with the developers, so design and engineering agreed on the rules before the screens were final." },
          { type: "p", text: "In the design phase I built prototypes for the first team presentation, using the existing design system, navigation and layout, since this was already a working product. I also made **clickable prototypes for the six main scenarios**, to test with users." },
          { type: "image", src: organizerPhoneOptions, caption: "Two layout options for the session page, each with the states of a call." },
          { type: "h3", text: "Solution" },
          { type: "p", text: "We chose this layout to test:" },
          { type: "list", items: [
            "**Breadcrumbs, name and description** of the effort at the top, so the volunteer always knows where they are and how to leave.",
            "**Call area on the left:** the call button and information about the person being called.",
            "**Instructions and survey form in the centre.** The instructions collapse and expand, as they can be long.",
            "**Call result and actions:** Skip, or Submit and next. Until the call has started, the volunteer cannot move on to the next contact.",
            "**Footer** with statistics for the volunteer and for the whole effort, and the End session button.",
          ] },
          { type: "image", src: organizerPhoneFinal, caption: "The session page layout chosen for testing." },
        ],
      },
      {
        id: "custom-attributes",
        title: "Task 2: Custom attributes",
        blocks: [
          { type: "h3", text: "Challenge" },
          { type: "p", text: "When importing data, users can turn a column of their file into a **custom attribute** with single or multiple choice values. Without guardrails, one column could produce almost endless options, which would hurt performance and make the CRM harder to use." },
          { type: "image", src: organizerCaMapping, caption: "The mapping step of the import, where columns become attributes." },
          { type: "h3", text: "Approach" },
          { type: "p", text: "I defined the task with the product managers and stakeholders, and we laid out **four possible approaches**:" },
          { type: "list", ordered: true, items: [
            "No limit: users get as many options as the file contains.",
            "Users add the options manually while creating the attribute.",
            "No support for radio or checkbox custom attributes.",
            "A validation step when the user chooses a radio or checkbox data type.",
          ] },
          { type: "image", src: organizerCaOptions, caption: "The four options with their pros and cons." },
          { type: "p", text: "We chose the fourth. It keeps mapping and validating separate and scales well, even though it takes more effort to build." },
          { type: "p", text: "With the engineers I wrote a **user story** showing how the user and the system interact, and we reviewed it with the team. There we agreed on a limit of **50 values**. After a competitor analysis I moved on to prototyping." },
          { type: "h3", text: "Solution" },
          { type: "p", text: "The design makes the limit visible at every step:" },
          { type: "list", items: [
            "**A hint** under the data type says that single- and multi-select attributes are limited to 50 unique values, and an **Inspect** step checks the column.",
            "**A clear error** appears if the limit is exceeded, and it says what to do: change the data type or exclude the column.",
            "**A preview** shows what will be created: a counter of new attributes in the footer, a “new” tag in the preview table, and a “Custom Attributes to be Created” section with cards showing each attribute’s name, data type, category and description.",
          ] },
          { type: "image", src: organizerCaHint, caption: "Choosing a data type: the hint about the limit, and the Inspect step." },
          { type: "image", src: organizerCaError, caption: "When a column has more than 50 unique values, the error explains how to continue." },
          { type: "image", src: organizerCaPreview, caption: "The import preview lists the attributes that will be created." },
        ],
      },
      {
        id: "impact",
        title: "Impact",
        blocks: [
          { type: "p", text: "The phone banking session page covers every state of a call (not started, answered, or ended with another result; form filled in or empty) in six documented scenarios. Product, design and engineering worked from the same rules in Confluence, and the clickable prototypes were ready for testing with volunteers." },
          { type: "p", text: "For custom attributes, the design sets a clear guardrail: the 50-value limit is explained before the user maps a column, an error says what to change when it is exceeded, and the preview shows exactly which attributes will be created." },
        ],
      },
    ],
  },
  {
    slug: "quorso-design-system",
    title: "Quorso — Bringing order to a design system",
    cardTitle: "Quorso: Design system",
    blurb: "One consistent design system for two interfaces and older screens.",
    summary:
      "Quorso runs two interfaces on one system, with many older screens built on third-party libraries. I brought them together into one consistent design system, QUI.",
    link: null,
    meta: [
      { label: "Focus", value: "Design system (QUI)" },
      { label: "Industry", value: "To be added" },
      { label: "Platform", value: "To be added" },
    ],
    // No cover image yet: add `cover` (and optionally `cardCover` or `compare`) when the visuals are ready.
    chapters: [
      {
        id: "context",
        title: "Context",
        blocks: [
          { type: "p", text: "Quorso has **two interfaces in one system**, along with many older screens built on **third-party libraries**. Over time this led to **inconsistency** across the product." },
          { type: "p", text: "I took on the task of **bringing everything to order**, in four steps: a component audit, tokens, structuring the components, and patterns." },
        ],
      },
      {
        id: "problem",
        title: "Problem",
        blocks: [
          { type: "p", text: draft("what the inconsistency looked like in practice: how many versions of the same component existed, which third-party libraries were involved, and what it cost the team.") },
        ],
      },
      {
        id: "approach",
        title: "Approach",
        blocks: [
          { type: "h3", text: "1. Component audit" },
          { type: "p", text: "I started with the components. The audit cleaned up what existed so that every screen could use our **QUI system** and stay **consistent** with the rest." },
          { type: "p", text: draft("how you ran the audit and what you found: number of components, duplicates, which screens used which library.") },
          { type: "p", text: "The audit also covered the **colour palette**, and it showed that many colours were **outdated**. That made tokens the logical next step." },
          { type: "h3", text: "2. Tokens" },
          { type: "p", text: "Next, I introduced **colour tokens** in two layers. A **Base** collection holds 49 primitive colours: a mono scale from 0 to 1000, brand colours, red, amber, green, purple and blue, and a set of data colours." },
          { type: "image", src: quorsoTokensBase, caption: "Base collection: 49 primitive colours, here the mono scale from 0 to 1000." },
          { type: "p", text: "On top of it, 52 **semantic tokens** describe where a colour is used: background, border, button, navigation, text, status and icon. Each one points to a base colour for both the **dark and light** themes, and the names follow one pattern, such as status-error-bold-bg: group, meaning, strength and property." },
          { type: "image", src: quorsoTokensSemantic, caption: "Semantic tokens: each status token points to a base colour in dark and light mode." },
          { type: "h3", text: "3. Structuring components" },
          { type: "p", text: "Then I **structured the components** following **atomic design**. The smallest parts, such as text, the cursor, icons and prefix and suffix slots, are atoms. They combine into components like the text input, so a change in one place carries through everywhere that part is used." },
          { type: "p", text: "The text input shows the idea: one component with **7 state variants** and properties for the placeholder, prefix, suffix, text, error text and cursor, instead of separate versions for each case." },
          { type: "image", src: quorsoAtomic, caption: "Atomic design in practice: small parts build the text input, one component with 7 states." },
          { type: "h3", text: "4. Patterns" },
          { type: "p", text: "Finally, I moved on to **patterns**." },
          { type: "p", text: draft("which patterns (forms, tables, filters…) and how they are used across both interfaces.") },
        ],
      },
      {
        id: "impact",
        title: "Impact",
        blocks: [
          { type: "p", text: draft("what changed, with real numbers if you have them: fewer component versions, faster screen design, fewer inconsistencies, share of screens moved to QUI.") },
        ],
      },
    ],
  },
];


// Password-protected case: shown on the home page but not linked to a page.
export const lockedProjects = [
  {
    slug: "quorso-insights",
    title: "Quorso — Insights",
    cardTitle: "Quorso: Insights",
    summary: "An insights feature. Available on request.",
    blurb: "An insights feature. Available on request.",
  },
];

// The cards on the home page, in this order. kind: "case" has a page, "locked" is on request, "soon" has no page yet.
export const homeProjects = [
  { kind: "case", ...projects.find((p) => p.slug === "tradezella") },
  { kind: "case", ...projects.find((p) => p.slug === "yetlo") },
  { kind: "case", ...projects.find((p) => p.slug === "organizer") },
  { kind: "case", ...projects.find((p) => p.slug === "quorso-design-system") },
  { kind: "locked", ...lockedProjects[0] },
];

export const findLocked = (slug) => lockedProjects.find((p) => p.slug === slug);
export const findProject = (slug) => projects.find((p) => p.slug === slug);
