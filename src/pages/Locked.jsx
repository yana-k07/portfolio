import { useState } from "react";
import { Check, Copy, Lock } from "lucide-react";
import Container from "../components/Container";
import BackLink from "../components/BackLink";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "../data/site";

// Page for a case that is shared on request. It never leaves the site, so there is always a way back.
export default function Locked({ project }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = site.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Container className="pb-12 pt-6 md:pt-10">
      <BackLink />
      <h1 className="t-display mt-6">{project.title}</h1>
      <p className="mt-4 text-base leading-6 text-foreground/75">{project.summary}</p>

      <Card className="mt-8 items-start gap-4 rounded-2xl p-6">
        <Lock className="size-6 text-muted-foreground" strokeWidth={1.6} aria-hidden="true" />
        <div>
          <h2 className="text-base leading-6 font-medium">This case is password protected</h2>
          <p className="t-small mt-2 text-foreground/75">
            Send me a message and I will share access and walk you through the work.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a
              href={`mailto:${site.email}?subject=Access to ${project.title} case`}
              target="_blank"
              rel="noreferrer"
            >
              Request access
            </a>
          </Button>
          <Button type="button" variant="outline" onClick={copy}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy email"}
          </Button>
        </div>
      </Card>
    </Container>
  );
}
