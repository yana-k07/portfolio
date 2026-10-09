// Content of the case pages ported from the first version of the site:
// Yetlo, Organizer and the Quorso design system. Edit the text here; the
// layout lives in app/projects/[slug]/page.tsx. A block of type 'draft' is a
// note still to write: it renders as a dashed placeholder until replaced.

export type CaseImage = { src: string; width: number; height: number; alt: string }

export type CaseBlock =
  | { type: 'p'; text: string }
  | { type: 'draft'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'image'; src: string; width: number; height: number; alt: string; caption: string; wide: boolean }
  /** A screen recording played inside the phone mockup. */
  | { type: 'phone-video'; src: string; poster: string; alt: string; caption: string }

export type Case = {
  slug: string
  title: string
  lede: string
  link?: { label: string; url: string }
  meta: { label: string; value: string }[]
  cover?: CaseImage
  chapters: { id: string; title: string; blocks: CaseBlock[] }[]
}

export const CASES: Case[] = [
  {
    "slug": "yetlo",
    "title": "Yetlo: designing scalable money transfer flows",
    "lede": "A fintech app for low-commission transfers across European countries, on iOS, Android and web.",
    "meta": [
      {
        "label": "Role",
        "value": "Product designer"
      },
      {
        "label": "Period",
        "value": "Jun 2023 to Oct 2024"
      },
      {
        "label": "Focus",
        "value": "Money transfers"
      },
      {
        "label": "Platform",
        "value": "iOS, Android and web"
      }
    ],
    "cover": {
      "src": "/assets/yetlo/cover-v3.webp",
      "width": 2400,
      "height": 1601,
      "alt": "Yetlo on two phones: the home screen in dark theme behind, the Transfer screen in front"
    },
    "chapters": [
      {
        "id": "context",
        "title": "Context",
        "blocks": [
          {
            "type": "p",
            "text": "Yetlo lets users transfer money across European countries with low commission and favorable exchange rates. The product covers both personal and business accounts, managed through mobile apps and a web platform, with euro and dollar cards planned for a later phase."
          },
          {
            "type": "p",
            "text": "As the sole designer, I worked end-to-end across every surface — iOS, Android, web app, admin panel, email templates, the marketing site, and dark theme adaptation for all platforms."
          },
          {
            "type": "p",
            "text": "I joined after development had started: engineering already had the app's skeleton in place, so a ground-up redesign was off the table. The work was to make the flows clearer and more capable within that structure, improving hierarchy, states and edge cases without breaking what was already built."
          },
          {
            "type": "image",
            "src": "/assets/yetlo/platforms.webp",
            "width": 2400,
            "height": 1421,
            "caption": "",
            "alt": "The Yetlo Transfer screen on an iPhone in dark theme and on an Android phone in light theme",
            "wide": true
          }
        ]
      },
      {
        "id": "send-money",
        "title": "Send money",
        "blocks": [
          {
            "type": "h3",
            "text": "Challenge"
          },
          {
            "type": "p",
            "text": "The core challenge was making transfers between accounts feel effortless — letting users pick accounts, see balances and account descriptions, and choose the right transfer method. Critically, this had to be built as a reusable module: the same solution needed to work for business users sending SEPA transfers and Yetlo-link payments."
          },
          {
            "type": "h3",
            "text": "Approach"
          },
          {
            "type": "p",
            "text": "We identified four sending methods:"
          },
          {
            "type": "list",
            "ordered": true,
            "items": [
              "SEPA transfer",
              "Transfer between your own wallets",
              "Transfer to a Yetlo user by email",
              "Transfer to a Yetlo user via Yetlo link"
            ]
          },
          {
            "type": "image",
            "src": "/assets/yetlo/send-flows.webp",
            "width": 3000,
            "height": 2903,
            "caption": "Send flows, from the account page through each sending method to the success screen. Click to enlarge.",
            "alt": "Send flows, from the account page through each sending method to the success screen. Click to enlarge.",
            "wide": true
          },
          {
            "type": "h3",
            "text": "Solution"
          },
          {
            "type": "p",
            "text": "The solution centered on a flexible transfer module handling multiple user types (personal and business) and multiple methods — designed for reusability, scalability, and compliance with the different requirements of each transfer type."
          },
          {
            "type": "phone-video",
            "src": "/assets/yetlo/sepa-flow.webm",
            "poster": "/assets/yetlo/sepa-flow-poster.webp",
            "alt": "A SEPA payment on mobile: recipient details, the amount with its fee, choosing the account, and Hold to confirm",
            "caption": "A SEPA payment end to end: the recipient's details, the amount with the fee shown up front, switching the account to pay from, then sliding Hold to confirm to send."
          },
          {
            "type": "image",
            "src": "/assets/yetlo/mobile-transfer-annotated.webp",
            "width": 2000,
            "height": 1297,
            "caption": "Mobile transfer screen: account selector, entering the full amount in one tap, account description, transfer time and exchange rates.",
            "alt": "Mobile transfer screen: account selector, entering the full amount in one tap, account description, transfer time and exchange rates.",
            "wide": true
          },
          {
            "type": "image",
            "src": "/assets/yetlo/mobile-transfer-dark.webp",
            "width": 2000,
            "height": 1297,
            "caption": "Dark theme: a transfer between currencies, and the error state when the balance is too low.",
            "alt": "Dark theme: a transfer between currencies, and the error state when the balance is too low.",
            "wide": true
          },
          {
            "type": "p",
            "text": "To keep the experience consistent across devices, I brought the same functionality to web — where business users, who rely on web access for complex transactions like SEPA, could transfer funds, view balances, and manage accounts seamlessly."
          },
          {
            "type": "image",
            "src": "/assets/yetlo/web-transfer-annotated.webp",
            "width": 1800,
            "height": 1311,
            "caption": "The same module on web, with transfer time and fee shown before confirming.",
            "alt": "The same module on web, with transfer time and fee shown before confirming.",
            "wide": false
          },
          {
            "type": "image",
            "src": "/assets/yetlo/web-home.webp",
            "width": 1300,
            "height": 908,
            "caption": "Web app home: accounts, cards, balances and transactions.",
            "alt": "Web app home: accounts, cards, balances and transactions.",
            "wide": false
          }
        ]
      },
      {
        "id": "design-system",
        "title": "Design system",
        "blocks": [
          {
            "type": "p",
            "text": "Alongside the flows, I built Yetlo's design system for iOS, Android and web. Shared foundations (colour, typography, spacing and iconography) and a core component library (buttons in every size and state, inputs with validation and errors, account cards, toasts, progress, selection controls and navigation) keep the product consistent on every surface."
          },
          {
            "type": "p",
            "text": "Consistency did not mean identical. Components follow Apple's Human Interface Guidelines on iOS and Material Design on Android, from navigation patterns and system controls to touch targets and type, so the app feels native on each platform, while the web reuses the same components in desktop layouts. Light and dark themes are part of the foundations, so every screen ships in both."
          },
          {
            "type": "p",
            "text": "For the team, the system turned design decisions into reusable parts: new flows were assembled from existing components instead of being drawn from scratch, which kept handoff fast and the three platforms in step."
          },
          {
            "type": "image",
            "src": "/assets/yetlo/design-system.webp",
            "width": 2400,
            "height": 1800,
            "caption": "",
            "alt": "Yetlo design system components: account cards, text inputs with error states, buttons, icons, toasts, amount fields, progress indicators, toggles, checkboxes and radio buttons",
            "wide": true
          }
        ]
      },
      {
        "id": "impact",
        "title": "Impact",
        "blocks": [
          {
            "type": "p",
            "text": "Designing within an inherited codebase meant balancing ambition with constraint on every screen. The through-line was building for reuse — every flow I shipped for personal users was structured to extend cleanly to business accounts, which kept the system coherent as scope grew across multiple transfer methods and platforms. Working as the sole designer across web, mobile, and admin also taught me to make decisions that hold up without a team to catch gaps."
          }
        ]
      }
    ]
  },
  {
    "slug": "yetlo-business",
    "title": "Yetlo Business: company registration and team access",
    "lede": "The business side of Yetlo: companies register in a few steps, open multi-currency accounts and add employees with roles and permissions.",
    "meta": [
      {
        "label": "Role",
        "value": "Product designer"
      },
      {
        "label": "Period",
        "value": "Jun 2023 to Oct 2024"
      },
      {
        "label": "Focus",
        "value": "Company registration, roles and permissions"
      },
      {
        "label": "Platform",
        "value": "Web and admin panel"
      }
    ],
    "cover": {
      "src": "/assets/yetlo/business-dashboard-dark.webp",
      "width": 1800,
      "height": 1311,
      "alt": "Yetlo Business web app in dark theme: the first-run state of a new account"
    },
    "chapters": [
      {
        "id": "context",
        "title": "Context",
        "blocks": [
          {
            "type": "p",
            "text": "Yetlo Business is a part of the Yetlo project that specializes in business accounts. Companies can create multi-currency accounts, add employees to an account with specific roles or customize permissions for them."
          },
          {
            "type": "p",
            "text": "As the sole designer on Yetlo, I designed the business side end to end: registration, the web app and the admin panel."
          }
        ]
      },
      {
        "id": "challenge",
        "title": "Challenge",
        "blocks": [
          {
            "type": "p",
            "text": "We started with user and company registration. The main task was to make registration quick for customers while still collecting as much information as we needed. It also had to cover cases such as:"
          },
          {
            "type": "list",
            "ordered": false,
            "items": [
              "The user already exists on the platform",
              "A company with the same registration number already exists",
              "The same company has an incomplete registration",
              "The user started registration but did not confirm the email within 30 days, and the link has expired"
            ]
          },
          {
            "type": "image",
            "src": "/assets/yetlo/registration-flow.webp",
            "width": 2000,
            "height": 2966,
            "caption": "The registration and login flow: personal and company steps, email verification, and the checks for existing users and companies. Click to enlarge.",
            "alt": "User flow for registration and login: company info, personal info, email verification, company details, address and business details, with checks for an existing login and an existing company legal ID",
            "wide": true
          }
        ]
      },
      {
        "id": "approach",
        "title": "Approach",
        "blocks": [
          {
            "type": "p",
            "text": "My responsibilities:"
          },
          {
            "type": "list",
            "ordered": false,
            "items": [
              "Modifying the current implementation of the admin panel to fit the new requirements.",
              "Generating ideas and concepts for new products or features based on user research and business requirements."
            ]
          },
          {
            "type": "draft",
            "text": "Draft: interviews with businesses on how they organise access to financial data, competitor analysis (Wise, Revolut), and work with compliance on business and client verification."
          }
        ]
      },
      {
        "id": "solution",
        "title": "Solution",
        "blocks": [
          {
            "type": "p",
            "text": "I split registration into distinct steps rather than one long form."
          },
          {
            "type": "p",
            "text": "Step one collects the company — name, registration number, country of registration. Step two collects the person. Splitting it this way wasn’t cosmetic: it let us check the database for an existing company registration number and an existing user before either party got deep into the process, so duplicates and half-finished registrations surface early instead of at submission."
          },
          {
            "type": "image",
            "src": "/assets/yetlo/business-registration-company.webp",
            "width": 1640,
            "height": 1100,
            "caption": "Step one: company information.",
            "alt": "Step one: company information.",
            "wide": true
          },
          {
            "type": "image",
            "src": "/assets/yetlo/business-registration-personal.webp",
            "width": 1640,
            "height": 1100,
            "caption": "Step two: personal details of the person registering.",
            "alt": "Step two: personal details of the person registering.",
            "wide": true
          }
        ]
      },
      {
        "id": "impact",
        "title": "Impact",
        "blocks": [
          {
            "type": "draft",
            "text": "Draft: what changed for businesses after launch: how many companies registered, how fast, fewer duplicate or abandoned registrations, fewer support requests."
          }
        ]
      }
    ]
  },
  {
    "slug": "organizer",
    "title": "Organizer: designing phone banking and data import for campaign teams",
    "lede": "A people-centric data and mobilization platform for nonprofit and campaign teams. I designed its phone banking session page and a safer way to create custom attributes during data import.",
    "meta": [
      {
        "label": "Role",
        "value": "Product designer"
      },
      {
        "label": "Period",
        "value": "2023"
      },
      {
        "label": "Focus",
        "value": "Phone banking and data import"
      },
      {
        "label": "Industry",
        "value": "Civic tech"
      }
    ],
    "link": {
      "label": "murmuration.org",
      "url": "https://murmuration.org/organizer-by-murmuration"
    },
    "cover": {
      "src": "/assets/organizer/hero.webp",
      "width": 2000,
      "height": 1018,
      "alt": "Organizer cover"
    },
    "chapters": [
      {
        "id": "context",
        "title": "Context",
        "blocks": [
          {
            "type": "p",
            "text": "Organizer by Murmuration is a people-centric data platform with built-in mobilization and engagement tools. Nonprofit and campaign teams use it to understand their audience and reach it, with analytics, data management and a fully integrated CRM in one place instead of data scattered across separate tools."
          },
          {
            "type": "p",
            "text": "In 2023 I worked on two features with a design lead, a project manager and developers: phone banking and custom attributes in data import."
          }
        ]
      },
      {
        "id": "phone-banking",
        "title": "Task 1: Phone banking",
        "blocks": [
          {
            "type": "h3",
            "text": "Challenge"
          },
          {
            "type": "p",
            "text": "Phone banking existed on the platform only as a rough sketch. The goal was to turn it into a working tool: volunteers call from the platform or from their own number, fill in a survey during the call, and teams get call analytics. The most important piece was the session page, the screen a volunteer works in for the whole call."
          },
          {
            "type": "image",
            "src": "/assets/organizer/phone-before.webp",
            "width": 2000,
            "height": 1013,
            "caption": "Before: the rough session page that already existed on the platform.",
            "alt": "Before: the rough session page that already existed on the platform.",
            "wide": true
          },
          {
            "type": "h3",
            "text": "Approach"
          },
          {
            "type": "p",
            "text": "I started by defining the product. Kick-off meetings with the product manager, Head of UX, VP of Product, design lead and a frontend engineer gave me the requirements and constraints. We chose the volunteers who make the calls as the main users and mapped their journey."
          },
          {
            "type": "image",
            "src": "/assets/organizer/phone-journey.webp",
            "width": 1498,
            "height": 1108,
            "caption": "The volunteer’s journey through a phone bank session.",
            "alt": "The volunteer’s journey through a phone bank session.",
            "wide": false
          },
          {
            "type": "p",
            "text": "Next came research: a detailed competitor analysis, with HubDialer as the main reference."
          },
          {
            "type": "p",
            "text": "The session page has many dependencies. What it shows depends on the call result selected, on whether the form is filled in and on which buttons are active. I collected every case in Confluence and walked through the possible scenarios with the developers, so design and engineering agreed on the rules before the screens were final."
          },
          {
            "type": "p",
            "text": "In the design phase I built prototypes for the first team presentation, using the existing design system, navigation and layout, since this was already a working product. I also made clickable prototypes for the six main scenarios, to test with users."
          },
          {
            "type": "image",
            "src": "/assets/organizer/phone-options.webp",
            "width": 2000,
            "height": 1026,
            "caption": "Two layout options for the session page, each with the states of a call.",
            "alt": "Two layout options for the session page, each with the states of a call.",
            "wide": true
          },
          {
            "type": "h3",
            "text": "Solution"
          },
          {
            "type": "p",
            "text": "We chose this layout to test:"
          },
          {
            "type": "list",
            "ordered": false,
            "items": [
              "Breadcrumbs, name and description of the effort at the top, so the volunteer always knows where they are and how to leave.",
              "Call area on the left: the call button and information about the person being called.",
              "Instructions and survey form in the centre. The instructions collapse and expand, as they can be long.",
              "Call result and actions: Skip, or Submit and next. Until the call has started, the volunteer cannot move on to the next contact.",
              "Footer with statistics for the volunteer and for the whole effort, and the End session button."
            ]
          },
          {
            "type": "image",
            "src": "/assets/organizer/phone-final.webp",
            "width": 1456,
            "height": 1036,
            "caption": "The session page layout chosen for testing.",
            "alt": "The session page layout chosen for testing.",
            "wide": false
          }
        ]
      },
      {
        "id": "custom-attributes",
        "title": "Task 2: Custom attributes",
        "blocks": [
          {
            "type": "h3",
            "text": "Challenge"
          },
          {
            "type": "p",
            "text": "When importing data, users can turn a column of their file into a custom attribute with single or multiple choice values. Without guardrails, one column could produce almost endless options, which would hurt performance and make the CRM harder to use."
          },
          {
            "type": "image",
            "src": "/assets/organizer/ca-mapping.webp",
            "width": 2000,
            "height": 970,
            "caption": "The mapping step of the import, where columns become attributes.",
            "alt": "The mapping step of the import, where columns become attributes.",
            "wide": true
          },
          {
            "type": "h3",
            "text": "Approach"
          },
          {
            "type": "p",
            "text": "I defined the task with the product managers and stakeholders, and we laid out four possible approaches:"
          },
          {
            "type": "list",
            "ordered": true,
            "items": [
              "No limit: users get as many options as the file contains.",
              "Users add the options manually while creating the attribute.",
              "No support for radio or checkbox custom attributes.",
              "A validation step when the user chooses a radio or checkbox data type."
            ]
          },
          {
            "type": "image",
            "src": "/assets/organizer/ca-options.webp",
            "width": 1726,
            "height": 1030,
            "caption": "The four options with their pros and cons.",
            "alt": "The four options with their pros and cons.",
            "wide": true
          },
          {
            "type": "p",
            "text": "We chose the fourth. It keeps mapping and validating separate and scales well, even though it takes more effort to build."
          },
          {
            "type": "p",
            "text": "With the engineers I wrote a user story showing how the user and the system interact, and we reviewed it with the team. There we agreed on a limit of 50 values. After a competitor analysis I moved on to prototyping."
          },
          {
            "type": "h3",
            "text": "Solution"
          },
          {
            "type": "p",
            "text": "The design makes the limit visible at every step:"
          },
          {
            "type": "list",
            "ordered": false,
            "items": [
              "A hint under the data type says that single- and multi-select attributes are limited to 50 unique values, and an Inspect step checks the column.",
              "A clear error appears if the limit is exceeded, and it says what to do: change the data type or exclude the column.",
              "A preview shows what will be created: a counter of new attributes in the footer, a “new” tag in the preview table, and a “Custom Attributes to be Created” section with cards showing each attribute’s name, data type, category and description."
            ]
          },
          {
            "type": "image",
            "src": "/assets/organizer/ca-hint.webp",
            "width": 1092,
            "height": 504,
            "caption": "Choosing a data type: the hint about the limit, and the Inspect step.",
            "alt": "Choosing a data type: the hint about the limit, and the Inspect step.",
            "wide": false
          },
          {
            "type": "image",
            "src": "/assets/organizer/ca-error.webp",
            "width": 1242,
            "height": 684,
            "caption": "When a column has more than 50 unique values, the error explains how to continue.",
            "alt": "When a column has more than 50 unique values, the error explains how to continue.",
            "wide": false
          },
          {
            "type": "image",
            "src": "/assets/organizer/ca-preview.webp",
            "width": 1440,
            "height": 1024,
            "caption": "The import preview lists the attributes that will be created.",
            "alt": "The import preview lists the attributes that will be created.",
            "wide": false
          }
        ]
      },
      {
        "id": "impact",
        "title": "Impact",
        "blocks": [
          {
            "type": "p",
            "text": "The phone banking session page covers every state of a call (not started, answered, or ended with another result; form filled in or empty) in six documented scenarios. Product, design and engineering worked from the same rules in Confluence, and the clickable prototypes were ready for testing with volunteers."
          },
          {
            "type": "p",
            "text": "For custom attributes, the design sets a clear guardrail: the 50-value limit is explained before the user maps a column, an error says what to change when it is exceeded, and the preview shows exactly which attributes will be created."
          }
        ]
      }
    ]
  },
  {
    "slug": "quorso-design-system",
    "title": "Quorso: bringing order to a design system",
    "lede": "Quorso runs two interfaces on one system, with many older screens built on third-party libraries. I brought them together into one consistent design system, QUI.",
    "meta": [
      {
        "label": "Role",
        "value": "Senior product designer"
      },
      {
        "label": "Period",
        "value": "2026"
      },
      {
        "label": "Focus",
        "value": "Design system (QUI)"
      },
      {
        "label": "Scope",
        "value": "Two interfaces in one system"
      }
    ],
    "chapters": [
      {
        "id": "context",
        "title": "Context",
        "blocks": [
          {
            "type": "p",
            "text": "Quorso has two interfaces in one system, along with many older screens built on third-party libraries. Over time this led to inconsistency across the product."
          },
          {
            "type": "p",
            "text": "I took on the task of bringing everything to order, in four steps: a component audit, tokens, structuring the components, and patterns."
          }
        ]
      },
      {
        "id": "problem",
        "title": "Problem",
        "blocks": [
          {
            "type": "draft",
            "text": "Draft: what the inconsistency looked like in practice: how many versions of the same component existed, which third-party libraries were involved, and what it cost the team."
          }
        ]
      },
      {
        "id": "approach",
        "title": "Approach",
        "blocks": [
          {
            "type": "h3",
            "text": "1. Component audit"
          },
          {
            "type": "p",
            "text": "I started with the components. The audit cleaned up what existed so that every screen could use our QUI system and stay consistent with the rest."
          },
          {
            "type": "draft",
            "text": "Draft: how you ran the audit and what you found: number of components, duplicates, which screens used which library."
          },
          {
            "type": "p",
            "text": "The audit also covered the colour palette, and it showed that many colours were outdated. That made tokens the logical next step."
          },
          {
            "type": "h3",
            "text": "2. Tokens"
          },
          {
            "type": "p",
            "text": "Next, I introduced colour tokens in two layers. A Base collection holds 49 primitive colours: a mono scale from 0 to 1000, brand colours, red, amber, green, purple and blue, and a set of data colours."
          },
          {
            "type": "image",
            "src": "/assets/quorso/tokens-base.webp",
            "width": 2000,
            "height": 1395,
            "caption": "Base collection: 49 primitive colours, here the mono scale from 0 to 1000.",
            "alt": "Base collection: 49 primitive colours, here the mono scale from 0 to 1000.",
            "wide": false
          },
          {
            "type": "p",
            "text": "On top of it, 52 semantic tokens describe where a colour is used: background, border, button, navigation, text, status and icon. Each one points to a base colour for both the dark and light themes, and the names follow one pattern, such as status-error-bold-bg: group, meaning, strength and property."
          },
          {
            "type": "image",
            "src": "/assets/quorso/tokens-semantic.webp",
            "width": 2000,
            "height": 1090,
            "caption": "Semantic tokens: each status token points to a base colour in dark and light mode.",
            "alt": "Semantic tokens: each status token points to a base colour in dark and light mode.",
            "wide": true
          },
          {
            "type": "h3",
            "text": "3. Structuring components"
          },
          {
            "type": "p",
            "text": "Then I structured the components following atomic design. The smallest parts, such as text, the cursor, icons and prefix and suffix slots, are atoms. They combine into components like the text input, so a change in one place carries through everywhere that part is used."
          },
          {
            "type": "p",
            "text": "The text input shows the idea: one component with 7 state variants and properties for the placeholder, prefix, suffix, text, error text and cursor, instead of separate versions for each case."
          },
          {
            "type": "image",
            "src": "/assets/quorso/atomic-text-input.webp",
            "width": 2400,
            "height": 1124,
            "caption": "Atomic design in practice: small parts build the text input, one component with 7 states.",
            "alt": "Atomic design in practice: small parts build the text input, one component with 7 states.",
            "wide": true
          },
          {
            "type": "h3",
            "text": "4. Patterns"
          },
          {
            "type": "p",
            "text": "Finally, I moved on to patterns: ready-made solutions for recurring tasks, built from QUI components. We created 16 of them, from small pieces such as an OTP input, a date picker and loading states to larger ones like tables, filters, drawers, modals, navigation, page headers and layouts, and error pages."
          },
          {
            "type": "p",
            "text": "Each pattern comes with documentation: its states, when to use each one, and how it should look on the page. The header of the page builder form is one example. It has four states: a placeholder with an example name in italics (such as “Untitled survey”), filled once the user types a name, filled with a status that adds a “Draft” badge for work in progress, and a version with filters and a quick filter for pages that need them."
          },
          {
            "type": "image",
            "src": "/assets/quorso/pattern-header.webp",
            "width": 2000,
            "height": 1789,
            "caption": "Pattern documentation for the page builder form header: each state with a short note on when to use it.",
            "alt": "Pattern documentation for the page builder form header: each state with a short note on when to use it.",
            "wide": false
          }
        ]
      },
      {
        "id": "impact",
        "title": "Impact",
        "blocks": [
          {
            "type": "draft",
            "text": "Draft: what changed, with real numbers if you have them: fewer component versions, faster screen design, fewer inconsistencies, share of screens moved to QUI."
          }
        ]
      }
    ]
  }
]

export const findCase = (slug: string) => CASES.find((c) => c.slug === slug)
