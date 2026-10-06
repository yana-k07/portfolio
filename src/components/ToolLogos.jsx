import { toolLogos } from "@/data/tool-logos";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// A row of tool logos. Muted by default, full colour of the text on hover; the name shows in a tooltip.
export default function ToolLogos({ ids }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-3">
      {ids
        .filter((id) => toolLogos[id])
        .map((id) => {
          const { title, path } = toolLogos[id];
          return (
            <li key={id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    role="img"
                    aria-label={title}
                    tabIndex={0}
                    className="block rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                      <path d={path} />
                    </svg>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
              </Tooltip>
            </li>
          );
        })}
    </ul>
  );
}
