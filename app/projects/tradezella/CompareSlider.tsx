'use client'

import Image from 'next/image'
import { useState } from 'react'

type Side = { src: string; alt: string; width: number; height: number }

// Before / after on one frame: the "before" sits on top, clipped to the left
// of the handle, the "after" shows to its right (the labels sit the same way).
// A native range input covers the whole frame and drives the clip,
// so dragging, clicking anywhere and the arrow keys all work with no pointer
// code of our own. Both exports must share a ratio (here 16:10).
export function CompareSlider({ before, after, label }: { before: Side; after: Side; label: string }) {
  const [pos, setPos] = useState(50)

  return (
    <div
      className="img-outline relative select-none overflow-hidden rounded-xl bg-muted"
      style={{ aspectRatio: `${after.width} / ${after.height}` }}
    >
      <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1152px) 1104px, 100vw" className="object-cover" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1152px) 1104px, 100vw" className="object-cover" draggable={false} />
      </div>

      {/* The divider and its handle, drawn where the input's value is. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur-sm">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M6 4 2 8l4 4M10 4l4 4-4 4" />
          </svg>
        </span>
      </div>

      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[13px]/4 text-foreground backdrop-blur-sm">
        Before
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[13px]/4 text-foreground backdrop-blur-sm">
        After
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={pos}
        onChange={(event) => setPos(Number(event.target.value))}
        aria-label={label}
        aria-valuetext={`${Math.round(pos)}% of the frame shows the before`}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent [&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
      />
    </div>
  )
}
