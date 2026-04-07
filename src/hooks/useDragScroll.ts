import { useRef, useEffect, useCallback, type MouseEvent as ReactMouseEvent } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPageX = useRef(0);
  const startScrollLeft = useRef(0);
  const activeTouchId = useRef<number | null>(null);

  const velocity = useRef(0);
  const lastPageX = useRef(0);
  const lastTime = useRef(0);
  const animFrame = useRef(0);

  const stopMomentum = useCallback(() => {
    if (animFrame.current) {
      cancelAnimationFrame(animFrame.current);
      animFrame.current = 0;
    }
  }, []);

  const startMomentum = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const friction = 0.985;
    const minVelocity = 0.2;

    const step = () => {
      velocity.current *= friction;
      if (Math.abs(velocity.current) < minVelocity) {
        animFrame.current = 0;
        return;
      }
      el.scrollLeft -= velocity.current;
      animFrame.current = requestAnimationFrame(step);
    };

    animFrame.current = requestAnimationFrame(step);
  }, []);

  const trackVelocity = useCallback((pageX: number) => {
    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      velocity.current = (pageX - lastPageX.current) / dt * 16;
    }
    lastPageX.current = pageX;
    lastTime.current = now;
  }, []);

  const onMouseDown = useCallback((e: ReactMouseEvent) => {
    if (e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    stopMomentum();
    isDragging.current = true;
    startPageX.current = e.pageX;
    startScrollLeft.current = el.scrollLeft;
    lastPageX.current = e.pageX;
    lastTime.current = performance.now();
    velocity.current = 0;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, [stopMomentum]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const applyScroll = (pageX: number) => {
      el.scrollLeft = startScrollLeft.current - (pageX - startPageX.current);
    };

    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      applyScroll(e.pageX);
      trackVelocity(e.pageX);
    };

    const onMouseUp = () => {
      if (!isDragging.current && activeTouchId.current === null) return;
      const wasDragging = isDragging.current;
      isDragging.current = false;
      activeTouchId.current = null;
      el.style.cursor = "grab";
      el.style.removeProperty("user-select");
      if (wasDragging) startMomentum();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (activeTouchId.current !== null) return;
      const t = e.touches[0];
      if (!t) return;
      stopMomentum();
      activeTouchId.current = t.identifier;
      isDragging.current = true;
      startPageX.current = t.pageX;
      startScrollLeft.current = el.scrollLeft;
      lastPageX.current = t.pageX;
      lastTime.current = performance.now();
      velocity.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (activeTouchId.current === null) return;
      const t = Array.from(e.touches).find((x) => x.identifier === activeTouchId.current);
      if (!t) return;
      e.preventDefault();
      applyScroll(t.pageX);
      trackVelocity(t.pageX);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (activeTouchId.current === null) return;
      const ended = Array.from(e.changedTouches).some((t) => t.identifier === activeTouchId.current);
      if (!ended) return;
      activeTouchId.current = null;
      isDragging.current = false;
      el.style.cursor = "grab";
      startMomentum();
    };

    const onWheel = (e: WheelEvent) => {
      const canScrollLeft = el.scrollLeft > 0;
      const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
      const scrollingRight = e.deltaY > 0;
      const scrollingLeft = e.deltaY < 0;

      if ((scrollingRight && canScrollRight) || (scrollingLeft && canScrollLeft)) {
        e.preventDefault();
        stopMomentum();
        velocity.current = -e.deltaY * 0.15;
        startMomentum();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      stopMomentum();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [trackVelocity, startMomentum, stopMomentum]);

  return { ref, onMouseDown };
}
