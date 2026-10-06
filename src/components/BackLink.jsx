import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// "Back to projects": goes home and scrolls to the project list.
export default function BackLink({ className = "" }) {
  const navigate = useNavigate();
  const go = (e) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => document.getElementById("projects")?.scrollIntoView(), 80);
  };
  return (
    <a
      href="/#projects"
      onClick={go}
      className={`t-small inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground ${className}`}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back to projects
    </a>
  );
}
