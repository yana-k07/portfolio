import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Fragment, type ReactNode } from 'react'
import { BackLink } from '@/components/ui/BackLink'
import { Bullets, CaseMeta, SectionHeading } from '@/components/ui/CaseBlocks'
import { Breakout, DraftNote, Sub } from '@/components/ui/CaseLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { PhoneFrame } from '@/components/ui/PhoneFrame'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { TableOfContents } from '@/components/ui/TableOfContents'
import { outlinePill } from '@/components/ui/button-styles'
import { SiteBar } from '@/components/site/SiteBar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { CASES, findCase, type CaseBlock } from '@/lib/cases'
import { AVATAR, EMAIL, NAME, navWith } from '@/lib/site'
import { cn } from '@/lib/utils'

// The cases ported from the first version (Yetlo, Organizer, the Quorso design
// system), in the same layout as the Tradezella case: text in the reading
// column, wide screenshots in the wide zone, every image opens full screen.
// The content lives in lib/cases.ts.

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = findCase((await params).slug)
  return c ? { title: c.title, description: c.lede } : {}
}

const WIDE = '(max-width: 1200px) 100vw, 1152px'

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = findCase((await params).slug)
  if (!c) notFound()

  return (
    <main id="main" className="min-h-screen bg-background text-foreground">
      <SiteBar name={NAME} avatar={AVATAR} nav={navWith('Projects')} mailto={EMAIL} />

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

      <SiteFooter />
    </main>
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
  }
}
