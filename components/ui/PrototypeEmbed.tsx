'use client'

import { useEffect, useRef, useState } from 'react'

// A live prototype in an iframe. `desktop` renders it at a real desktop width
// (so its own breakpoints pick the desktop layout) and scales it to fit a
// wide zone; `mobile` shows it at phone size inside a simple device frame.

const DESKTOP_W = 1280
const DESKTOP_H = 860

export function PrototypeEmbed({ src, device, title }: { src: string; device: 'desktop' | 'mobile'; title: string }) {
  if (device === 'mobile') return <Phone src={src} title={title} />
  return <Desktop src={src} title={title} />
}

function Desktop({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.9)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / DESKTOP_W)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    // Breaks out of the reading column into a wider zone, centred on it.
    <div className="relative left-1/2 hidden w-[min(1152px,calc(100vw-48px))] -translate-x-1/2 md:block">
      <div ref={box} className="img-outline overflow-hidden rounded-xl bg-white" style={{ height: DESKTOP_H * scale }}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          style={{ width: DESKTOP_W, height: DESKTOP_H, transform: `scale(${scale})`, transformOrigin: '0 0', border: 0 }}
        />
      </div>
      <div className="mt-2 flex justify-end">
        <a href={src} target="_blank" rel="noreferrer" className="text-[14px]/5 text-muted-foreground/70 link-hover-effect">
          Open full screen ↗
        </a>
      </div>
    </div>
  )
}

function Phone({ src, title }: { src: string; title: string }) {
  return (
    <div className="flex justify-center rounded-xl bg-muted px-6 py-10">
      <div className="rounded-[44px] bg-[#111] p-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <div className="relative overflow-hidden rounded-[34px] bg-white" style={{ width: 360, height: 740 }}>
          <div aria-hidden="true" className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-[#111]" />
          <iframe src={src} title={title} loading="lazy" className="h-full w-full border-0 pt-10" />
        </div>
      </div>
    </div>
  )
}
