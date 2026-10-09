// Every address the site uses, in one place.

export const ASSETS = '/assets' // images and clips live in public/assets/
export const asset = (file: string) => `${ASSETS}/${file}`

export const NAME = 'Yana Kovalova'
export const AVATAR = asset('avatar-DL9M3YyB.jpg')
export const EMAIL_ADDRESS = 'yana.kovalyova2409@gmail.com'
export const EMAIL = `mailto:${EMAIL_ADDRESS}`
/** TODO: the profile URL. */
export const LINKEDIN = 'https://www.linkedin.com/'
export const RESUME = '/resume'
export const ABOUT = '/about'
/** TODO: put the PDF in public/ under this name. */
export const RESUME_PDF = '/Yana-Kovalova-Resume.pdf'
/** TODO: the channel URL. The YouTube button on About appears once this is set. */
export const YOUTUBE = ''

/** The Resume page is hidden for now: off the nav and 404 at /resume. Set true to bring it back. */
export const SHOW_RESUME = false

export const NAV = [
  { label: 'Projects', href: '/#projects' },
  ...(SHOW_RESUME ? [{ label: 'Resume', href: RESUME }] : []),
  { label: 'About', href: ABOUT },
]

/** The nav with one item marked as the current page. */
export const navWith = (active: string) => NAV.map((item) => ({ ...item, active: item.label === active }))
