import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[calc(640px+3rem)] px-6 py-32">
      <h1 className="t-display">Page not found</h1>
      <p className="t-body mt-6 text-muted-foreground">This page doesn’t exist or has moved.</p>
      <Link to="/" className="t-ui mt-8 inline-block underline underline-offset-4">
        Back to home
      </Link>
    </div>
  );
}
