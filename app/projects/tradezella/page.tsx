import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { BackLink } from '@/components/ui/BackLink'
import { Bullets, CaseMeta, Num, SectionHeading } from '@/components/ui/CaseBlocks'
import { LazyAutoplayVideo } from '@/components/ui/LazyAutoplayVideo'
import { PageHeader } from '@/components/ui/PageHeader'
import { PhoneFrame } from '@/components/ui/PhoneFrame'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { TableOfContents } from '@/components/ui/TableOfContents'
import { ZoomableMedia } from '@/components/ui/ZoomableMedia'
import { outlinePill } from '@/components/ui/button-styles'
import { cn } from '@/lib/utils'
import { SiteBar } from '@/components/site/SiteBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { AVATAR, EMAIL, NAME, NAV, asset as A } from '@/lib/site'
import { CompareSlider } from './CompareSlider'

// The Tradezella case: the text in the reading column (768px, prose capped at
// ~70ch), the before/after, the two-up and the clips at the wide zone
// (1152px). Every image and clip opens in the full-screen viewer, the phone
// capture scrolls inside the device, the company's audience figures sit in
// one line so they don't compete with the results.
export const metadata: Metadata = {
  title: 'Tradezella: redesigning 50+ trading reports',
  description:
    'Redesigning the reports of a trading journal and analytics platform. Report views up 15%, time in reports up 11%.',
}

const RESULTS = [
  { value: '+15.38%', label: 'Total report views' },
  { value: '+10.56%', label: 'Time in reports, 4m 34s to 5m 03s' },
  { value: '+8.62%', label: 'Views per active user' },
]

