import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

/**
 * When true, palette bar animations should run. Fires only once most of the
 * palette is in view (~bottom of the palette reached). Looser threshold when
 * scrolling up avoids flicker.
 */
export function usePaletteBarsReveal(
  containerRef: RefObject<HTMLElement | null>,
): boolean {
  const scrollUpRef = useRef(false);
  const [, scrollTick] = useState(0);

  useLayoutEffect(() => {
    scrollTick((n) => n + 1);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollUpRef.current = y < lastY;
      lastY = y;
      scrollTick((n) => n + 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const el = containerRef.current;
  if (!el) return false;

  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const overlap = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  if (overlap <= 0) return false;
  const ratio = overlap / Math.max(r.height, 1);
  const scrollingUp = scrollUpRef.current;
  const threshold = scrollingUp ? 0.62 : 0.82;
  return ratio > threshold;
}
