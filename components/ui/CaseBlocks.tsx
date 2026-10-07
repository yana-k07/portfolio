import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* Shared building blocks for case-study pages. Keep these presentational and
   data-free: pass content in via props. */

/** The 18px section head: case sections and the Projects head on the home page. */
export const sectionHeading = 'text-lg font-semibold leading-snug tracking-tight text-foreground'

export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('pt-4', sectionHeading, className)}>{children}</h2>
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1.5 marker:text-muted-foreground/70">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export function Num({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>
}

/** Inline code token, e.g. <C>bg-action-strong</C>. */
export function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground">
      {children}
    </code>
  )
}

/** A still-to-fill value inside the meta strip. Replace with the real text. */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-dashed border-border px-1.5 py-0.5 font-mono text-[13px]/4 text-muted-foreground/70">
      {children}
    </span>
  )
}

/** The Role · Period · … strip below the summary. */
export function CaseMeta({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-5 sm:grid-cols-4">
      {items.map((m) => (
        <div key={m.label}>
          <dt className="text-[14px]/5 text-muted-foreground/70">
            {m.label}
          </dt>
          <dd className="mt-1 text-xs text-foreground">{m.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A labelled cluster of headline numbers (e.g. "System" / "Product"). */
export function StatGroup({
  label,
  stats,
}: {
  label: string
  stats: { value: string; label: string }[]
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 text-[14px]/5 text-muted-foreground/70">
        {label}
      </div>
      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-xl font-semibold leading-tight tracking-tight text-foreground tabular-nums">{s.value}</div>
            <div className="mt-0.5 text-[14px]/5 text-muted-foreground/70">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Scaffolding for an asset still to be captured. Remove each one as the real
 *  ProjectImage / VideoPlayer lands. */
export function AssetPlaceholder({
  kind = 'image',
  title,
  expects,
  file,
  specs,
  optional = false,
}: {
  kind?: 'image' | 'video'
  /** Short name of the shot. */
  title: string
  /** Exactly what I expect you to capture here. */
  expects: string
  /** Where the file should land in /public. */
  file: string
  /** Format / size hint. */
  specs?: string
  optional?: boolean
}) {
  return (
    <div
      className={cn(
        'flex min-h-[200px] flex-col justify-between gap-5 rounded-xl border border-dashed p-5',
        optional ? 'border-border/60 bg-muted/20' : 'border-border bg-muted/30'
      )}
    >
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-[13px]/4 text-muted-foreground/70">
        {kind === 'video' ? '◍ video' : '⬚ image'} · {optional ? 'optional' : 'to capture'}
      </span>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-foreground">{title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{expects}</p>
      </div>

      <div className="space-y-0.5 font-mono text-[13px]/5 text-muted-foreground/70">
        <div>→ {file}</div>
        {specs && <div>{specs}</div>}
      </div>
    </div>
  )
}

/** A real code excerpt with an optional file/language header.
 *  Pass `html` (pre-highlighted by highlightCode) for syntax colours, or
 *  `code` for a plain monochrome fallback. */
export function CodeBlock({
  html,
  code,
  lang,
  file,
}: {
  /** Pre-highlighted HTML from highlightCode(). Preferred. */
  html?: string
  /** Plain code, rendered without highlighting. Fallback. */
  code?: string
  /** Language label shown on the right of the header, e.g. "Swift". */
  lang?: string
  /** File path shown on the left of the header. */
  file?: string
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-muted">
      {(file || lang) && (
        <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-2 font-mono text-[13px]/5 text-muted-foreground/70">
          <span className="truncate">{file}</span>
          {lang && <span className="shrink-0">{lang}</span>}
        </figcaption>
      )}
      {html ? (
        <div
          tabIndex={0}
          className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed [&_pre]:m-0 [&_pre]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre tabIndex={0} className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground">
          <code>{code}</code>
        </pre>
      )}
    </figure>
  )
}
