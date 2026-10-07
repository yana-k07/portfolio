import { Link } from '@/components/ui/Link'
import { EMAIL, LINKEDIN, NAME } from '@/lib/site'

// Her footer: one quiet line, the copyright left, Email and LinkedIn right.
export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl border-t border-border px-4 pb-26 pt-6 sm:px-6">
      <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-[13px]/4 text-muted-foreground/70">
          © {new Date().getFullYear()} {NAME}
        </p>
        <div className="flex items-center gap-4 text-[13px]/4">
          <Link href={EMAIL} variant="muted">
            Email
          </Link>
          <Link href={LINKEDIN} variant="muted" target="_blank" rel="noopener noreferrer">
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
