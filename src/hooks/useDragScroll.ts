import { useRef, useEffect, useCallback, type MouseEvent as ReactMouseEvent } from "react";

type Axis = "x" | "y" | "both";

export function useDragScroll(axis: Axis = "x") {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPageX = useRef(0);
  const startPageY = useRef(0);
  const startScrollLeft = useRef(0);
  const startScrollTop = useRef(0);
  const activeTouchId = useRef<number | null>(null);

  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const lastPageX = useRef(0);
  const lastPageY = useRef(0);
  const lastTime = useRef(0);
  const animFrame = useRef(0);

  const axisRef = useRef(axis);
  axisRef.current = axis;

  const stopMomentum = useCallback(() => {
    if (animFrame.current) {
      cancelAnimationFrame(animFrame.current);
      animFrame.current = 0;
    }
  }, []);

  const startMomentum = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const a = axisRef.current;
    const doX = a === "x" || a === "both";
    const doY = a === "y" || a === "both";
    const friction = 0.985;
    const minVelocity = 0.2;

    const step = () => {
      velocityX.current *= friction;
      velocityY.current *= friction;
      const dead =
        (!doX || Math.abs(velocityX.current) < minVelocity) &&
        (!doY || Math.abs(velocityY.current) < minVelocity);
      if (dead) {
        animFrame.current = 0;
        return;
      }
      if (doX) el.scrollLeft -= velocityX.current;
      if (doY) el.scrollTop -= velocityY.current;
      animFrame.current = requestAnimationFrame(step);
    };

    animFrame.current = requestAnimationFrame(step);
  }, []);

  const trackVelocity = useCallback((pageX: number, pageY: number) => {
    const a = axisRef.current;
    const doX = a === "x" || a === "both";
    const doY = a === "y" || a === "both";
    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      if (doX) velocityX.current = (pageX - lastPageX.current) / dt * 16;
      if (doY) velocityY.current = (pageY - lastPageY.current) / dt * 16;
    }
    lastPageX.current = pageX;
    lastPageY.current = pageY;
    lastTime.current = now;
  }, []);

  const onMouseDown = useCallback((e: ReactMouseEvent) => {
    if (e.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    stopMomentum();
    isDragging.current = true;
    startPageX.current = e.pageX;
    startPageY.current = e.pageY;
    startScrollLeft.current = el.scrollLeft;
    startScrollTop.current = el.scrollTop;
    lastPageX.current = e.pageX;
    lastPageY.current = e.pageY;
    lastTime.current = performance.now();
    velocityX.current = 0;
    velocityY.current = 0;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, [stopMomentum]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const applyScroll = (pageX: number, pageY: number) => {
      const a = axisRef.current;
      if (a === "x" || a === "both") el.scrollLeft = startScrollLeft.current - (pageX - startPageX.current);
      if (a === "y" || a === "both") el.scrollTop = startScrollTop.current - (pageY - startPageY.current);
    };

    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      applyScroll(e.pageX, e.pageY);
      trackVelocity(e.pageX, e.pageY);
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
      startPageY.current = t.pageY;
      startScrollLeft.current = el.scrollLeft;
      startScrollTop.current = el.scrollTop;
      lastPageX.current = t.pageX;
      lastPageY.current = t.pageY;
      lastTime.current = performance.now();
      velocityX.current = 0;
      velocityY.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (activeTouchId.current === null) return;
      const t = Array.from(e.touches).find((x) => x.identifier === activeTouchId.current);
      if (!t) return;
      e.preventDefault();
      applyScroll(t.pageX, t.pageY);
      trackVelocity(t.pageX, t.pageY);
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
      const a = axisRef.current;

      if (a === "x") {
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        const canScrollLeft = el.scrollLeft > 0;
        const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
        const scrollingRight = delta > 0;
        const scrollingLeft = delta < 0;

        if ((scrollingRight && canScrollRight) || (scrollingLeft && canScrollLeft)) {
          e.preventDefault();
          stopMomentum();
          el.scrollLeft += delta;
        }
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
