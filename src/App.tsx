import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { BottomNav } from "./components/BottomNav";
import { Footer } from "./components/Footer";
import { PageBackground } from "./components/PageBackground";
import { CustomCursor } from "./components/CustomCursor";
import { CursorStage } from "./collab/CursorStage";
import { RebuildControls } from "./collab/RebuildControls";
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

  // ── Reconstruction playback ────────────────────────────────────────────
  // The stage owns the hide/reveal attributes while mounted, so "Go Live" is
  // simply an unmount: its cleanup strips every attribute and the real
  // portfolio is fully visible and interactive again. "Replay" remounts it
  // under a fresh key, which re-scans the DOM and starts from a blank page.
  const [live, setLive] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tour, setTour] = useState(false);

  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  const handleReplay = useCallback(() => {
    setLive(false);
    setPaused(false);
    setTour(false);
    setReplayKey((key) => key + 1);
    // `html` carries `scroll-behavior: smooth`, so a plain scrollTo would
    // animate. The new stage scans on mount and treats anything already
    // scrolled past as finished, which would replay the whole page as
    // pre-built. Jump instantly so reconstruction starts from a blank page.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleGoLive = useCallback(() => {
    setLive(true);
    setPaused(false);
    setTour(false);
  }, []);

  const handleTogglePause = useCallback(() => setPaused((value) => !value), []);

  const handleToggleTour = useCallback(() => {
    setTour((value) => {
      // Starting the tour also resumes the swarm — an auto-scroll through a
      // frozen reconstruction would just be a page tour.
      if (!value) setPaused(false);
      return !value;
    });
  }, []);

  const handleTourEnd = useCallback(() => setTour(false), []);

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
      {/* The swarm rebuild stage: scans and hides the real DOM while mounted,
          so `live` unmounts it (restoring everything) and bumping `replayKey`
          remounts it from a blank page. Gated on the intro so the hero starts
          building after the curtain clears. */}
      {!live && (
        <CursorStage
          key={replayKey}
          enabled={introDone}
          paused={paused}
          tour={tour}
          onTourEnd={handleTourEnd}
        />
      )}
      <RebuildControls
        paused={paused}
        tour={tour}
        onReplay={handleReplay}
        onGoLive={handleGoLive}
        onTogglePause={handleTogglePause}
        onToggleTour={handleToggleTour}
      />
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
