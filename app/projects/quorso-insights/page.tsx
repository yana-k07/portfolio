import type { Metadata } from 'next'
import { BackLink } from '@/components/ui/BackLink'
import { CopyEmailButton } from '@/components/ui/CopyEmailButton'
import { PageHeader } from '@/components/ui/PageHeader'
import { glassPill, glassPillFace, glassPillShadow } from '@/components/ui/button-styles'
import { SiteBar } from '@/components/site/SiteBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { AVATAR, EMAIL, EMAIL_ADDRESS, NAME, navWith } from '@/lib/site'
import { cn } from '@/lib/utils'

// The case shared on request: what it is, and two ways to ask for it.
export const metadata: Metadata = {
  title: 'Quorso: insights',
  description: 'An insights feature for Quorso. Available on request.',
}

export default function QuorsoInsights() {
  const subject = encodeURIComponent('Access to the Quorso insights case')
  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      <SiteBar name={NAME} avatar={AVATAR} nav={navWith('Projects')} mailto={EMAIL} />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
        <BackLink href="/#projects">← Projects</BackLink>
        <PageHeader title="Quorso: insights" lede="An insights feature. Available on request." />

        <section className="rounded-xl border border-border bg-card p-6">
          <LockIcon className="h-5 w-5 text-muted-foreground/70" />
          <h2 className="mt-4 text-base font-semibold leading-snug text-foreground">This case is password protected</h2>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Send me a message and I will share access and walk you through the work.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={`${EMAIL}?subject=${subject}`}
              target="_blank"
              rel="noreferrer"
              className={cn(glassPill, 'h-9 px-4')}
              style={{ background: glassPillFace }}
            >
              <span aria-hidden="true" className="absolute inset-0 rounded-full" style={{ boxShadow: glassPillShadow }} />
              <span className="relative">Request access</span>
            </a>
            <CopyEmailButton email={EMAIL_ADDRESS} />
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
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
