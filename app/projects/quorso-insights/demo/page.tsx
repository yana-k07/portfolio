import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ACCESS_COOKIE, hasAccess } from '../access'
import Proto from './Proto'

// The live prototype, framed into the case page (and openable on its own).
// Same gate as the case: without access it sends you to the lock screen.
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Quorso insights prototype', robots: { index: false, follow: false } }

export default async function Demo() {
  if (!hasAccess((await cookies()).get(ACCESS_COOKIE)?.value)) redirect('/projects/quorso-insights')
  return <Proto />
}
