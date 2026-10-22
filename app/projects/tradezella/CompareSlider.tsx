'use client'

import Image from 'next/image'
import { useRef, useState, type PointerEvent } from 'react'

type Side = { src: string; alt: string; width: number; height: number }

// Before / after on one frame: the "before" sits on top, clipped to the left
// of the handle, the "after" shows to its right (the labels sit the same way).
// Pointer events on the frame drive the clip, so a press anywhere jumps the
// divider there and a drag follows the finger or mouse (touch-action pan-y
// keeps vertical page scroll working on phones; iOS Safari will not drag a
// transparent range thumb). A visually hidden range input keeps the arrow
// keys and screen readers. Both exports must share a ratio (here 16:10).
export function CompareSlider({ before, after, label }: { before: Side; after: Side; label: string }) {
  const [pos, setPos] = useState(50)
  const frame = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const moveTo = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect()
    if (!r || r.width === 0) return
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX)
  }
  const onUp = () => {
    dragging.current = false
  }

  return (
    <div
      ref={frame}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="img-outline group/compare relative cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-xl bg-muted"
      style={{ aspectRatio: `${after.width} / ${after.height}` }}
    >
      <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1152px) 1104px, 100vw" className="object-cover" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1152px) 1104px, 100vw" className="object-cover" draggable={false} />
      </div>

      {/* The divider and its handle, drawn where the input's value is. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur-sm group-has-[input:focus-visible]/compare:outline group-has-[input:focus-visible]/compare:outline-2 group-has-[input:focus-visible]/compare:outline-foreground">
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
        className="sr-only"
      />
    </div>
  )
}
