import type { ReactNode } from 'react'

/** Images and clips stay inside the reading column, the same width as the text. */
export function Breakout({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

/** The case's third level: 16px semibold, weight carries it over the body. */
export function Sub({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-base font-semibold leading-snug text-foreground">{children}</h3>
}

/** A paragraph still to write. Shows as a dashed note until the real text replaces it. */
export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border px-3 py-2 font-mono text-[13px]/5 text-muted-foreground/70">
      {children}
    </p>
  )
}
