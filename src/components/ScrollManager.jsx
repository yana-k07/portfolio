import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Scroll to top whenever the page changes (not on the very first load).
export default function ScrollManager() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.getElementById("root")?.scrollIntoView({ block: "start" });
  }, [pathname]);
  return null;
}
