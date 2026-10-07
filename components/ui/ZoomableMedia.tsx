'use client'

import Image from 'next/image'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { MediaViewer, type MediaViewerSlide } from '@/components/ui/MediaViewer'

type Zoom =
  | { type: 'image'; src: string; alt: string; width: number; height: number }
  | { type: 'video'; src: string; poster?: string }

// One image or clip, full screen: the slide sits in the centre under this cap.
const FRAME_H = 'min(86vh, 1080px)'

// Wraps a thumbnail (image or video) with the site's media pattern: the zoom-in
// cursor, and a click opens it in MediaViewer, the same viewer the galleries use,
// as a single slide. No hover effect (the page dim was removed on 2026-10-04).
// ProjectImage goes through here too, so all content media behaves the same.
export function ZoomableMedia({
  children,
  zoom,
  label = 'Open full screen',
  caption,
}: {
  children: ReactNode
  zoom: Zoom
  label?: string
  /** Shown bottom-left in the viewer. */
  caption?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(true)
          }
        }}
        aria-label={label}
        className="relative block h-full w-full cursor-zoom-in"
      >
        {children}
      </div>

      {/* Portalled to body: a transformed ancestor (Reveal) would otherwise trap
          the viewer's fixed positioning inside itself. */}
      {open &&
        createPortal(
          <MediaViewer
            label={zoom.type === 'image' ? zoom.alt : label}
            initialIndex={0}
            onClose={() => setOpen(false)}
            // One slide: centre it on the track instead of padding for neighbours.
            trackStyle={{ '--frame-h': FRAME_H, justifyContent: 'center' } as CSSProperties}
            slides={[slideFor(zoom, label, caption)]}
          />,
          document.body
        )}
    </>
  )
}

function slideFor(zoom: Zoom, label: string, caption?: string): MediaViewerSlide {
  if (zoom.type === 'image') {
    const ratio = zoom.width / zoom.height
    return {
      key: zoom.src,
      name: label,
      caption,
      // Height first, width from the image's own ratio, never wider than the window.
      style: { aspectRatio: `${zoom.width} / ${zoom.height}`, width: `min(92vw, calc(var(--frame-h) * ${ratio}))` },
      content: (
        <span className="img-outline relative block h-full w-full overflow-hidden rounded-xl bg-muted">
          <Image src={zoom.src} alt={zoom.alt} fill sizes="92vw" className="object-cover" />
        </span>
      ),
    }
  }

  // A clip's ratio isn't known up front: the slide takes the frame's height and
  // the video its own width. Opened on purpose, so it plays, but never under
  // reduced motion (the site-wide rule); the controls are there either way.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return {
    key: zoom.src,
    name: label,
    caption,
    style: { height: 'var(--frame-h)' },
    content: (
      <span className="img-outline block h-full overflow-hidden rounded-xl bg-muted">
        <video
          src={zoom.src}
          poster={zoom.poster}
          className="block h-full w-auto max-w-[92vw] object-contain"
          autoPlay={!reduced}
          muted
          loop
          playsInline
          controls
        />
      </span>
    ),
  }
}
