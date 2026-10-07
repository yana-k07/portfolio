import Image from 'next/image'
import { ZoomableMedia } from '@/components/ui/ZoomableMedia'

interface ProjectImageProps {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

// A case image with an optional caption. A click opens it full screen through
// ZoomableMedia (MediaViewer, one slide), the caption riding along.
export function ProjectImage({ src, alt, width, height, caption }: ProjectImageProps) {
  return (
    <figure className="my-2 space-y-2">
      <div className="img-outline overflow-hidden rounded-md">
        <ZoomableMedia
          label={`Open ${alt} fullscreen`}
          zoom={{ type: 'image', src, alt, width, height }}
          caption={caption}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 640px"
            className="w-full"
          />
        </ZoomableMedia>
      </div>
      {caption && <figcaption className="text-[14px]/5 text-muted-foreground/70">{caption}</figcaption>}
    </figure>
  )
}
