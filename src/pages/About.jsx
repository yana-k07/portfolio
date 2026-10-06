import { CirclePlay } from "lucide-react";
import Container from "../components/Container";
import Img from "../components/Img";
import FactCard from "../components/FactCard";
import ToolLogos from "../components/ToolLogos";
import { Button } from "@/components/ui/button";
import { about } from "../data/about";
import { site } from "../data/site";

export default function About() {
  return (
    <Container className="pb-12 pt-6 md:pt-10">
      {/* The menu already says where you are, so the page title is hidden visually but kept for screen readers. */}
      <h1 className="sr-only">About</h1>

      <div role="list" className="grid gap-2 sm:grid-cols-3">
        {about.facts.map((f) => (
          <div role="listitem" key={f.label} className="contents">
            <FactCard label={f.label} value={f.tools ? <ToolLogos ids={f.tools} /> : f.value} />
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="t-chapter mb-4">How I work</h2>
        <div className="space-y-4">
          {about.work.map((t) => (
            <p key={t} className="t-body">{t}</p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="t-chapter mb-4">Outside work</h2>
        <p className="t-body">{about.outside.text}</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <a
            href={site.youtube}
            {...(site.youtube.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            <CirclePlay />
            {about.outside.linkLabel}
          </a>
        </Button>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {about.photos.map((src) => (
            <Img
              key={src}
              src={src}
              alt=""
              className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
          ))}
        </div>
        <p className="mt-3 t-small italic text-muted-foreground">{about.photosCaption}</p>
      </section>
    </Container>
  );
}
