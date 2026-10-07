import Image from 'next/image'
import { LazyAutoplayVideo } from '@/components/ui/LazyAutoplayVideo'
import { cn } from '@/lib/utils'

/* A real device mockup around one screen export: the screenshot sits UNDER the
   frame PNG (public/mockups/iphone-air.png, transparent screen area), so the
   bezel, island, and buttons all come from the photo of the device.

   The insets are the measured bounds of the transparent screen hole in the
   source file (87px bezel on all sides of a 1801×3711 canvas). Re-measure if
   the mockup asset changes. The screen hole ratio is 0.46; slightly wider
   exports (iPhone Pro, 402×844) lose ~1.7% per side to object-cover. */
const FRAME_SRC = '/mockups/iphone-air.png'
// Inline style, not a Tailwind class: template-literal classes never compile.
const FRAME_RATIO = '1801 / 3711'
const SCREEN_INSET_X = '4.83%'
const SCREEN_INSET_Y = '2.34%'
// Corner radius of the screen hole (~170px in source), as ellipse percentages.
const SCREEN_RADIUS = '10.4% / 4.8%'

export function PhoneFrame({
  src,
  alt,
  sizes = '180px',
  className,
  long,
  scroll = false,
  video,
}: {
  src: string
  alt: string
  sizes?: string
  className?: string
  /** Pixel size of an export taller than one device screen (a full page capture). */
  long?: { width: number; height: number }
  /** Let a long screen scroll inside the frame instead of showing only its top. */
  scroll?: boolean
  /** A screen recording to play inside the device instead of the still (`src` stays as its fallback). */
  video?: { src: string; poster: string }
}) {
  return (
    <div className={cn('relative', className)} style={{ aspectRatio: FRAME_RATIO }}>
      <div
        className="absolute overflow-hidden bg-muted"
        style={{
          left: SCREEN_INSET_X,
          right: SCREEN_INSET_X,
          top: SCREEN_INSET_Y,
          bottom: SCREEN_INSET_Y,
          borderRadius: SCREEN_RADIUS,
        }}
      >
        {video ? (
          <LazyAutoplayVideo src={video.src} poster={video.poster} autoplay decorative className="h-full w-full object-cover object-top" />
        ) : long && scroll ? (
          /* The whole page scrolls inside the device, the way it does on a phone.
             `data-screen-scroll` lets a parent tell this apart from its own scroll. */
          <div
            data-screen-scroll
            className="h-full w-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <Image
              src={src}
              alt={alt}
              width={long.width}
              height={long.height}
              sizes={sizes}
              className="h-auto w-full"
            />
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            // A long screen is anchored to its top; a normal one is centred.
            className={cn('object-cover', long && 'object-top')}
          />
        )}
      </div>
      <Image
        src={FRAME_SRC}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className="pointer-events-none select-none object-contain"
      />
    </div>
  )
}
