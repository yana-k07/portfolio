'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn, slugifyHeading } from '@/lib/utils'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

// Enough clearance for the sticky header when a heading is scrolled to.
const HEADING_OFFSET = 96

/**
 * A quiet table of contents for long pages: one dash per heading, the one you
 * are reading marked, the whole list on hover.
 *
 * Headings are read from the rendered DOM rather than passed in, so a case page
 * gets its contents by writing sections, with nothing to keep in sync. Under
 * three headings there is nothing worth listing, so it renders nothing. It also
 * needs a gutter to live in, hence desktop only.
 *
 * `variant="list"` is the same contents for a page with a side panel (articles):
 * no gutter is free there, so the titles sit in the panel as a plain list, always
 * readable, the section you are reading in the foreground. From `lg`, like the
 * panel beside the text; under the article it would point back up the page.
 */
export function TableOfContents({
  selector = 'article',
  variant = 'rail',
}: {
  selector?: string
  variant?: 'rail' | 'list'
}) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState(0)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const root = document.querySelector(selector)
    if (!root) return
    const found = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[]
    setHeadings(
      found.map((el, i) => {
        if (!el.id) el.id = slugifyHeading(el.textContent ?? '') || `section-${i}`
        return {
          id: el.id,
          text: el.textContent?.trim() ?? '',
          level: el.tagName === 'H3' ? 3 : 2,
        }
      })
    )
  }, [selector])

  // The section you are reading is the last heading above the offset line.
  const sync = useCallback(() => {
    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      let next = 0
      headings.forEach((heading, i) => {
        const el = document.getElementById(heading.id)
        if (el && el.getBoundingClientRect().top <= HEADING_OFFSET + 8) next = i
      })
      setActive(next)
    })
  }, [headings])

  useEffect(() => {
    if (headings.length === 0) return
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [headings, sync])

  if (headings.length < 3) return null

  if (variant === 'list') {
    return (
      <nav aria-labelledby="on-this-page" className="hidden lg:block">
        <h2 id="on-this-page" className="text-[14px]/5 text-muted-foreground/70">
          On this page
        </h2>
        <ul className="mt-3 space-y-1.5">
          {headings.map((heading, i) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={i === active ? 'location' : undefined}
                className={cn(
                  'block text-pretty text-[14px]/5 transition-colors hover:text-foreground',
                  heading.level === 3 && 'pl-3',
                  i === active ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <nav
      aria-label="On this page"
      // Collapsed vs. expanded is pure CSS off `group`: hover for a pointer,
      // focus-within for a keyboard. No state, so no re-render on mouse move.
      // Lives in the left gutter: 38rem clears half the 3xl column plus the list
      // itself. Below xl there is no gutter to live in.
      className="group fixed top-1/2 z-30 hidden max-h-[70vh] w-52 -translate-y-1/2 overflow-y-auto overscroll-contain [scrollbar-width:none] xl:block [&::-webkit-scrollbar]:hidden"
      style={{ left: 'max(1.5rem, calc(50vw - 38rem))' }}
    >
      <ul>
        {headings.map((heading, i) => (
          <li key={heading.id} className="relative flex h-5 items-center">
            {/* The dash and the title share the row, so nothing moves between states. */}
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute h-0.5 rounded-full transition-[opacity,background-color] duration-200 ease-snap group-hover:opacity-0 group-focus-within:opacity-0 motion-reduce:transition-none',
                heading.level === 3 ? 'left-3 w-2.5' : 'left-0 w-4',
                i === active ? 'bg-foreground' : 'bg-muted-foreground/30'
              )}
            />
            {/* Kept in the tab order while collapsed: tabbing here is what opens
                the list for a keyboard user, the way hovering does for a mouse. */}
            <a
              href={`#${heading.id}`}
              className={cn(
                '-mx-2 pointer-events-none block w-full truncate rounded-md px-2 py-0.5 text-[14px]/5 opacity-0 outline-none transition-[opacity,color,background-color] duration-200 ease-snap hover:bg-muted focus-visible:bg-muted motion-reduce:transition-none',
                'group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100',
                heading.level === 3 && 'pl-5',
                i === active ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
