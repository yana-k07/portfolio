import { Link } from '@/components/ui/Link'
import { EMAIL, LINKEDIN, NAME } from '@/lib/site'

// Her footer: one quiet line, the copyright left, Email and LinkedIn right.
export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-3xl px-6 pb-26">
      {/* The rule spans the text column only, like the content above it. */}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-[13px]/4 text-muted-foreground/70">
          © {new Date().getFullYear()} {NAME}
        </p>
        <div className="flex items-center gap-4 text-[13px]/4">
          {/* A plain anchor: mailto is not a route, so it skips the Next.js Link. */}
          <a href={EMAIL} className="link-hover-effect text-muted-foreground underline-offset-2">
            Email
          </a>
          {LINKEDIN && (
            <Link href={LINKEDIN} variant="muted" target="_blank" rel="noopener noreferrer">
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}
