/** Corner registration marks — thin framing brackets at the viewport edges. */
const CORNERS = [
  "left-5 top-5 border-l border-t",
  "right-5 top-5 border-r border-t",
  "left-5 bottom-5 border-l border-b",
  "right-5 bottom-5 border-r border-b",
];

/**
 * Fixed backdrop for the whole page, sitting behind every section at `-z-10`.
 * It lives at the app root rather than inside `<main>`: `main` carries
 * `overflow-x: clip` (see `.no-scroll-x`), which would anchor a `fixed`
 * descendant to the container instead of the viewport.
 *
 * Sections that paint their own band (Projects, Achievements) still sit on top;
 * every other section is transparent and lets this show through, so the wash and
 * the grid read as one continuous surface rather than restarting per section.
 */
export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="page-backdrop absolute inset-0" />
      <div className="page-grid absolute inset-0" />
      <div className="page-vignette absolute inset-0" />

      {CORNERS.map((corner) => (
        <span
          key={corner}
          className={`absolute hidden h-6 w-6 border-[#2878f0]/20 lg:block ${corner}`}
        />
      ))}
    </div>
  );
}
