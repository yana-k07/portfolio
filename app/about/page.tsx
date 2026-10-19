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

// Who she is and her links, the office clip, how she works (three facts first),
// experience, then a bit more about her with a grid of her photos. The content lives in lib/about.ts.
export const metadata: Metadata = {
  title: 'About me, Yana Kovalova',
  description: 'How Yana Kovalova works, and what she does outside work.',
}

// A slightly different tilt for each print, so the rows feel laid by hand.
const TILTS = [-3, 2, -1.5, 2.5, -2, 1.5]

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

        <LazyAutoplayVideo src={A.video.src} poster={A.video.poster} autoplay decorative className="img-outline mb-10 aspect-video w-full rounded-xl object-cover" />

        <div className="space-y-10 text-xs leading-relaxed text-muted-foreground [&_section>p]:max-w-2xl">
          <section className="space-y-4">
            <SectionHeading>How I work</SectionHeading>
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
            {A.work.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section className="space-y-4">
            <SectionHeading>Experience</SectionHeading>
            <ol className="divide-y divide-border border-y border-border">
              {A.experience.map((e) => (
                <li key={e.company} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <span className="flex items-center gap-3 text-[14px]/5 text-foreground">
                    <Image src={e.logo} alt="" width={28} height={28} className="h-7 w-7 flex-none rounded-md object-cover ring-1 ring-border" />
                    <span>
                      {e.company}
                      <span className="text-muted-foreground/70"> · {e.role}</span>
                    </span>
                  </span>
                  <span className="shrink-0 pl-10 font-mono text-[13px]/5 text-muted-foreground/70 sm:pl-0">{e.period}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <SectionHeading>A bit more about me</SectionHeading>
            {A.more.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="grid grid-cols-3 gap-x-1 gap-y-3 px-1 pb-2 pt-4 sm:gap-x-0 sm:gap-y-5 sm:px-2">
              {A.photos.map((ph, i) => (
                <div
                  key={ph.src}
                  style={{ ['--tilt' as string]: `${TILTS[i % TILTS.length]}deg` }}
                  className="relative rounded-lg bg-white p-1 shadow-[0_2px_6px_rgba(0,0,0,0.10),0_12px_28px_rgba(0,0,0,0.12)] ring-1 ring-black/5 [transform:rotate(var(--tilt))] motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-snap hover:z-10 motion-safe:hover:[transform:rotate(0deg)_scale(1.06)] sm:rounded-xl sm:p-2"
                >
                  <Image
                    src={ph.src}
                    alt={ph.alt}
                    width={1200}
                    height={1600}
                    sizes="(max-width: 640px) 33vw, 240px"
                    className="aspect-[4/5] w-full rounded-md object-cover sm:rounded-lg"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
