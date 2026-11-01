import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { BottomNav } from "./components/BottomNav";
import { Footer } from "./components/Footer";
import { PageBackground } from "./components/PageBackground";
import { CustomCursor } from "./components/CustomCursor";
import { CommandPalette } from "./components/CommandPalette";
import { IntroOverlay } from "./components/IntroOverlay";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Stack } from "./sections/Stack";
import { Education } from "./sections/Education";
import { Achievements } from "./sections/Achievements";
import { Contact } from "./sections/Contact";
import { scrollToSection } from "./utils/scroll";
import { shouldShowIntro } from "./utils/intro";

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Seeded from the same check the overlay makes, so repeat visits and
  // reduced-motion users get an un-gated hero without waiting for a signal
  // that is never coming.
  const [introDone, setIntroDone] = useState(() => !shouldShowIntro());

  const handleIntroDone = useCallback(() => setIntroDone(true), []);

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
      <PageBackground />
      <IntroOverlay onDone={handleIntroDone} />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen text-text-primary no-scroll-x focus:outline-none"
      >
        <Hero introDone={introDone} />
        <About />
        <Projects />
        <Skills />
        <Stack />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      {/* Outside `main`, which clips on the x axis and would anchor a fixed
          child to itself rather than to the viewport. */}
      <BottomNav />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
}

export default App;
