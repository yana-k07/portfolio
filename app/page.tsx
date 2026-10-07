import type { Metadata } from 'next'
import { sectionHeading } from '@/components/ui/CaseBlocks'
import { glassPill, glassPillFace, glassPillShadow, outlinePill } from '@/components/ui/button-styles'
import { Reveal } from '@/components/ui/Reveal'
import { Tile, TileTitle, tileMeta } from '@/components/ui/Tile'
import { cn } from '@/lib/utils'
import { SiteBar } from '@/components/site/SiteBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { AVATAR, EMAIL, NAME, NAV, RESUME, asset } from '@/lib/site'

// The home page: the claim and two short paragraphs, one action pair, then
// the projects at the wide zone (1152px) so the covers show the work at a
// readable size. One type scale, sentence-case labels, mono for the small facts.
export const metadata: Metadata = {
  title: 'Yana Kovalova, product designer',
  description:
    'Product designer for complex B2B interfaces: dashboards, reports, onboarding, roles and permissions. Fintech and trading analytics.',
}

const HOME_NAV = NAV.map((item) => ({ ...item, active: item.label === 'Projects' }))

const COPY = {
  headline: 'Product designer for the screens people work in all day.',
  intro: [
    'Dashboards, reports, onboarding, roles and permissions. I take a product from research to a working prototype in React, so engineers get something close to the real thing, not a picture of it.',
  ],
}

type Project = {
  slug: string
  /** The product and, where she states it, the year. */
  meta: string
  /** The case page; defaults to /projects/<slug>. */
  href?: string
  title: string
  /** One fact in mono under the title: a result or the scope. */
  fact?: string
  cover?: string
  coverDark?: string
  locked?: boolean
}

const PROJECTS: Project[] = [
  {
    slug: 'tradezella',
    href: '/projects/tradezella',
    meta: 'TradeZella · 2025',
    title: 'Redesigning 50+ trading reports',
    fact: '+15% report views · +11% time in reports',
    cover: asset('tradezella-DT9fCBtX.webp'),
    coverDark: asset('tradezella-dark-BLHwSEIT.webp'),
  },
  {
    slug: 'yetlo',
    meta: 'Yetlo Finance · 2023 to 2024',
    title: 'A money transfer app for Europe, designed from scratch',
    fact: 'Web, iOS and Android',
    cover: asset('yetlo-CQiTYs6b.webp'),
    coverDark: asset('yetlo-dark-DE8PkbM2.webp'),
  },
  {
    slug: 'organizer',
    meta: 'Organizer · 2023',
    title: 'A data and mobilization platform for nonprofits and campaigns',
    fact: 'Phone banking and data import',
    cover: asset('organizer-BslymVfY.webp'),
    coverDark: asset('organizer-dark-C81BNo2v.webp'),
  },
  {
    slug: 'quorso-design-system',
    meta: 'Quorso · 2026',
    title: 'One design system for two interfaces and the older screens',
    fact: 'Design system',
    cover: asset('quorso-design-system-CTbVNutu.webp'),
    coverDark: asset('quorso-design-system-dark-Bq2JFHv7.webp'),
  },
  {
    slug: 'quorso-insights',
    meta: 'Quorso · 2026',
    title: 'An insights feature',
    fact: 'Available on request',
    locked: true,
  },
]

export default function Home() {
  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      <SiteBar name={NAME} avatar={AVATAR} nav={HOME_NAV} mailto={EMAIL} />

      {/* The wide zone (1152px) for the whole page: the text stays at ~70ch,
          the project covers take the width. */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section aria-labelledby="hero-heading" className="pb-14 pt-12 md:pb-20 md:pt-20">
          {/* eslint-disable-next-line @next/next/no-img-element -- light and dark covers swap by class */}
          <img
            src={AVATAR}
            alt="Yana Kovalova"
            width={56}
            height={56}
            className="img-outline h-14 w-14 rounded-full object-cover"
          />
          <h1
            id="hero-heading"
            className="mt-6 max-w-2xl text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-[32px] xl:text-4xl"
          >
            {COPY.headline}
          </h1>
          {COPY.intro.map((paragraph) => (
            <p key={paragraph} className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg md:leading-7">
              {paragraph}
            </p>
          ))}
          <div className="mt-6 flex flex-wrap items-center gap-2 lg:mt-8">
            <a href={EMAIL} className={cn(glassPill, 'h-9 px-4')} style={{ background: glassPillFace }}>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: glassPillShadow }} />
              <span className="relative">Email me</span>
            </a>
            <a href={RESUME} className={cn(outlinePill, 'h-9 translate-y-px dark:translate-y-0')}>
              Resume
            </a>
          </div>
          {/* The small facts in mono, the site's texture: where and what. */}
          <p className="mt-8 font-mono text-[13px]/5 text-muted-foreground/70">
            Warsaw, Poland · B2B and fintech
          </p>
        </section>

        <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-20 pb-16">
          <Reveal>
            <h2 id="projects-heading" className={cn(sectionHeading, 'mb-4')}>
              Projects
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 3) * 40}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
            {/* The sixth cell: not a sales card, the facts a hiring manager
                looks for next, so the grid closes without a hole. */}
            <Reveal delay={120}>
              <NowCard />
            </Reveal>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  )
}

// One project: the cover at its own ratio on the muted ground (her light and
// dark renders swap with the theme), the product and year as the meta line,
// the outcome as the title, one fact in mono. No zoom on the cover.
function ProjectCard({ p }: { p: Project }) {
  return (
    <Tile className="mb-0 h-full">
      <div className="aspect-[1200/787] w-full overflow-hidden bg-muted">
        {p.locked ? (
          <div className="flex h-full w-full items-center justify-center gap-2 text-[14px]/5 text-muted-foreground/70">
            <LockIcon className="h-4 w-4" />
            Password protected
          </div>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- light and dark covers swap by class */}
            <img src={p.cover} alt="" width={1200} height={787} loading="lazy" className="h-full w-full object-cover dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element -- light and dark covers swap by class */}
            <img src={p.coverDark} alt="" width={1200} height={787} loading="lazy" className="hidden h-full w-full object-cover dark:block" />
          </>
        )}
      </div>
      <div className="flex flex-col p-4">
        <span className={tileMeta}>{p.meta}</span>
        <TileTitle href={p.href ?? `/projects/${p.slug}`}>{p.title}</TileTitle>
        {p.fact && <span className="mt-3 font-mono text-[13px]/5 text-muted-foreground/70">{p.fact}</span>}
      </div>
    </Tile>
  )
}

const NOW = [
  { label: 'Now', value: 'Senior product designer at Quorso, Warsaw' },
  { label: 'Before', value: 'Railsware, TradeZella, Yetlo Finance, Spaceberry Studio, Layo' },
  { label: 'Focus', value: 'Complex B2B interfaces: dashboards, onboarding, roles and permissions' },
  { label: 'Tools', value: 'Figma, React, Tailwind, GA4' },
]

function NowCard() {
  return (
    <Tile className="mb-0 h-full">
      <div className="flex h-full flex-col p-5">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
          {NOW.map((row) => (
            <div key={row.label} className="contents">
              <dt className="text-[14px]/5 text-muted-foreground/70">{row.label}</dt>
              <dd className="text-[14px]/5 text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <a href={EMAIL} className={cn(outlinePill, 'h-9')}>
            Email me
          </a>
          <a href={RESUME} className={cn(outlinePill, 'h-9')}>
            Resume
          </a>
        </div>
      </div>
    </Tile>
  )
}

function LockIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="7" width="10" height="7" rx="2" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}
