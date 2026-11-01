import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import { CommandPalette } from "./components/CommandPalette";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Stack } from "./sections/Stack";
import { Education } from "./sections/Education";
import { Achievements } from "./sections/Achievements";
import { Contact } from "./sections/Contact";
import { scrollToSection } from "./utils/scroll";

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleNavigate = useCallback((href: string) => {
    scrollToSection(href);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-[#080b14] text-slate-50 no-scroll-x focus:outline-none"
      >
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Stack />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
}

export default App;
