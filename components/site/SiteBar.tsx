'use client'

import { useEffect, useRef, useState } from 'react'
import NextLink from 'next/link'
import { glassPill, glassPillFace, glassPillShadow } from '@/components/ui/button-styles'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './ThemeToggle'

// The sticky bar: the name as the wordmark (the avatar on phones), three nav
// pills, the email pill and the theme switch. Transparent at the top, frosted
// once the page has moved (.site-header-scrolled in globals.css).
const FROST_ON = 28
const FROST_OFF = 12

const pill =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-1.5 text-[12px]/4 font-medium transition-[background-color,color,scale] ease-snap active:scale-[0.97] sm:px-3.5 sm:text-[13px]/4'

export function SiteBar({
  name,
  avatar,
  nav,
  mailto,
}: {
  name: string
  /** The face stands in for the wordmark on phones, where three pills, the
   *  email pill and the switch leave no room for a two-word name. */
  avatar: string
  nav: { label: string; href: string; active?: boolean }[]
  mailto: string
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
      <nav aria-label="Main" className="mx-auto flex h-[60px] w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <NextLink href="/" className="hidden whitespace-nowrap text-[16px] font-medium tracking-tight text-foreground md:block">
            {name}
          </NextLink>
          <NextLink href="/" aria-label={`${name}, home`} className="block shrink-0 md:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- her file, from her deployment */}
            <img src={avatar} alt="" width={32} height={32} className="h-7 w-7 rounded-full object-cover shadow-sm sm:h-8 sm:w-8" />
          </NextLink>
          <div className="scrollbar-hide flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1">
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
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a href={mailto} className={cn(glassPill, 'h-9 px-4')} style={{ background: glassPillFace }}>
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: glassPillShadow }} />
            <span className="relative">Email</span>
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
