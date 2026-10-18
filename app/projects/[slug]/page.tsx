import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseView } from '@/components/ui/CaseView'
import { SiteBar } from '@/components/site/SiteBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { CASES, findCase } from '@/lib/cases'
import { AVATAR, EMAIL, NAME, navWith } from '@/lib/site'

// The cases ported from the first version (Yetlo, Organizer, the Quorso design
// system), in the same layout as the Tradezella case: text in the reading
// column, wide screenshots in the wide zone, every image opens full screen.
// The content lives in lib/cases.ts; the layout in components/ui/CaseView.tsx.

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = findCase((await params).slug)
  return c ? { title: c.title, description: c.lede } : {}
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = findCase((await params).slug)
  if (!c) notFound()

  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      <SiteBar name={NAME} avatar={AVATAR} nav={navWith('Projects')} mailto={EMAIL} />
      <CaseView c={c} />
      <SiteFooter />
    </main>
  )
}
