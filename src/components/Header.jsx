import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

// scrollIntoView also works when the page sits inside a frame whose outer page does the scrolling
// (as in the preview), where window.scrollTo only moves the inner frame.
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("root")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const itemClass =
  "relative z-10 block rounded-full px-3 py-2 text-[13px] leading-4 transition-colors duration-200";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // On the home page we are at "Home" while the top of the page is on screen, and at "Projects" after that.
  // An invisible marker over the top of the page does the measuring, so it works at any window height
  // (a "middle of the screen" line breaks on tall windows, where the projects are already past the middle).
  const [section, setSection] = useState("home");
  useEffect(() => {
    if (pathname !== "/") return;
    const marker = document.createElement("div");
    marker.setAttribute("aria-hidden", "true");
    marker.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:160px;pointer-events:none;opacity:0";
    document.body.appendChild(marker);
    const io = new IntersectionObserver(([entry]) =>
      setSection(entry.isIntersecting ? "home" : "projects")
    );
    io.observe(marker);
    return () => {
      io.disconnect();
      marker.remove();
    };
  }, [pathname]);

  const active =
    pathname === "/"
      ? section
      : pathname === "/about"
        ? "about"
        : pathname === "/resume"
          ? "resume"
          : pathname.startsWith("/projects/")
            ? "projects"
            : null;

  // Sliding dark pill behind the active item.
  const refs = useRef({});
  const activeRef = useRef(active);
  activeRef.current = active;
  const [box, setBox] = useState(null);
  const measure = useCallback(() => {
    const el = activeRef.current ? refs.current[activeRef.current] : null;
    const next = el ? { x: el.offsetLeft, w: el.offsetWidth } : null;
    // Only update when something changed, otherwise this would re-render forever.
    setBox((prev) => (prev?.x === next?.x && prev?.w === next?.w ? prev : next));
  }, []);
  useLayoutEffect(() => {
    measure();
  }, [active, measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Works with both BrowserRouter and HashRouter: go home first if needed, then scroll.
  const goTo = (id) => (e) => {
    e.preventDefault();
    // Light the clicked item right away: on a tall window the page may be too short to scroll at all.
    setSection(id === "projects" ? "projects" : "home");
    if (pathname !== "/") navigate("/");
    setTimeout(
      () => (id ? document.getElementById(id)?.scrollIntoView() : scrollToTop()),
      pathname !== "/" ? 60 : 0
    );
  };

  const state = (key) =>
    active === key ? "text-background" : "text-muted-foreground hover:text-foreground";
  const current = (key) => (active === key ? (key === "projects" ? "location" : "page") : undefined);

  return (
    <header className="pointer-events-none sticky top-0 z-30">
      {/* Whatever scrolls under the header dissolves into blur, fading out toward its bottom edge. */}
      <div aria-hidden="true" className="header-blur absolute inset-x-0 top-0 -bottom-8" />
      <div className="relative mx-auto flex w-full max-w-[calc(640px+3rem)] items-center justify-between px-6 pt-4 pb-4 md:pt-6">
        <nav aria-label="Main" className="pointer-events-auto">
          <ul className="relative flex items-center rounded-full bg-muted/90 p-1 backdrop-blur">
            <span
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-0 rounded-full bg-foreground transition-[transform,width,opacity] duration-300 ease-out motion-reduce:transition-none"
              style={{
                width: box?.w ?? 0,
                transform: `translateX(${box?.x ?? 0}px)`,
                opacity: box ? 1 : 0,
              }}
            />
            <li ref={(el) => (refs.current.home = el)}>
              <a href="/" onClick={goTo(null)} aria-current={current("home")} className={`${itemClass} ${state("home")}`}>
                Home
              </a>
            </li>
            <li ref={(el) => (refs.current.projects = el)}>
              <a href="/#projects" onClick={goTo("projects")} aria-current={current("projects")} className={`${itemClass} ${state("projects")}`}>
                Projects
              </a>
            </li>
            <li ref={(el) => (refs.current.resume = el)}>
              <Link to="/resume" aria-current={current("resume")} className={`${itemClass} ${state("resume")}`}>
                Resume
              </Link>
            </li>
            <li ref={(el) => (refs.current.about = el)}>
              <Link to="/about" aria-current={current("about")} className={`${itemClass} ${state("about")}`}>
                About
              </Link>
            </li>
          </ul>
        </nav>

        <div className="pointer-events-auto -mr-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
