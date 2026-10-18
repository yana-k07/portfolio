import type { Metadata } from 'next'
import Image from 'next/image'
import { SectionHeading } from '@/components/ui/CaseBlocks'
import { LazyAutoplayVideo } from '@/components/ui/LazyAutoplayVideo'
import { PageHeader } from '@/components/ui/PageHeader'
import { outlinePill } from '@/components/ui/button-styles'
import { SiteBar } from '@/components/site/SiteBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { ABOUT_CONTENT as A } from '@/lib/about'
import { AVATAR, INSTAGRAM, LINKEDIN, NAME, YOUTUBE, navWith } from '@/lib/site'
import { TOOL_LOGOS } from '@/lib/tool-logos'
import { cn } from '@/lib/utils'

// Who she is and her links, three facts, how she works, life
// outside work with a grid of her photos. The content lives in lib/about.ts.
export const metadata: Metadata = {
  title: 'About me, Yana Kovalova',
  description: 'How Yana Kovalova works, and what she does outside work.',
}

type Fact = { label: string; value?: string; tools?: string[] }

export default function About() {
  const facts = A.facts as Fact[]
  const links = [
    { label: 'LinkedIn', href: LINKEDIN },
    { label: 'YouTube', href: YOUTUBE },
    { label: 'Instagram', href: INSTAGRAM },
  ].filter((l) => l.href)
  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      <SiteBar name={NAME} avatar={AVATAR} nav={navWith('About')} />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
        <PageHeader title="About me" />

        <div className="mb-10 max-w-2xl">
          <div className="space-y-4 text-sm text-foreground">
            {A.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {links.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={cn(outlinePill, 'h-9')}>
                    {l.label}
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

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

          <LazyAutoplayVideo src={A.video.src} poster={A.video.poster} autoplay decorative className="img-outline aspect-video w-full rounded-xl object-cover" />

          <section className="space-y-4">
            <SectionHeading>How I work</SectionHeading>
            {A.work.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section className="space-y-4">
            <SectionHeading>Experience</SectionHeading>
            <ol className="divide-y divide-border border-y border-border">
              {A.experience.map((e) => (
                <li key={e.company} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="text-[14px]/5 text-foreground">
                    {e.company}
                    <span className="text-muted-foreground/70"> · {e.role}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[13px]/5 text-muted-foreground/70">{e.period}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <SectionHeading>Outside work</SectionHeading>
            <p>{A.outside.text}</p>
            <div className="grid grid-cols-3 gap-2 pt-2 sm:gap-3">
              {A.photos.map((ph) => (
                <Image
                  key={ph.src}
                  src={ph.src}
                  alt={ph.alt}
                  width={1200}
                  height={1600}
                  sizes="(max-width: 640px) 33vw, 240px"
                  className="img-outline aspect-[3/4] w-full rounded-lg object-cover sm:rounded-xl"
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeading>How I got here</SectionHeading>
            {A.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
