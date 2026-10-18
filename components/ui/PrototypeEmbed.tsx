'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LazyAutoplayVideo } from '@/components/ui/LazyAutoplayVideo'
import { cn } from '@/lib/utils'

// A live prototype behind a looping walkthrough clip. The clip sits in the
// reading column like any other image; clicking it opens the prototype over
// the whole page, where a toggle switches between the desktop layout and the
// same prototype at phone size. The iframe loads only once it is opened.

type View = 'desktop' | 'mobile'

export function PrototypeEmbed({ src, video, poster, title }: { src: string; video: string; poster: string; title: string }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open the interactive prototype: ${title}`}
        className="group relative block w-full overflow-hidden rounded-xl text-left"
      >
        <LazyAutoplayVideo src={video} poster={poster} autoplay decorative className="img-outline aspect-[8/5] w-full rounded-xl bg-white object-cover" />
        <span className="pointer-events-none absolute inset-0 rounded-xl bg-black/0 transition-colors duration-200 group-hover:bg-black/[0.04]" />
        <span className="pointer-events-none absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#111]/90 px-4 py-2 text-[14px]/5 font-medium text-white shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-snap motion-safe:group-hover:scale-[1.04]">
          <PlayIcon />
          Try the prototype
        </span>
      </button>
      {open && <Viewer src={src} title={title} onClose={() => { setOpen(false); trigger.current?.focus() }} />}
    </>
  )
}

function Viewer({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  const [view, setView] = useState<View>('desktop')
  const [narrow, setNarrow] = useState(false)
  const close = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    close.current?.focus()
    return () => {
      mq.removeEventListener('change', sync)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  // On a phone the prototype already renders its mobile layout full screen.
  const phoneFrame = view === 'mobile' && !narrow

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[100] flex flex-col bg-background">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <p className="min-w-0 flex-1 truncate text-[14px]/5 font-medium">{title}</p>
        {!narrow && (
          <div role="radiogroup" aria-label="View" className="flex rounded-lg bg-muted p-1">
            {(['desktop', 'mobile'] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={view === v}
                onClick={() => setView(v)}
                className={cn(
                  'rounded-md px-3 py-1 text-[14px]/5 capitalize transition-colors',
                  view === v ? 'bg-background font-medium shadow-[0_1px_2px_rgba(0,0,0,0.08)]' : 'text-muted-foreground/80 hover:text-foreground'
                )}
              >
                {v}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-1 justify-end">
          <button
            ref={close}
            type="button"
            onClick={onClose}
            aria-label="Close prototype"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className={cn('relative min-h-0 flex-1', phoneFrame && 'flex items-center justify-center overflow-auto bg-muted p-6')}>
        {phoneFrame ? (
          <div className="shrink-0 rounded-[44px] bg-[#111] p-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <div className="relative overflow-hidden rounded-[34px] bg-white" style={{ width: 375, height: 'min(780px, calc(100dvh - 140px))' }}>
              <div aria-hidden="true" className="absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-[#111]" />
              <iframe key="mobile" src={src} title={`${title}, mobile`} className="h-full w-full border-0 pt-10" />
            </div>
          </div>
        ) : (
          <iframe key="desktop" src={src} title={title} className="absolute inset-0 h-full w-full border-0 bg-white" />
        )}
      </div>
    </div>,
    document.body
  )
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M3 1.8v8.4a.6.6 0 0 0 .9.52l7-4.2a.6.6 0 0 0 0-1.04l-7-4.2A.6.6 0 0 0 3 1.8Z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" />
    </svg>
  )
}
