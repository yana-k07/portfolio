import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useParams } from "react-router-dom";
import { findLocked, findProject } from "../data/projects";
import BackLink from "../components/BackLink";
import Locked from "./Locked";
import Img from "../components/Img";
import Container from "../components/Container";
import FactCard from "../components/FactCard";
import ResultCard from "../components/ResultCard";
import BeforeAfter from "../components/BeforeAfter";
import PhoneScroll from "../components/PhoneScroll";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NotFound from "./NotFound";

// **double asterisks** in text become bold, so key phrases are easy to scan.
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

// Image with caption. Click to enlarge; add `big: true` for wide diagrams that should open at full size.
function ImageBlock({ b }) {
  return (
    <Dialog>
      <figure className="py-2">
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`Enlarge image${b.caption ? `: ${b.caption}` : ""}`}
            className="block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border"
          >
            <Img
              src={b.src}
              alt={b.caption ?? ""}
              className="h-auto w-full"
              placeholderClassName="aspect-[16/10] w-full"
            />
          </button>
        </DialogTrigger>
        {b.caption && <figcaption className="mt-3 text-xs leading-4 italic text-muted-foreground">{b.caption}</figcaption>}
      </figure>

      <DialogContent
        showCloseButton={false}
        className="w-auto max-w-[calc(100vw-2rem)] gap-0 border-0 bg-transparent p-0 shadow-none sm:max-w-[calc(100vw-4rem)]"
      >
        <DialogTitle className="sr-only">{b.caption ?? "Image"}</DialogTitle>
        <DialogDescription className="sr-only">Enlarged image. Press Escape to close.</DialogDescription>
        <div className="max-h-[90vh] overflow-auto rounded-xl">
          <img
            src={b.src}
            alt={b.caption ?? ""}
            className={b.big ? "max-w-none" : "mx-auto max-h-[88vh] w-auto max-w-full"}
          />
        </div>
        <DialogClose asChild>
          <Button variant="secondary" size="sm" className="absolute top-3 right-3 px-3 py-2">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

// Screen recording: plays silently in a loop while it is on screen, with a pause button.
// Visitors who prefer reduced motion get the still poster and a play button instead.
function VideoBlock({ b }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.4 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <figure className="py-2">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          poster={b.poster}
          aria-label={b.caption}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="block h-auto w-full"
        >
          {b.webm && <source src={b.webm} type="video/webm" />}
          <source src={b.src} type="video/mp4" />
        </video>
      </div>
      {/* Controls sit under the recording, next to the caption, so they never cover the interface in it. */}
      <div className="mt-3 flex items-center justify-between gap-4">
        {b.caption ? <figcaption className="text-xs leading-4 italic text-muted-foreground">{b.caption}</figcaption> : <span />}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          className="grid size-8 flex-none place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </figure>
  );
}

function Block({ b }) {
  switch (b.type) {
    case "h3":
      return <h3 className="mt-2 text-sm leading-6 font-medium">{b.text}</h3>;
    case "image":
      return <ImageBlock b={b} />;
    case "video":
      return <VideoBlock b={b} />;
    case "phone":
      return <PhoneScroll header={b.header} body={b.body} caption={b.caption} />;
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag className={`space-y-2 pl-5 text-sm leading-6 marker:text-muted-foreground ${b.ordered ? "list-decimal" : "list-disc"}`}>
          {b.items.map((it) => (
            <li key={it}>{inline(it)}</li>
          ))}
        </Tag>
      );
    }
    case "stats":
      // One soft panel split into columns: numbers on top, labels pinned to the bottom so they line up.
      return (
        <figure>
          <dl
            className={`grid overflow-hidden rounded-2xl bg-muted divide-y divide-border sm:divide-x sm:divide-y-0 ${
              b.items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            {b.items.map((it) => {
              const pct = it.value.endsWith("%");
              const main = pct ? it.value.slice(0, -1) : it.value;
              return (
                <div key={it.label} className="flex min-h-40 flex-col-reverse justify-between gap-8 p-6">
                  <dt className="t-small text-muted-foreground">
                    {it.label}
                    {it.note && <span className="t-small mt-1 block text-muted-foreground/80">{it.note}</span>}
                  </dt>
                  <dd className="text-[2rem] leading-8 tracking-[-0.04em]">
                    {main}
                    {pct && <span className="ml-1 text-[0.55em] text-muted-foreground">%</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
          {b.caption && (
            <figcaption className="mt-3 text-xs leading-4 italic text-muted-foreground">{b.caption}</figcaption>
          )}
        </figure>
      );
    case "quote":
      return (
        <figure className="border-l-2 border-border py-1 pl-6">
          <blockquote className="text-base leading-6">“{b.text}”</blockquote>
          {(b.author || b.role) && (
            <figcaption className="t-small mt-3 text-muted-foreground">
              {[b.author, b.role].filter(Boolean).join(", ")}
            </figcaption>
          )}
        </figure>
      );
    default:
      return <p className="text-sm leading-6">{inline(b.text)}</p>;
  }
}

export default function Case() {
  const { slug } = useParams();
  const locked = findLocked(slug);
  if (locked) return <Locked project={locked} />;
  const project = findProject(slug);
  if (!project) return <NotFound />;

  return (
    <Container className="pb-12 pt-6 md:pt-10">
      <BackLink className="mb-6" />
      <h1 className="t-display">
        {project.title}
      </h1>

      <p className="mt-4 text-base leading-6 text-foreground/75">
        {project.summary}
      </p>

      {project.link && (
        <a
          href={project.link.url}
          target="_blank"
          rel="noreferrer"
          className="t-small mt-3 inline-block text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {project.link.label}
        </a>
      )}

      <div role="list" className="mt-8 grid gap-2 sm:grid-cols-3">
        {project.results
          ? project.results.map((r) => (
              <div role="listitem" key={r.label} className="contents">
                <ResultCard {...r} />
              </div>
            ))
          : project.meta.map((m) => (
              <div role="listitem" key={m.label} className="contents">
                <FactCard label={m.label} value={m.value} />
              </div>
            ))}
      </div>

      {project.compare ? (
        <figure className="mt-8">
          <BeforeAfter {...project.compare} />
          {project.compare.caption && (
            <figcaption className="mt-3 text-xs leading-4 italic text-muted-foreground">
              {project.compare.caption}
            </figcaption>
          )}
        </figure>
      ) : project.cover ? (
        <Img
          src={project.cover}
          alt={`${project.title} cover`}
          className={`mt-8 w-full rounded-2xl border border-border ${project.coverNatural ? "h-auto" : "aspect-[16/10] object-cover"}`}
        />
      ) : null}

      <div className="mt-10 space-y-10">
        {project.chapters.map((c) => (
          <section key={c.id} id={c.id}>
            <h2 className="t-chapter mb-4">
              {c.title}
            </h2>
            <div className="space-y-4">
              {c.blocks.map((b, i) => (
                <Block key={i} b={b} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
