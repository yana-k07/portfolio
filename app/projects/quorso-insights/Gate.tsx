'use client'

import { useActionState } from 'react'
import { CopyEmailButton } from '@/components/ui/CopyEmailButton'
import { glassPill, glassPillFace, glassPillShadow, outlinePill } from '@/components/ui/button-styles'
import { cn } from '@/lib/utils'
import { unlock } from './actions'

// The lock screen: the password field first, and a way to ask for it.
export function Gate({ email, emailAddress }: { email: string; emailAddress: string }) {
  const [state, action, pending] = useActionState(unlock, { error: false })
  const subject = encodeURIComponent('Access to the Quorso insights case')
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <LockIcon className="h-5 w-5 text-muted-foreground/70" />
      <h2 className="mt-4 text-base font-semibold leading-snug text-foreground">This case is password protected</h2>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">Enter the password I shared with you.</p>

      <form action={action} className="mt-5 flex max-w-md flex-wrap gap-2">
        <label htmlFor="case-password" className="sr-only">
          Password
        </label>
        <input
          id="case-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.error || undefined}
          aria-describedby={state.error ? 'case-password-error' : undefined}
          className={cn(
            'h-9 min-w-0 flex-1 rounded-full border bg-background px-4 text-[14px] text-foreground outline-none placeholder:text-muted-foreground/60 focus-visible:outline-2 focus-visible:outline-foreground',
            state.error ? 'border-red-500' : 'border-border'
          )}
          placeholder="Password"
        />
        <button type="submit" disabled={pending} className={cn(glassPill, 'h-9 px-4 disabled:opacity-60')} style={{ background: glassPillFace }}>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: glassPillShadow }} />
          <span className="relative">{pending ? 'Opening…' : 'Open case'}</span>
        </button>
      </form>
      {state.error && (
        <p id="case-password-error" role="alert" className="mt-2 text-[14px]/5 text-red-600 dark:text-red-400">
          That password did not work. Check it and try again.
        </p>
      )}

      <div className="mt-6 border-t border-border pt-5">
        <p className="text-[14px]/5 text-muted-foreground">No password yet? Send me a message and I will share access.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={`${email}?subject=${subject}`} target="_blank" rel="noreferrer" className={cn(outlinePill, 'h-9')}>
            Request access
          </a>
          <CopyEmailButton email={emailAddress} />
        </div>
      </div>
    </section>
  )
}

function LockIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="3" y="7" width="10" height="7" rx="2" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}
