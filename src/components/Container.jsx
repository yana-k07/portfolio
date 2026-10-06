// The single narrow, centred column used on every page: content is 640px wide.
export default function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-full max-w-[calc(640px+3rem)] px-6 ${className}`}>{children}</div>
  );
}
