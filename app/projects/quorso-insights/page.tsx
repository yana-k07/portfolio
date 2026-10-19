import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { BackLink } from '@/components/ui/BackLink'
import { CaseView } from '@/components/ui/CaseView'
import { SiteBar } from '@/components/site/SiteBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { QUORSO_INSIGHTS } from '@/lib/quorso-insights'
import { AVATAR, NAME, navWith } from '@/lib/site'
import { ACCESS_COOKIE, hasAccess } from './access'
import { Gate } from './Gate'

// The password-protected case. Rendered on the server per request: without the
// access cookie the content is never sent, only the lock screen.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quorso: insights',
  description: 'An insights feature for Quorso. Password protected.',
  robots: { index: false, follow: false },
}

export default async function QuorsoInsights() {
  const open = hasAccess((await cookies()).get(ACCESS_COOKIE)?.value)
  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      <SiteBar name={NAME} avatar={AVATAR} nav={navWith('Projects')} />
      {open ? (
        <CaseView c={QUORSO_INSIGHTS} />
      ) : (
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
          <BackLink href="/#projects">← Projects</BackLink>
          <div className="mt-8">
            <Gate />
          </div>
        </div>
      )}
      <SiteFooter />
    </main>
  )
}
