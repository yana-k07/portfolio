import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// A phone whose screen scrolls through a tall screenshot on its own.
// The status bar and app header stay put (`header`); only the content below them (`body`) scrolls.
const SCREEN_RATIO = 844 / 390; // iPhone screen height / width

export default function PhoneScroll({ header, body, caption }) {
  const [dims, setDims] = useState({ w: 390, h: 164, b: 1327 });
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(true);
  const frame = useRef(null);

  // Pause while off screen, to save battery.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // How far the content has to move so its end reaches the bottom of the screen.
  const visible = SCREEN_RATIO * dims.w - dims.h;
  const travel = Math.max(0, ((dims.b - visible) / dims.b) * 100);

  return (
    <figure className="py-2">
      <div ref={frame} className="flex justify-center rounded-2xl border border-border bg-muted py-8">
        <div className="phone">
          <div className="phone-screen">
            <span className="phone-island" aria-hidden="true" />
            <img
              src={header}
              alt=""
              draggable={false}
              className="phone-header"
              onLoad={(e) => setDims((d) => ({ ...d, w: e.target.naturalWidth, h: e.target.naturalHeight }))}
            />
            <div className="phone-body">
              <img
                src={body}
                alt={caption ?? ""}
                draggable={false}
                className="phone-body-inner"
                style={{ "--travel": `${travel}%`, animationPlayState: playing && inView ? "running" : "paused" }}
                onLoad={(e) => setDims((d) => ({ ...d, w: e.target.naturalWidth, b: e.target.naturalHeight }))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        {caption ? <figcaption className="text-xs leading-4 italic text-muted-foreground">{caption}</figcaption> : <span />}
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause scrolling" : "Play scrolling"}
          className="grid size-8 flex-none place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </figure>
  );
}
