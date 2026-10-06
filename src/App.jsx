import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollManager from "./components/ScrollManager";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import Case from "./pages/Case";
import About from "./pages/About";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <TooltipProvider delayDuration={150}>
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/projects/:slug" element={<Case />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </TooltipProvider>
  );
}
