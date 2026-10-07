'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Plays a gentle fade-up (+ de-blur) the first time it scrolls into view by adding
// the `.reveal-in` keyframe class. The content is visible by default, so if JS never
// runs or the observer never fires, nothing is hidden. `delay` (ms) staggers siblings.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Hidden documents (background tabs, prerender, embedded previews) never
    // deliver IntersectionObserver callbacks — skip the entrance animation
    // there so the content is simply present.
    if (document.hidden) {
      setShown(true)
      return
    }
    // In view on mount, or already scrolled PAST (restored scroll position
    // after back-navigation puts earlier sections above the viewport, where
    // the observer would never fire) → show right away.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        // bottom < 0: scroll jumped past the element between mount and the
        // observer's first callback — reveal instead of stranding it hidden.
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    )
    observer.observe(el)
    // Returning from another page via bfcache restores the frozen page without
    // remounting; if the reveal never fired before leaving, show everything
    // rather than risk a blank section.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setShown(true)
    }
    window.addEventListener('pageshow', onPageShow)
    return () => {
      observer.disconnect()
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal', shown && 'reveal-in', className)}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
