'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { MouseEvent } from 'react'
import { Link } from './Link'

interface BackLinkProps {
  href?: string
  children?: React.ReactNode
}

// Back is hidden on the home page and shown on the deeper pages (cases).
const HIDE_ON = new Set(['/'])

export function BackLink({ href = '/', children = '← Back' }: BackLinkProps) {
  const router = useRouter()
  const pathname = usePathname()

  if (HIDE_ON.has(pathname)) return null

  // Go back in history only for a plain click and only when the previous
  // page was ours; modifier clicks keep the browser's own behaviour and a
  // visitor arriving from elsewhere lands on the href, not off the site.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    const cameFromHere = document.referrer.startsWith(window.location.origin)
    if (cameFromHere && window.history.length > 1) {
      event.preventDefault()
      router.back()
    }
  }

  return (
    <div className="mb-8">
      <Link href={href} variant="muted" onClick={handleClick}>
        {children}
      </Link>
    </div>
  )
}
