import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// The block every inner page opens with: the title at 24px semibold tight
// (one size on every breakpoint), an optional lede
// at 16px muted (max ~70ch), and an optional row under them (link pills,
// buttons). No page sets its own h1 size.
export function PageHeader({
  title,
  lede,
  children,
  className,
}: {
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('mb-8 md:mb-10', className)}>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
        {title}
      </h1>
      {lede && (
        <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
          {lede}
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </header>
  )
}
