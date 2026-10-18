import { Fragment, type ReactNode } from 'react'
import { BackLink } from '@/components/ui/BackLink'
import { Bullets, CaseMeta, SectionHeading } from '@/components/ui/CaseBlocks'
import { Breakout, DraftNote, Sub } from '@/components/ui/CaseLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { PhoneFrame } from '@/components/ui/PhoneFrame'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { PrototypeEmbed } from '@/components/ui/PrototypeEmbed'
import { TableOfContents } from '@/components/ui/TableOfContents'
import { outlinePill } from '@/components/ui/button-styles'
import type { Case, CaseBlock } from '@/lib/cases'
import { cn } from '@/lib/utils'

// The body of a data-driven case page (header, meta, cover, chapters), shared
// by /projects/[slug] and the password-protected Quorso insights case.

const WIDE = '(max-width: 1200px) 100vw, 1152px'

export function CaseView({ c }: { c: Case }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 md:pb-20 md:pt-14">
      <BackLink href="/#projects">← Projects</BackLink>

      <PageHeader title={c.title} lede={c.lede}>
        {c.link && (
          <a href={c.link.url} target="_blank" rel="noopener noreferrer" className={cn(outlinePill, 'h-8 px-3 font-medium')}>
            {c.link.label}
            <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </PageHeader>

      <article className="space-y-8 text-xs leading-relaxed text-muted-foreground [&_section>ol]:max-w-2xl [&_section>p]:max-w-2xl [&_section>ul]:max-w-2xl">
        <CaseMeta items={c.meta} />

        {c.cover && (
          <Breakout>
            <ProjectImage {...c.cover} sizes={WIDE} />
          </Breakout>
        )}

        {c.chapters.map((chapter) => (
          <Fragment key={chapter.id}>{renderChapter(chapter.title, chapter.blocks)}</Fragment>
        ))}
      </article>

      <TableOfContents />
    </div>
  )
}

// A chapter is a section with its heading; a wide screenshot breaks out of the
// reading column, so the blocks are split into sections around those images.
function renderChapter(title: string, blocks: CaseBlock[]) {
  const out: ReactNode[] = []
  let run: ReactNode[] = []
  let headed = false
  const flush = () => {
    if (!run.length && headed) return
    out.push(
      <section key={`s${out.length}`} className="space-y-4">
        {!headed && <SectionHeading>{title}</SectionHeading>}
        {run}
      </section>
    )
    headed = true
    run = []
  }
  blocks.forEach((b, i) => {
    if (b.type === 'image' && b.wide) {
      flush()
      out.push(
        <Breakout key={`w${i}`}>
          <ProjectImage src={b.src} alt={b.alt} width={b.width} height={b.height} caption={b.caption} sizes={WIDE} />
        </Breakout>
      )
    } else {
      run.push(<Block key={i} b={b} />)
    }
  })
  flush()
  return out
}

function Block({ b }: { b: CaseBlock }) {
  switch (b.type) {
    case 'p':
      return <p>{b.text}</p>
    case 'draft':
      return <DraftNote>{b.text}</DraftNote>
    case 'h3':
      return <Sub>{b.text}</Sub>
    case 'list':
      return b.ordered ? (
        <ol className="ml-4 list-decimal space-y-1.5 marker:text-muted-foreground/70">
          {b.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : (
        <Bullets items={b.items} />
      )
    case 'image':
      return <ProjectImage src={b.src} alt={b.alt} width={b.width} height={b.height} caption={b.caption} />
    case 'phone-video':
      return (
        <figure className="space-y-2">
          <div className="flex justify-center rounded-xl bg-muted px-6 py-10">
            <PhoneFrame src={b.poster} alt={b.alt} video={{ src: b.src, poster: b.poster }} sizes="280px" className="w-[280px]" />
          </div>
          {b.caption && <figcaption className="text-[14px]/5 text-muted-foreground/70">{b.caption}</figcaption>}
        </figure>
      )
    case 'compare':
      return <Compare b={b} />
    case 'prototype':
      return <PrototypeEmbed src={b.src} video={b.video} poster={b.poster} title={b.title} />
    case 'image-pair':
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {b.images.map((im) => (
            <ProjectImage key={im.src} {...im} sizes="(max-width: 640px) 100vw, 360px" />
          ))}
        </div>
      )
  }
}

// A small comparison table in the reading column: features down the side, one
// column per product, ours tinted. Scrolls sideways on narrow screens.
function Compare({ b }: { b: Extract<CaseBlock, { type: 'compare' }> }) {
  return (
    <figure className="space-y-2">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] border-collapse text-left text-[14px]/5">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 font-normal text-muted-foreground/70" />
              {b.columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={cn('p-3 font-medium text-foreground', i === b.highlight && 'bg-[color-mix(in_oklab,#ff7b00_9%,transparent)]')}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r.label} className="border-b border-border last:border-b-0">
                <th scope="row" className="p-3 font-normal text-muted-foreground">
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td
                    key={i}
                    className={cn(
                      'p-3',
                      v === 'No' ? 'text-muted-foreground/50' : 'text-foreground',
                      i === b.highlight && 'bg-[color-mix(in_oklab,#ff7b00_9%,transparent)] font-medium'
                    )}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {b.note && <figcaption className="text-[14px]/5 text-muted-foreground/70">{b.note}</figcaption>}
    </figure>
  )
}
