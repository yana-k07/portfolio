'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// Inline video with the site-wide hover contract: at rest a paused grayscale
// frame of the clip itself, and while the pointer is over it (or a wrapping
// `group`) it plays in colour from that exact frame — pausing keeps the frame,
// so the start is always seamless. The `#t=0.001` media fragment makes
// browsers paint the first frame with just metadata (Safari won't otherwise).
//
// `autoplay` opts a clip out of hover-gated playback (the case clips): it
// plays whenever visible, like ambient footage, in colour. On touch devices
// (no hover) every clip plays while visible, in colour too — a grayscale
// "hover me" cue with nothing to hover would never lift.
//
// Under `prefers-reduced-motion` nothing plays: the poster (or first frame)
// stands in for the clip. Loading stays lazy: the src and the poster attach
// only when the video scrolls near the viewport.
export function LazyAutoplayVideo({
  src,
  poster,
  className,
  autoplay = false,
  decorative = false,
}: {
  src: string
  poster?: string
  className?: string
  /** Play whenever visible instead of waiting for hover (ambient footage). */
  autoplay?: boolean
  /** Hide from assistive tech when the tile's text carries the meaning. */
  decorative?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hoverPlay = !autoplay && window.matchMedia('(hover: hover)').matches
    const play = () => {
      if (!reduced) el.play().catch(() => {})
    }
    const pause = () => el.pause()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true) // attach src + poster on first approach
          if (!hoverPlay) play()
        } else {
          pause()
        }
      },
      // start fetching a little before it enters the viewport
      { rootMargin: '200px 0px' }
    )
    observer.observe(el)

    if (hoverPlay) {
      el.addEventListener('pointerenter', play)
      el.addEventListener('pointerleave', pause)
    }

    return () => {
      observer.disconnect()
      if (hoverPlay) {
        el.removeEventListener('pointerenter', play)
        el.removeEventListener('pointerleave', pause)
      }
    }
  }, [autoplay])

  // The observer's play() can fire before React has attached the src (state
  // update lands a tick later) — once it is attached, start non-hover-gated
  // playback for real.
  useEffect(() => {
    const el = ref.current
    if (!el || !active) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hoverPlay = !autoplay && window.matchMedia('(hover: hover)').matches
    if (!hoverPlay && !reduced) el.play().catch(() => {})
  }, [active, autoplay])

  return (
    <video
      ref={ref}
      src={active ? `${src}#t=0.001` : undefined}
      // Posters are exported first frames of their clips, so playback
      // continues from what is visible — same no-jump contract everywhere.
      poster={active ? poster : undefined}
      aria-hidden={decorative || undefined}
      className={cn(
        // Grayscale marks "paused — hover me"; ambient autoplay footage is
        // already moving, so it plays in colour from the start, and so does
        // everything on a touch screen.
        !autoplay &&
          'grayscale transition-[filter] duration-200 hover:grayscale-0 group-hover:grayscale-0 motion-reduce:transition-none [@media(hover:none)]:grayscale-0',
        className
      )}
      muted
      loop
      playsInline
      preload="none"
    />
  )
}
