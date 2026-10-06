// Blurred colour behind the hero that drifts and blends. Decorative only.
export default function Aurora() {
  return (
    <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10">
      <span className="aurora-flow" />
      <span className="aurora-blob aurora-a" />
      <span className="aurora-blob aurora-b" />
      <span className="aurora-blob aurora-c" />
      <span className="aurora-blob aurora-d" />
    </div>
  );
}
