/**
 * The eight simulated collaborators that edit the portfolio as you scroll.
 *
 * Colours are exposed as CSS custom properties (see `collab.css`) so the same
 * agents read correctly on both the dark and paper themes — the palette is
 * re-pointed per theme rather than hard-coded here.
 */
export type AgentId =
  | "designer"
  | "writer"
  | "developer"
  | "editor"
  | "artist"
  | "planner"
  | "tester"
  | "reviewer";

export interface Agent {
  id: AgentId;
  /** Name shown on the floating chip. */
  name: string;
  /** One-line role, kept for the tooltip/title on the chip. */
  role: string;
}

export const AGENTS: Agent[] = [
  { id: "designer", name: "DESIGNER", role: "Layout, spacing & type" },
  { id: "writer", name: "WRITER", role: "Headings, copy & intros" },
  { id: "developer", name: "DEVELOPER", role: "Cards, tags & components" },
  { id: "editor", name: "EDITOR", role: "Review & final adjustments" },
  { id: "artist", name: "ARTIST", role: "Images, icons & media" },
  { id: "planner", name: "PLANNER", role: "Sections, grids & panels" },
  { id: "tester", name: "TESTER", role: "Buttons, links & fields" },
  { id: "reviewer", name: "REVIEWER", role: "Proofread & polish" },
];

/**
 * Where each agent slides in from when a section's sequence begins. Off-screen
 * by design: the stage clips to the viewport, so they read as walking onto the
 * page rather than popping into it. Eight of them enter from all four edges so
 * no two share an approach lane.
 */
export const ENTRY_POINTS: Record<AgentId, (vw: number, vh: number) => { x: number; y: number }> = {
  designer: (_vw, vh) => ({ x: -44, y: vh * 0.3 }),
  writer: (vw) => ({ x: vw * 0.22, y: -44 }),
  developer: (vw, vh) => ({ x: vw + 44, y: vh * 0.42 }),
  editor: (vw, vh) => ({ x: vw * 0.3, y: vh + 44 }),
  artist: (vw) => ({ x: vw * 0.72, y: -44 }),
  tester: (_vw, vh) => ({ x: -44, y: vh * 0.74 }),
  planner: (vw, vh) => ({ x: vw + 44, y: vh * 0.8 }),
  reviewer: (vw, vh) => ({ x: vw * 0.76, y: vh + 44 }),
};
