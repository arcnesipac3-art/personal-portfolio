import { useRef, type TouchEvent } from "react";

interface SwipeHandlers {
  onTouchStart: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
}

/**
 * Horizontal swipe detection for touch devices.
 * Ignores mostly-vertical gestures so page scrolling still works.
 */
export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 50
): SwipeHandlers {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;

    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    }

    startX.current = null;
    startY.current = null;
  };

  return { onTouchStart, onTouchEnd };
}
