import type { Metadata } from 'next'
import { SectionHeading } from '@/components/ui/CaseBlocks'
import { PageHeader } from '@/components/ui/PageHeader'
import { outlinePill } from '@/components/ui/button-styles'
import { SiteBar } from '@/components/site/SiteBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { ABOUT_CONTENT as A } from '@/lib/about'
import { AVATAR, EMAIL, NAME, YOUTUBE, navWith } from '@/lib/site'
import { TOOL_LOGOS } from '@/lib/tool-logos'
import { cn } from '@/lib/utils'

// Three facts, how she works, life outside work. The content lives in lib/about.ts.
export const metadata: Metadata = {
  title: 'About, Yana Kovalova',
  description: 'How Yana Kovalova works, and what she does outside work.',
}

type Fact = { label: string; value?: string; tools?: string[] }

export default function About() {
  const facts = A.facts as Fact[]
  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      <SiteBar name={NAME} avatar={AVATAR} nav={navWith('About')} mailto={EMAIL} />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
        <PageHeader title="About" />

        <div className="space-y-8 text-xs leading-relaxed text-muted-foreground [&_section>p]:max-w-2xl">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-border bg-card p-5">
                <dt className="text-[14px]/5 text-muted-foreground/70">{f.label}</dt>
                <dd className="mt-1.5 text-[14px]/5 text-foreground">
                  {f.tools ? (
                    <span className="flex flex-wrap items-center gap-3">
                      {f.tools.map((id) => {
                        const t = TOOL_LOGOS[id]
                        if (!t) return null
                        return (
                          <svg key={id} viewBox="0 0 24 24" role="img" aria-label={t.title} className="h-5 w-5 fill-current text-foreground/80">
                            <title>{t.title}</title>
                            <path d={t.path} />
                          </svg>
                        )
                      })}
                    </span>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <section className="space-y-4">
            <SectionHeading>How I work</SectionHeading>
            {A.work.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section className="space-y-4">
            <SectionHeading>Outside work</SectionHeading>
            <p>{A.outside.text}</p>
            {YOUTUBE && (
              <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className={cn(outlinePill, 'h-9')}>
                {A.outside.linkLabel}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </section>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
