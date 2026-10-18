'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EMAIL_ADDRESS } from '@/lib/site'

// The Email buttons copy the address instead of opening a mail app. The label
// swaps to "Copied" for a moment; if the clipboard is unavailable, it shows
// the address itself so it can be copied by hand.
export function CopyEmail({ label, children, className, style, copiedLabel = 'Copied' }: { label: string; children?: ReactNode; className?: string; style?: React.CSSProperties; copiedLabel?: string }) {
  const [copied, setCopied] = useState<false | 'copied' | 'shown'>(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS)
      flash('copied', 2000)
    } catch {
      flash('shown', 6000)
    }
  }

  function flash(state: 'copied' | 'shown', ms: number) {
    setCopied(state)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), ms)
  }

  return (
    <button type="button" onClick={copy} className={className} style={style} title={`Copy ${EMAIL_ADDRESS}`}>
      {children}
      <span className="relative">{copied === 'copied' ? copiedLabel : copied === 'shown' ? EMAIL_ADDRESS : label}</span>
      <span className="sr-only" aria-live="polite">
        {copied === 'copied' ? `${EMAIL_ADDRESS} copied to clipboard` : copied === 'shown' ? EMAIL_ADDRESS : ''}
      </span>
    </button>
  )
}
