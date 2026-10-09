import Image from 'next/image'
import type { ReactNode } from 'react'
import { Link } from '@/components/ui/Link'
import { cn } from '@/lib/utils'

// The project card on the home page: one `rounded-2xl` card, media on top,
// one quiet meta line, the title as the site Link stretched over the whole
// card (so the card stays one valid anchor), and its type on explicit sizes:
// 16px title, 14px everything else.

/** `sizes` for a tile image in the 1 → 4 column masonry. */
export const TILE_IMAGE_SIZES =
  '(min-width: 1680px) 396px, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

export const tileMeta = 'text-[14px]/5 text-muted-foreground/70'

export function Tile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <article
      className={cn(
        'group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card transition-[border-color,box-shadow] duration-300 hover:border-muted-foreground/40 hover:shadow-[0_2px_6px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_6px_rgba(0,0,0,0.3),0_12px_32px_rgba(0,0,0,0.45)]',
        className
      )}
    >
      {children}
    </article>
  )
}

/** A cover image at the given ratio (`width / height`, 16:9 without one), zooming a touch on hover. */
export function TileCover({
  src,
  width,
  height,
  alt = '',
}: {
  src: string
  width?: number
  height?: number
  /** Empty by default: the tile's title carries the meaning. */
  alt?: string
}) {
  return (
    <div className="w-full overflow-hidden bg-muted" style={{ aspectRatio: width && height ? `${width} / ${height}` : '16 / 9' }}>
      <Image
        src={src}
        alt={alt}
        width={width ?? 640}
        height={height ?? 360}
        sizes={TILE_IMAGE_SIZES}
        className="h-full w-full object-cover transition-transform duration-200 ease-snap group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  )
}

/** The tile's title: the site Link, stretched over the card via its ::after. */
export function TileTitle({ href, external, children }: { href: string; external?: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="mt-3 self-start text-[16px]/6 font-medium after:absolute after:inset-0 after:content-['']"
    >
      {children}
      {external && (
        <>
          <span aria-hidden="true"> ↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      )}
    </Link>
  )
}
