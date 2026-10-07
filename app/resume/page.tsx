import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { outlinePill } from '@/components/ui/button-styles'
import { SiteBar } from '@/components/site/SiteBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { EXPERIENCE } from '@/lib/experience'
import { AVATAR, EMAIL, NAME, RESUME_PDF, navWith } from '@/lib/site'
import { cn } from '@/lib/utils'

// Experience, newest first: the company, the role and the period, one line on the work.
export const metadata: Metadata = {
  title: 'Resume, Yana Kovalova',
  description: 'Experience of Yana Kovalova, product designer.',
}

export default function Resume() {
  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      <SiteBar name={NAME} avatar={AVATAR} nav={navWith('Resume')} mailto={EMAIL} />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
        <PageHeader title="Resume" lede="Product designer with 5+ years of experience in complex B2B products.">
          {RESUME_PDF && (
            <a href={RESUME_PDF} target="_blank" rel="noreferrer" className={cn(outlinePill, 'h-9')}>
              Download resume
            </a>
          )}
        </PageHeader>

        <section aria-labelledby="experience">
          <h2 id="experience" className="text-lg font-semibold leading-snug tracking-tight text-foreground">
            Experience
          </h2>
          <ul className="mt-2">
            {EXPERIENCE.map((job) => (
              <li key={job.id} className="flex items-start gap-4 border-b border-border py-5 last:border-b-0">
                <span className="grid h-11 w-11 flex-none place-items-center overflow-hidden rounded-xl border border-border bg-white">
                  {job.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- small logo, already sized
                    <img src={job.logo} alt="" width={44} height={44} className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <span className="text-sm text-neutral-500">{job.company.charAt(0)}</span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-base font-semibold text-foreground">{job.company}</span>
                    <span className="text-[14px]/5 text-muted-foreground">{job.role}</span>
                    <span className="font-mono text-[13px]/5 text-muted-foreground/70">{job.period}</span>
                  </div>
                  <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">{job.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <SiteFooter />
    </main>
  )
}
