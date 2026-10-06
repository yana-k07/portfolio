import { Download } from "lucide-react";
import Container from "../components/Container";
import Experience from "../components/Experience";
import { experience } from "../data/experience";
import { site } from "../data/site";
import { Button } from "@/components/ui/button";

export default function Resume() {
  return (
    <Container className="pb-12 pt-6 md:pt-10">
      {/* The menu already says where you are, so the page title is hidden visually but kept for screen readers. */}
      <h1 className="sr-only">Resume</h1>

      <div className="flex items-center justify-between gap-4">
        <h2 className="t-chapter">Experience</h2>
        {site.resumeUrl && (
          <Button asChild variant="outline" size="sm">
            <a href={site.resumeUrl} target="_blank" rel="noreferrer">
              <Download />
              Download resume
            </a>
          </Button>
        )}
      </div>

      <Experience items={experience} />
    </Container>
  );
}
