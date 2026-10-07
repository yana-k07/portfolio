'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* One style for every floating circle control: strip arrows, viewer close + nav. */
export const circleButton =
  'flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-[opacity,scale] ease-snap active:scale-[0.97] motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40'

export interface MediaViewerSlide {
  /** Keyed by position, not just src — the same media can appear twice in a flow. */
  key: string
  /** What the slide button announces while it is not the centred one ("Show …"). */
  name: string
  /** Shown bottom-left while this slide is centred. */
  caption?: string
  /** Width and height of this slide on the track (var(--frame-*) from trackStyle). */
  style: CSSProperties
  content: ReactNode
}

/* The full-screen viewer: every slide sits on one horizontal track. The
   centred one is in focus, its neighbours are blurred back. Scrolling, the
   arrows, and the arrow keys all move the same track, so there is only one
   thing to follow. The caller shapes the slides and sizes them via
   `trackStyle` + each slide's `style`; pass several for a gallery.

   Single media (ZoomableMedia, ProjectImage) opens here as one slide: no
   arrows, no counter, and the slide is a plain box instead of a button, since
   there is no neighbour to move to and a clip's own controls must stay usable.

   A click on the slide in focus closes the viewer, like the click that opened
   it; a click on a blurred neighbour moves to it. Clips are the exception: a
   click on a video is aimed at its controls, so only ×, Esc and the ground
   close those. */
export function MediaViewer({
  slides,
  label,
  initialIndex,
  onClose,
  trackStyle,
}: {
  slides: MediaViewerSlide[]
  label: string
  initialIndex: number
  onClose: () => void
  /** Sizing vars + the horizontal padding that centres the first and last slide. */
  trackStyle: CSSProperties
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(initialIndex)

  /** Centre a slide. Instant when the viewer opens, animated for arrows and keys. */
  const goTo = useCallback((next: number, smooth = true) => {
    const track = trackRef.current
    const slide = track?.children[next] as HTMLElement | undefined
    if (!track || !slide) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2,
      behavior: smooth && !reduced ? 'smooth' : 'auto',
    })
    setIndex(next)
  }, [])

  // Land on the slide that was clicked, before the first paint.
  useLayoutEffect(() => {
    goTo(initialIndex, false)
  }, [goTo, initialIndex])

  // Follow the track: whichever slide is nearest the centre is the one in focus.
  const syncIndex = () => {
    const track = trackRef.current
    if (!track) return
    const centre = track.scrollLeft + track.clientWidth / 2
    let nearest = 0
    let best = Infinity
    for (let i = 0; i < track.children.length; i++) {
      const slide = track.children[i] as HTMLElement
      const distance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - centre)
      if (distance < best) {
        best = distance
        nearest = i
      }
    }
    setIndex(nearest)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goTo(Math.min(slides.length - 1, index + 1))
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goTo(Math.max(0, index - 1))
      }
    }
    // Resizing changes the padding, so the track would drift to a neighbour.
    const onResize = () => goTo(index, false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [goTo, index, onClose, slides.length])

  const current = slides[index]
  const single = slides.length === 1

  return (
    <div
      className="fade-in fixed inset-0 z-[10000] bg-background/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className={cn(circleButton, 'absolute right-4 top-4 z-10 md:right-6 md:top-6')}
      >
        <span aria-hidden="true" className="text-xs">
          ×
        </span>
      </button>

      <div
        ref={trackRef}
        onScroll={syncIndex}
        // A vertical wheel is the only way a mouse can move a horizontal track.
        onWheel={(e) => {
          const track = trackRef.current
          if (!track) return
          // A slide that scrolls internally (a long PhoneFrame capture) claims the
          // wheel via data-screen-scroll, all the way to its end. Handing the track
          // the leftover would jump sideways mid-read.
          if ((e.target as HTMLElement).closest?.('[data-screen-scroll]')) return
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) track.scrollLeft += e.deltaY
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        className="flex h-full snap-x snap-proximity items-center gap-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:gap-10 [&::-webkit-scrollbar]:hidden"
        style={trackStyle}
      >
        {slides.map((slide, i) =>
          single ? (
            <div
              key={slide.key}
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest('video')) onClose()
              }}
              className="shrink-0 cursor-zoom-out [&:has(video)]:cursor-auto"
              style={slide.style}
            >
              {slide.content}
            </div>
          ) : (
            <button
              key={slide.key}
              type="button"
              onClick={() => (i === index ? onClose() : goTo(i))}
              tabIndex={i === index ? -1 : 0}
              aria-label={i === index ? undefined : slide.name}
              aria-current={i === index}
              className={cn(
                'shrink-0 snap-center transition-[filter,opacity,scale] duration-300 ease-snap motion-reduce:transition-none',
                // The centred one closes on click, so it shows the zoom-out cursor.
                i === index ? 'cursor-zoom-out opacity-100' : 'scale-[0.92] opacity-40 blur-[6px]'
              )}
              style={slide.style}
            >
              {slide.content}
            </button>
          )
        )}
      </div>

      {!single &&
        (['left', 'right'] as const).map((side) => (
          <button
            key={side}
            type="button"
            onClick={() => goTo(side === 'left' ? index - 1 : index + 1)}
            disabled={side === 'left' ? index === 0 : index === slides.length - 1}
            aria-label={side === 'left' ? 'Previous slide' : 'Next slide'}
            className={cn(
              'absolute top-1/2 z-10 -translate-y-1/2',
              circleButton,
              side === 'left' ? 'left-4 md:left-6' : 'right-4 md:right-6'
            )}
          >
            <span aria-hidden="true" className="text-xs">
              {side === 'left' ? '←' : '→'}
            </span>
          </button>
        ))}

      <div className="absolute bottom-5 left-4 md:left-6">
        {current?.caption && (
          <p className="text-base font-medium text-foreground">{current.caption}</p>
        )}
        {!single && (
          <p className="mt-0.5 font-mono text-[13px]/5 text-muted-foreground/70">
            {index + 1} / {slides.length} · {label}
          </p>
        )}
      </div>
    </div>
  )
}
