// Resume → Experience, newest first. One short line per job.
export type Job = { id: string; company: string; role: string; period: string; summary: string; logo?: string }

export const EXPERIENCE: Job[] = [
  {
    "id": "quorso",
    "company": "Quorso",
    "role": "Senior Product Designer",
    "period": "Mar 2026 – Now",
    "summary": "Working on the design system and improving product interfaces, partnering with clients and the internal team to refine the user experience.",
    "logo": "/assets/logos/quorso.png"
  },
  {
    "id": "railsware",
    "company": "Railsware",
    "role": "Senior Product Designer",
    "period": "Oct 2024 – Mar 2026",
    "summary": "Designed product experiences across energy, SaaS and CRM platforms, with hands-on frontend contributions.",
    "logo": "/assets/logos/railsware.png"
  },
  {
    "id": "tradezella",
    "company": "TradeZella",
    "role": "Senior Product Designer",
    "period": "Oct 2024 – Oct 2025",
    "summary": "Led projects from 0 to 1 for a trading analytics platform, including the Reports 2.0 redesign that grew report views by 15%.",
    "logo": "/assets/logos/tradezella.png"
  },
  {
    "id": "yetlo",
    "company": "Project Yetlo Finance",
    "role": "Product Designer",
    "period": "Jun 2023 – Oct 2024",
    "summary": "Led end-to-end design of a fintech product from scratch: transfers, SEPA payments, multi-currency accounts and business banking across web, iOS and Android.",
    "logo": "/assets/logos/yetlo.png"
  },
  {
    "id": "spaceberry",
    "company": "Spaceberry Studio",
    "role": "UX/UI Designer",
    "period": "Dec 2021 – May 2023",
    "summary": "Designed product experiences for international clients in B2B SaaS, analytics, energy and HealthTech, from discovery to delivery.",
    "logo": "/assets/logos/spaceberry.png"
  },
  {
    "id": "layo",
    "company": "Layo",
    "role": "UX/UI Designer",
    "period": "Jan 2021 – Dec 2021",
    "summary": "Created UI/UX concepts for web and mobile products for international clients, from ideation to implementation.",
    "logo": "/assets/logos/layo.png"
  }
]
