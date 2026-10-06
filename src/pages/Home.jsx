import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { site } from "../data/site";
import { homeProjects } from "../data/projects";
import Container from "../components/Container";
import Img from "../components/Img";
import Reveal from "../components/Reveal";

function Hero() {
  return (
    <Container className="pb-9 pt-6 md:pt-10">
      <div className="inline-block rounded-3xl bg-muted p-1">
        <img
          src={site.avatar}
          alt=""
          width="104"
          height="104"
          className="size-[104px] rounded-[20px] object-cover"
        />
      </div>
      <h1 className="mt-5 text-[1.25rem] leading-7 tracking-[-0.02em]">{site.name}</h1>
      <p className="t-small mt-3 text-muted-foreground">{site.location}</p>
      <p className="t-display mt-3">{site.headline}</p>
    </Container>
  );
}

const cardClass =
  "group block h-full rounded-2xl border border-border p-4 transition-colors duration-300";
const frameClass = "h-40 w-full overflow-hidden rounded-xl bg-muted";
const titleClass = "t-small mt-4 font-medium text-foreground";
const textClass = "t-small mt-2 text-foreground/75";

function ProjectCard({ p }) {
  if (p.kind === "case") {
    const cover = p.cardCover ?? p.cover;
    return (
      <Link to={`/projects/${p.slug}`} className={`${cardClass} hover:border-foreground/25`}>
        <div className={`${frameClass} ${cover ? "" : "grid place-items-center text-muted-foreground"}`}>
          {cover ? (
            <Img
              src={cover}
              alt=""
              className="size-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <span className="t-small">Images coming soon</span>
          )}
        </div>
        <h3 className={titleClass}>{p.cardTitle ?? p.title}</h3>
        <p className={textClass}>{p.blurb}</p>
      </Link>
    );
  }

  const placeholder = (
    <div className={`${frameClass} grid place-items-center text-muted-foreground`}>
      {p.kind === "locked" ? (
        <span className="flex items-center gap-2 t-small">
          <Lock className="size-4" strokeWidth={1.6} aria-hidden="true" />
          Password protected
        </span>
      ) : (
        <span className="t-small">Case study coming soon</span>
      )}
    </div>
  );

  if (p.kind === "locked") {
    return (
      <Link to={`/projects/${p.slug}`} className={`${cardClass} hover:border-foreground/25`}>
        {placeholder}
        <h3 className={titleClass}>{p.cardTitle}</h3>
        <p className={textClass}>{p.blurb}</p>
      </Link>
    );
  }

  return (
    <div className={cardClass}>
      {placeholder}
      <h3 className={titleClass}>{p.cardTitle}</h3>
      <p className={textClass}>{p.blurb}</p>
    </div>
  );
}

function Projects() {
  return (
    <Container className="pb-12">
      <section id="projects" className="border-t border-border pt-9">
        <h2 className="t-small uppercase tracking-[0.02em] text-muted-foreground">Projects</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {homeProjects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 120} className="h-full">
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </Container>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
    </>
  );
}
