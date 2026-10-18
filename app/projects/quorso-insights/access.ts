import { createHash, timingSafeEqual } from 'node:crypto'

// The password lives only in the QUORSO_CASE_PASSWORD environment variable
// (Vercel → Settings → Environment Variables). Without it, nobody gets in.

export const ACCESS_COOKIE = 'qi_access'

const secret = () => process.env.QUORSO_CASE_PASSWORD ?? ''
const sha = (s: string) => createHash('sha256').update(s).digest()

export function passwordMatches(input: string) {
  const s = secret()
  if (!s) return false
  return timingSafeEqual(sha(input.trim()), sha(s))
}

/** What the cookie holds: a hash of the password, so changing it logs everyone out. */
export function accessToken() {
  return sha(`quorso-insights:${secret()}`).toString('hex')
}

/** Preview deployments sit behind Vercel's own login, so the case opens there
 *  without a password while it is being written. Production always asks. */
const isPreview = () => process.env.VERCEL_ENV === 'preview'

export function hasAccess(cookie: string | undefined) {
  if (isPreview()) return true
  return Boolean(secret()) && cookie === accessToken()
}
