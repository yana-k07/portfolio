'use client'

import { useState } from 'react'
import { outlinePill } from '@/components/ui/button-styles'
import { cn } from '@/lib/utils'

// Copies the address, for visitors without a mail app set up.
export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const t = document.createElement('textarea')
      t.value = email
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button type="button" onClick={copy} className={cn(outlinePill, 'h-9')}>
      {copied ? 'Copied' : 'Copy email'}
    </button>
  )
}
