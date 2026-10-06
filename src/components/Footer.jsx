import Container from "./Container";
import { site } from "../data/site";

export default function Footer() {
  const linkedin = site.socials.find((s) => s.id === "linkedin");
  const external = (url) => (url?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {});
  const link = "text-foreground transition-colors hover:text-muted-foreground";
  return (
    <footer>
      <Container className="pb-10 pt-8">
        <div className="t-small flex items-center justify-between gap-4 border-t border-border pt-7">
          <span className="text-foreground">© {new Date().getFullYear()}</span>
          <div className="flex items-center gap-5">
            <a href={`mailto:${site.email}`} target="_blank" rel="noreferrer" className={link}>
              Email
            </a>
            {linkedin && (
              <a href={linkedin.url} {...external(linkedin.url)} className={link}>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
