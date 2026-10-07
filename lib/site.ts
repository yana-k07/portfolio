// Every address the two pages use, in one place.

/** The current portfolio. Resume, About and the other cases still open there. */
export const SITE = 'https://portfolio-chi-three-v3juc2ul5i.vercel.app'

export const ASSETS = '/assets' // images and clips live in public/assets/
export const asset = (file: string) => `${ASSETS}/${file}`

export const NAME = 'Yana Kovalova'
export const AVATAR = asset('avatar-DL9M3YyB.jpg')
export const EMAIL = 'mailto:yana.kovalyova2409@gmail.com'
/** TODO: the profile URL (the current site's link is empty). */
export const LINKEDIN = 'https://www.linkedin.com/'
export const RESUME = `${SITE}/resume`
export const ABOUT = `${SITE}/about`

export const NAV = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Resume', href: RESUME },
  { label: 'About', href: ABOUT },
]
