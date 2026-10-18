'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ACCESS_COOKIE, accessToken, passwordMatches } from './access'

// Checks the password on the server and, if it matches, leaves a signed cookie
// for 30 days so the case opens straight away next time.
export async function unlock(_prev: { error: boolean }, form: FormData) {
  const password = String(form.get('password') ?? '')
  if (!passwordMatches(password)) return { error: true }
  ;(await cookies()).set(ACCESS_COOKIE, accessToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/projects/quorso-insights',
    maxAge: 60 * 60 * 24 * 30,
  })
  redirect('/projects/quorso-insights')
}
