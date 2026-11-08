import { Eye, Pause, Play, RotateCcw, Route } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";

interface RebuildControlsProps {
  paused: boolean;
  tour: boolean;
  /** Restart the reconstruction from a blank page. */
  onReplay: () => void;
  /** Reveal the real portfolio and retire the swarm for this visit. */
  onGoLive: () => void;
  onTogglePause: () => void;
  onToggleTour: () => void;
}

/**
 * The playback pill for the reconstruction.
 *
 * Icon-only and tucked against the bottom-right edge (above the mobile nav
 * strip) so it never covers portfolio content, with `title`/`aria-label` on
 * every control. Hidden entirely for reduced-motion visitors, for whom the
 * page simply renders as the finished site.
 */
export function RebuildControls({
  paused,
  tour,
  onReplay,
  onGoLive,
  onTogglePause,
  onToggleTour,
}: RebuildControlsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return null;

  const button =
    "grid h-7 w-7 place-items-center rounded-md text-text-muted transition-colors " +
    "hover:bg-white/8 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-accent";

  return (
    <div
      data-rebuild-controls
      className="fixed bottom-20 right-3 z-[45] flex items-center gap-0.5 rounded-xl border border-white/10 bg-bg-elevated/90 p-1 shadow-lg shadow-black/20 backdrop-blur-md md:bottom-4 md:right-4"
      role="group"
      aria-label="Reconstruction controls"
    >
      <button
        type="button"
        className={button}
        onClick={onReplay}
        title="Replay reconstruction"
        aria-label="Replay reconstruction"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={button}
        onClick={onGoLive}
        title="Go live — show the finished site"
        aria-label="Go live, show the finished site"
      >
        <Eye className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={button}
        onClick={onTogglePause}
        title={paused ? "Resume swarm" : "Pause swarm"}
        aria-label={paused ? "Resume swarm" : "Pause swarm"}
        aria-pressed={paused}
      >
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        className={`${button}${tour ? " text-text bg-white/8" : ""}`}
        onClick={onToggleTour}
        title={tour ? "Stop auto tour" : "Auto tour — the page follows the swarm"}
        aria-label={tour ? "Stop auto tour" : "Start auto tour"}
        aria-pressed={tour}
      >
        <Route className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
