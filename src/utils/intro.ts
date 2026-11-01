const STORAGE_KEY = "portfolio:intro-seen";

/**
 * Whether the branded intro should play. Read synchronously by the lazy state
 * initialiser in `App` and `IntroOverlay` so reduced-motion users and repeat
 * visits never render the overlay at all — a media-query hook starts false and
 * corrects in an effect, which would flash it for a frame.
 */
export function shouldShowIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    // Storage throws in some private modes — show it, it is harmless.
    return true;
  }
}

/** Mark the intro as seen so a reload mid-intro does not replay it. */
export function markIntroSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}
