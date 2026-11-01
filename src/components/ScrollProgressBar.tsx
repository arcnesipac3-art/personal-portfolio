import { useScrollProgress } from "../hooks/useScrollProgress";

export function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 z-[60] h-0.5 w-full bg-transparent" aria-hidden>
      <div
        className="h-full bg-gradient-to-r from-[#2878f0] to-[#38bdf8] transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
