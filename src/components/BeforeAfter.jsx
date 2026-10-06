import { useCallback, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";

// Before / after comparison: drag the handle (or use the arrow keys) to reveal one image over the other.
// Both images must share the same aspect ratio (16:10).
export default function BeforeAfter({ before, after, beforeAlt = "", afterAlt = "" }) {
  const [pos, setPos] = useState(50); // % of the frame that shows the "before" image
  const box = useRef(null);
  const dragging = useRef(false);

  const moveTo = useCallback((clientX) => {
    const r = box.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e) => dragging.current && moveTo(e.clientX);
  const stop = () => (dragging.current = false);

  const onKeyDown = (e) => {
    const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[e.key];
    if (step) setPos((p) => Math.min(100, Math.max(0, p + step)));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  const label =
    "pointer-events-none absolute bottom-4 rounded-full bg-background/85 px-3 py-1 text-xs leading-4 backdrop-blur transition-opacity duration-200";

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label="Before and after comparison. Use the left and right arrow keys."
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`${Math.round(pos)}% of the before image shown`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      onKeyDown={onKeyDown}
      style={{ touchAction: "pan-y" }}
      className="relative aspect-[16/10] w-full cursor-ew-resize overflow-hidden rounded-2xl bg-muted select-none"
    >
      <img src={after} alt={afterAlt} draggable={false} className="absolute inset-0 size-full object-cover object-top" />
      <img
        src={before}
        alt={beforeAlt}
        draggable={false}
        className="absolute inset-0 size-full object-cover object-top"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <span className={`${label} left-4`} style={{ opacity: pos > 14 ? 1 : 0 }}>
        Before
      </span>
      <span className={`${label} right-4`} style={{ opacity: pos < 86 ? 1 : 0 }}>
        After
      </span>

      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
        <div className="absolute top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-foreground shadow-sm">
          <ChevronsLeftRight className="size-4" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
