import { cn } from '@/lib/utils'

/* A FigJam-style synthesis board: a dotted canvas, one titled section per
   group, sticky notes inside. Stickies keep their paper colours and dark ink
   in both themes, as they do on a real board; only the canvas follows the
   theme. Pure markup, no client JS. Section titles are not headings, so the
   table of contents ignores them. */

export type StickyColor = 'yellow' | 'blue' | 'green' | 'pink' | 'violet' | 'orange'

const STICKY: Record<StickyColor, string> = {
  yellow: '#FFE38F',
  blue: '#B8DDFF',
  green: '#BDEDC4',
  pink: '#FFC8E8',
  violet: '#DCCBFF',
  orange: '#FFCDA8',
}

export interface Sticky {
  text: string
  color?: StickyColor
  /** A small label under the text, e.g. "Takeaway". */
  tag?: string
}

export interface BoardSection {
  title: string
  note?: string
  color: StickyColor
  stickies: Sticky[]
}

export function InsightBoard({ sections, caption }: { sections: BoardSection[]; caption?: string }) {
  return (
    <figure className="space-y-2">
      <div
        className="img-outline space-y-8 rounded-xl bg-muted px-4 pb-6 pt-9 sm:px-6"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 16%, transparent) 1px, transparent 1.2px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '10px 10px',
        }}
      >
        {sections.map((s) => (
          <div key={s.title} className="relative">
            {/* The section name sits on the frame's top edge, like a FigJam section. */}
            <p
              className="absolute -top-3 left-3 flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[13px]/5 font-medium text-[#1e1e1e]"
              style={{ backgroundColor: STICKY[s.color] }}
            >
              {s.title}
              {s.note && <span className="font-normal opacity-60">{s.note}</span>}
            </p>
            <ul
              className="grid grid-cols-2 gap-3 rounded-lg border bg-background/70 p-3 pt-5 sm:grid-cols-3 sm:gap-4 sm:p-4 sm:pt-6"
              style={{ borderColor: STICKY[s.color] }}
            >
              {s.stickies.map((n, i) => (
                <li
                  key={i}
                  className={cn(
                    'flex min-h-36 flex-col justify-between gap-3 rounded-[3px] p-3 text-[14px]/5 text-[#1e1e1e] sm:aspect-square sm:min-h-0 sm:p-4',
                    'shadow-[0_1px_2px_rgba(0,0,0,0.08),0_3px_8px_rgba(0,0,0,0.08)]'
                  )}
                  style={{ backgroundColor: STICKY[n.color ?? s.color] }}
                >
                  <span>{n.text}</span>
                  {n.tag && <span className="text-[12px]/4 font-medium opacity-55">{n.tag}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {caption && <figcaption className="text-[14px]/5 text-muted-foreground/70">{caption}</figcaption>}
    </figure>
  )
}
