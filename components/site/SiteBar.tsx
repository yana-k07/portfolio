'use client'

import { useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import { glassPill, glassPillFace, glassPillShadow } from '@/components/ui/button-styles'
import { cn } from '@/lib/utils'
import { EMAIL } from '@/lib/site'
import { ThemeToggle } from './ThemeToggle'

// The sticky bar: the name as the wordmark on the left (on phones too, so the
// face is not shown twice on the home page);
// the page links, the email pill and the theme switch on the right. Transparent at the top, frosted
// once the page has moved (.site-header-scrolled in globals.css).
const FROST_ON = 28
const FROST_OFF = 12

const pill =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-2.5 text-[13px]/4 font-medium min-[380px]:px-3.5 transition-[background-color,color,scale] ease-snap active:scale-[0.97]'

export function SiteBar({
  name,
  nav,
}: {
  name: string
  /** Kept for the callers; the bar shows the name on every screen. */
  avatar?: string
  nav: { label: string; href: string; active?: boolean }[]
}) {
  const [frosted, setFrosted] = useState(false)
  const frostRef = useRef(false)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      const frost = frostRef.current ? y > FROST_OFF : y >= FROST_ON
      if (frost !== frostRef.current) {
        frostRef.current = frost
        setFrosted(frost)
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className={cn('site-header sticky top-0 z-40 border-b border-transparent', frosted && 'site-header-scrolled')}>
      <nav aria-label="Main" className="mx-auto flex h-[60px] w-full max-w-4xl items-center justify-between gap-3 px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <NextLink href="/" className="whitespace-nowrap text-[15px] font-medium tracking-tight text-foreground sm:text-[16px]">
            {name}
          </NextLink>
        </div>

        <div className="flex shrink-0 items-center gap-1 min-[380px]:gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={cn(
                  pill,
                  item.active
                    ? 'bg-foreground/[0.06] text-foreground dark:bg-foreground/10'
                    : 'text-foreground/60 hover:bg-foreground/[0.06] hover:text-foreground dark:hover:bg-foreground/10'
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
          <a href={EMAIL} className={cn(glassPill, 'h-9 px-4')} style={{ background: glassPillFace }}>
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: glassPillShadow }} />
            <span className="relative">Email</span>
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
