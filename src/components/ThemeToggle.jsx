import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// A single quiet icon: the sun in light mode, the moon in dark mode, swapping with a small turn.
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  // Stay in sync if the theme changes anywhere else.
  useEffect(() => {
    const el = document.documentElement;
    const mo = new MutationObserver(() => setDark(el.classList.contains("dark")));
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  };

  const icon = "absolute size-4 transition-all duration-300 motion-reduce:transition-none";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Sun className={`${icon} rotate-0 scale-100 dark:-rotate-90 dark:scale-0`} aria-hidden="true" />
      <Moon className={`${icon} rotate-90 scale-0 dark:rotate-0 dark:scale-100`} aria-hidden="true" />
    </button>
  );
}