export default function Tradezella() {
  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      <SiteBar name={NAME} avatar={AVATAR} nav={NAV} mailto={EMAIL} />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
        <BackLink href="/#projects">← Projects</BackLink>

        <PageHeader
          title="Tradezella: redesigning 50+ trading reports"
          lede="TradeZella is a trading journal and analytics platform. I redesigned its reports so the data reads clearly and feels personal to each trader. Report views grew by 15%."
        >
          <a href="https://tradezella.com" target="_blank" rel="noopener noreferrer" className={cn(outlinePill, 'h-8 px-3 font-medium')}>
            tradezella.com
            <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </PageHeader>

        <article className="space-y-8 text-xs leading-relaxed text-muted-foreground [&_section>ol]:max-w-2xl [&_section>p]:max-w-2xl [&_section>ul]:max-w-2xl">
          <CaseMeta
            items={[
              { label: 'Role', value: 'Senior product designer, solo' },
              { label: 'Period', value: 'Oct 2024 to Oct 2025' },
              { label: 'Shipped', value: 'Reports 2.0, Q1 2025' },
              { label: 'Team', value: 'Product manager and the engineering team' },
            ]}
          />

          {/* Her results first, as the site's headline numbers. */}
          <section className="space-y-3">
            <h2 className="sr-only">Results</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {RESULTS.map((r) => (
                <div key={r.label} className="rounded-xl border border-border bg-card p-5">
                  <dd className="text-xl font-semibold leading-tight tracking-tight text-foreground tabular-nums">{r.value}</dd>
                  <dt className="mt-1 text-[14px]/5 text-muted-foreground/70">{r.label}</dt>
                </div>
              ))}
            </dl>
            <p className="font-mono text-[13px]/5 text-muted-foreground/70">After Reports 2.0 shipped in Q1 2025.</p>
          </section>

          <Breakout>
            <figure className="space-y-2">
              <CompareSlider
                label="Compare the Reports overview before and after the redesign"
                before={{ src: A('compare-before-BvzMZiv3.webp'), alt: 'The Reports overview before the redesign: a long table of raw stats', width: 2000, height: 1250 }}
                after={{ src: A('compare-after-9FT-3rqV.webp'), alt: 'The Reports overview after the redesign: charts with selectable metrics and a summary', width: 1440, height: 900 }}
              />
              <figcaption className="text-[14px]/5 text-muted-foreground/70">The Reports overview before and after. Drag to compare.</figcaption>
            </figure>
          </Breakout>

          <section className="space-y-4">
            <SectionHeading>Context</SectionHeading>
            <p>
              TradeZella helps traders improve through their own data: a journal, analytics and a library of reports. It serves traders at every level, from beginners learning the basics to professionals running several accounts.
            </p>
            <p className="font-mono text-[13px]/5 text-muted-foreground/70">
              100K+ traders on the platform · 130K Instagram followers · 27K in Discord. Public figures from tradezella.com.
            </p>
          </section>

          <section className="space-y-4">
            <SectionHeading>Problem</SectionHeading>
            <p>
              Traders were not engaging with their performance data. The reports showed too many raw metrics with no hierarchy, gave no guidance on which report to use when, and worked poorly on mobile.
            </p>
            <p>The analytics agreed:</p>
            <Bullets
              items={[
                <>
                  Average time on report pages: <Num>4m 34s</Num>
                </>,
                <>
                  Return visit rate for reports: <Num>below 30%</Num>
                </>,
                'User feedback: confusion about how to get an insight out of a report',
              ]}
            />
          </section>

          <Breakout>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ProjectImage
                src={A('before-overview-BZBm_ZZ3.webp')}
                alt="The Overview page before the redesign, with all stats in two long tables of raw numbers"
                width={2000}
                height={1063}
                caption="Before: the Overview page, all stats in two long tables of raw numbers."
              />
              <ProjectImage
                src={A('before-report-BPTNS120.webp')}
                alt="A single report before the redesign, with two bar charts and a summary table"
                width={2000}
                height={1062}
                caption="Before: a single report (days till expiration), two bar charts and a summary table."
              />
            </div>
          </Breakout>

          <section className="space-y-4">
            <SectionHeading>Approach</SectionHeading>
            <Sub>Discovery</Sub>
            <Bullets
              items={[
                'Stakeholder interviews to align on KPIs and retention goals',
                'Five user interviews with active and lapsed traders at different experience levels',
                'A heuristic audit of the report flows',
                'Competitor analysis: Tradervue, Tradersync, Edgewonk, FxReplay',
                'Quantitative analysis in GA4, the Pages and screens report',
              ]}
            />
            <p>A few clear themes came out of the interviews:</p>
            <Bullets
              items={[
                'Reports felt either too heavy with data or not actionable enough',
                'The visual hierarchy was confusing, most of all on mobile',
                'Performance-focused traders wanted strategy-level outcomes faster, not only trades',
                'Professional traders, about 20%, needed advanced customization and comparison tools',
              ]}
            />
            <p>
              These conversations changed how we thought about structure, filters, summaries and the feedback loops traders needed. The goal was not to reformat charts. It was to remove friction and surface clarity.
            </p>
            <Sub>Definition</Sub>
            <p>
              We worked in weekly sprints, shipping usable builds and refining them on trader feedback. As the only designer I moved between Figma iterations, product discussions and dev-ready handoffs.
            </p>
            <p>
              We launched the first two core reports, Performance and Day and time, to validate the layout. The structure held, so we reused its visual and interaction patterns across the rest of the suite.
            </p>
          </section>

          <section className="space-y-4">
            <SectionHeading>Solution</SectionHeading>
            <Sub>Performance dashboard</Sub>
            <p>
              The Performance report shows Net P&amp;L, win rate and trade count side by side, so patterns across trading sessions are visible at once. A metric selector lets traders pick from a wide range of indicators and choose how each one is charted.
            </p>
          </section>

          <Breakout>
            <Clip
              src={A('metrics-Dd9dYfpG.webm')}
              poster={A('metrics-poster-DafL8tlo.webp')}
              width={1280}
              height={488}
              caption="Configuring a chart: search any metric in a grouped list, then choose how it is drawn and its colour."
            />
          </Breakout>

          <section className="space-y-4">
            <Sub>Personalization</Sub>
            <p>
              A guided onboarding learns what each trader cares about, and a widget system puts the most relevant reports first. Nobody has to guess which of the 50+ reports to open.
            </p>
            <Sub>Making data actionable</Sub>
            <p>
              Tooltips and insight banners explain each metric in plain words. A comparison layer inside every report shows what changed against another period and why it matters. Cross-analysis compares performance across timeframes, strategies and market conditions.
            </p>
          </section>

          <Breakout>
            <Clip
              src={A('compare-summary-DABYRn_V.webm')}
              poster={A('compare-summary-poster-Cx05ep_g.webp')}
              width={1280}
              height={584}
              caption="The comparison layer in the Summary: every metric shows its change against another period, tooltips name the period, and Show difference turns the changes on or off."
            />
          </Breakout>

          <section className="space-y-4">
            <Sub>Mobile</Sub>
            <p>I rebuilt the hierarchy for small screens in mobile wireframes and tested them in responsive previews.</p>
            <figure className="space-y-2">
              {/* The capture scrolls inside the device; on the page the wheel
                  must carry on to the page once the capture ends (PhoneFrame's
                  overscroll-contain is for the viewer, where nothing should
                  move behind it), or the phone becomes a trap mid-article. */}
              <div className="flex justify-center rounded-xl bg-muted px-6 py-10 [&_[data-screen-scroll]]:overscroll-auto">
                <PhoneFrame
                  src={A('mobile-body-BMffF43Y.webp')}
                  alt="Mobile Reports: the Performance chart and the Summary rebuilt for a narrow screen"
                  long={{ width: 780, height: 2654 }}
                  scroll
                  sizes="280px"
                  className="w-[280px]"
                />
              </div>
              <figcaption className="text-[14px]/5 text-muted-foreground/70">
                Mobile Reports: the Performance chart and the Summary rebuilt for a narrow screen, with the change under each metric. Scroll inside the phone.
              </figcaption>
            </figure>
          </section>

          <section className="space-y-4">
            <SectionHeading>Impact</SectionHeading>
            <p>
              After Reports 2.0 shipped in Q1 2025, total report views grew by <Num>15.38%</Num>. Traders stayed longer: average engagement time across reports rose <Num>10.56%</Num>, from 4m 34s to 5m 03s. They also opened more reports each, with views per active user up <Num>8.62%</Num>.
            </p>
          </section>
        </article>

        <TableOfContents />
      </div>

      <SiteFooter />
    </main>
  )
}

/** The wide zone from inside the reading column: escape to the viewport, then centre at 1152px. */
function Breakout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-[calc(50%-50vw)]">
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </div>
  )
}

/** The case's third level: 16px semibold, weight carries it over the body. */
function Sub({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-base font-semibold leading-snug text-foreground">{children}</h3>
}

// A clip at its own ratio: plays while on screen, opens in MediaViewer on click.
function Clip({ src, poster, width, height, caption }: { src: string; poster: string; width: number; height: number; caption: string }) {
  return (
    <figure className="space-y-2">
      <div className="img-outline overflow-hidden rounded-xl bg-muted" style={{ aspectRatio: `${width} / ${height}` }}>
        <ZoomableMedia zoom={{ type: 'video', src, poster }} label={`Open the clip full screen: ${caption}`} caption={caption}>
          <LazyAutoplayVideo src={src} poster={poster} autoplay decorative className="h-full w-full object-cover" />
        </ZoomableMedia>
      </div>
      <figcaption className="text-[14px]/5 text-muted-foreground/70">{caption}</figcaption>
    </figure>
  )
}
