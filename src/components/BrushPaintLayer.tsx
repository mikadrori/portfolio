import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const PAPER = "rgb(252, 247, 238)";
const DEFAULT_INK_HEX = "#2200b8";

/** Source dab resolution (px). */
const DAB_TEXTURE_SIZE = 128;
/** Fraction of texture height where the ink peak sits (must match `tipCy` in `createBrushTextureDab`). */
const INK_PEAK_Y_FRAC = 0.055;
/** Distance between stamps along a stroke. */
const STAMP_SPACING = 3.8;
/** Scales drawn dab vs texture — higher = thicker stroke. */
const BRUSH_SCALE_BASE = 0.86;

export type Rgb = { r: number; g: number; b: number };

export function parseBrushColorHex(hex: string): Rgb {
  const h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    return {
      r: parseInt(h[0]! + h[0]!, 16),
      g: parseInt(h[1]! + h[1]!, 16),
      b: parseInt(h[2]! + h[2]!, 16),
    };
  }
  if (h.length >= 6) {
    const n = parseInt(h.slice(0, 6), 16);
    if (!Number.isNaN(n)) {
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
  }
  return { r: 34, g: 0, b: 184 };
}

function mulRgb(rgb: Rgb, k: number): Rgb {
  return {
    r: Math.min(255, Math.max(0, Math.round(rgb.r * k))),
    g: Math.min(255, Math.max(0, Math.round(rgb.g * k))),
    b: Math.min(255, Math.max(0, Math.round(rgb.b * k))),
  };
}

function rgba(rgb: Rgb, a: number) {
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
}

/**
 * Procedural dab with ink **biased to the top** of the texture; colors follow `inkRgb`.
 */
function createBrushTextureDab(size: number, ink: Rgb): HTMLCanvasElement {
  const d = document.createElement("canvas");
  d.width = size;
  d.height = size;
  const c = d.getContext("2d");
  if (!c) return d;

  const inkRgb = `rgb(${ink.r},${ink.g},${ink.b})`;
  const core = mulRgb(ink, 0.6);

  const cx = size * 0.5;
  const tipCy = size * INK_PEAK_Y_FRAC;
  const rx = size * 0.26;
  const ry = size * 0.36;

  c.clearRect(0, 0, size, size);

  /* Base fill — strong opaque ellipse. */
  c.globalAlpha = 1;
  const g = c.createRadialGradient(cx, tipCy, 0, cx, tipCy, Math.max(rx, ry) * 1.15);
  g.addColorStop(0, rgba(ink, 0.95));
  g.addColorStop(0.3, rgba(ink, 0.85));
  g.addColorStop(0.6, rgba(ink, 0.6));
  g.addColorStop(0.8, rgba(ink, 0.3));
  g.addColorStop(1, rgba(ink, 0));
  c.fillStyle = g;
  c.beginPath();
  c.ellipse(cx, tipCy, rx * 1.05, ry * 1.05, 0, 0, Math.PI * 2);
  c.fill();

  /* Dense pigment grain for texture. */
  for (let i = 0; i < size * 30; i++) {
    const ang = Math.random() * Math.PI * 2;
    const t = Math.pow(Math.random(), 0.5);
    const px = cx + Math.cos(ang) * rx * t * 1.1;
    const py = tipCy + Math.sin(ang) * ry * t * 0.85 + Math.random() * size * 0.03;
    if (py > size * 0.96) continue;
    c.globalAlpha = 0.06 + Math.random() * 0.14;
    c.fillStyle = Math.random() > 0.3 ? inkRgb : PAPER;
    const w = 1 + Math.random() * 1.6;
    const h = 1 + Math.random() * 1.4;
    c.fillRect(px - w * 0.5, py - h * 0.5, w, h);
  }

  /* Bristle streaks — parallel lines that mimic real brush bristles. */
  const bristleCount = 28;
  for (let i = 0; i < bristleCount; i++) {
    const bx = cx + (i / bristleCount - 0.5) * rx * 2;
    c.strokeStyle = rgba(ink, 0.15 + Math.random() * 0.2);
    c.lineWidth = 0.6 + Math.random() * 0.8;
    c.globalAlpha = 1;
    c.beginPath();
    c.moveTo(bx + (Math.random() - 0.5) * 2, tipCy - ry * 0.8);
    c.lineTo(bx + (Math.random() - 0.5) * 3, tipCy + ry * 0.9);
    c.stroke();
  }

  /* Paper-colored bristle gaps for realism. */
  for (let i = 0; i < 18; i++) {
    const bx = cx + (Math.random() - 0.5) * rx * 1.6;
    c.strokeStyle = `rgba(252, 247, 238, ${0.08 + Math.random() * 0.12})`;
    c.lineWidth = 0.4 + Math.random() * 0.6;
    c.globalAlpha = 1;
    c.beginPath();
    c.moveTo(bx, tipCy - ry * 0.6);
    c.lineTo(bx + (Math.random() - 0.5) * 2, tipCy + ry * 0.7);
    c.stroke();
  }

  /* Darker core at the tip. */
  const g2 = c.createRadialGradient(cx, tipCy, 0, cx, tipCy, ry * 0.45);
  g2.addColorStop(0, rgba(core, 0.7));
  g2.addColorStop(0.5, rgba(core, 0.3));
  g2.addColorStop(1, rgba(core, 0));
  c.globalAlpha = 1;
  c.fillStyle = g2;
  c.beginPath();
  c.ellipse(cx, tipCy, rx * 0.4, ry * 0.38, 0, 0, Math.PI * 2);
  c.fill();

  /* Rough edge specks. */
  c.globalAlpha = 1;
  for (let i = 0; i < 50; i++) {
    const ang = Math.random() * Math.PI * 2;
    const t = 0.6 + Math.random() * 0.45;
    const px = cx + Math.cos(ang) * rx * t;
    const py = tipCy + Math.sin(ang) * ry * t;
    c.fillStyle = rgba(ink, 0.15 + Math.random() * 0.25);
    c.beginPath();
    c.arc(px, py, 0.4 + Math.random() * 0.8, 0, Math.PI * 2);
    c.fill();
  }

  return d;
}

function stampDab(
  ctx: CanvasRenderingContext2D,
  dab: HTMLCanvasElement,
  x: number,
  y: number,
  angleRad: number,
  scale: number,
  alpha: number,
) {
  const s = dab.width * scale * BRUSH_SCALE_BASE;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(angleRad);
  const peakOffset = INK_PEAK_Y_FRAC * s;
  ctx.translate(0, -peakOffset);
  ctx.drawImage(dab, -s / 2, 0, s, s);
  ctx.restore();
}

function stampAlongSegment(
  ctx: CanvasRenderingContext2D,
  dab: HTMLCanvasElement,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  spacing: number,
  scale: number,
  alpha: number,
) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) + Math.PI / 2;

  if (dist < 0.4) {
    stampDab(ctx, dab, x0, y0, angle, scale, alpha);
    return;
  }

  const steps = Math.max(1, Math.ceil(dist / spacing));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + dx * t;
    const y = y0 + dy * t;
    const jitter = 0.97 + Math.random() * 0.06;
    stampDab(ctx, dab, x, y, angle, scale * jitter, alpha * (0.92 + Math.random() * 0.08));
  }
}

function pointerIdFromHostEvent(e: MouseEvent): number {
  if ("pointerId" in e && typeof (e as PointerEvent).pointerId === "number") {
    return (e as PointerEvent).pointerId;
  }
  return 1;
}

export type BrushPaintLayerHandle = {
  /** Start a stroke from a host pointer event (empty-canvas pointerdown); uses client coords mapped onto the layer canvas. */
  beginFromMissedPointer: (e: MouseEvent | PointerEvent) => void;
};

/**
 * Full-bleed drawing surface for About "paint mode". `brushColor` is `#rrggbb` from the palette picker.
 * Strokes are started imperatively (see `beginFromMissedPointer`) so the WebGL layer can sit above and still receive prop hits.
 */
export const BrushPaintLayer = forwardRef<
  BrushPaintLayerHandle,
  {
    active: boolean;
    /** Hex brush ink, e.g. `#2200b8`. */
    brushColor?: string;
  }
>(function BrushPaintLayer({ active, brushColor = DEFAULT_INK_HEX }, ref) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beginStrokeRef = useRef<(e: MouseEvent | PointerEvent) => void>(() => {});

  useEffect(() => {
    if (!active) {
      beginStrokeRef.current = () => {};
      return;
    }

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !wrap) return;

    const inkRgb = parseBrushColorHex(brushColor);
    const dab = createBrushTextureDab(DAB_TEXTURE_SIZE, inkRgb);
    const drawing = { current: false };
    const last = { x: 0, y: 0 };

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w <= 0 || h <= 0) return;
      if (canvas.width === w && canvas.height === h) return;
      if (canvas.width > 0 && canvas.height > 0) {
        const prev = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = w;
        canvas.height = h;
        ctx.putImageData(prev, 0, 0);
      } else {
        canvas.width = w;
        canvas.height = h;
      }
    };

    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(wrap);

    const pos = (e: PointerEvent | MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const sx = canvas.width / r.width;
      const sy = canvas.height / r.height;
      const x = (e.clientX - r.left) * sx;
      const y = (e.clientY - r.top) * sy;
      return {
        x: Math.max(0, Math.min(canvas.width - 1, x)),
        y: Math.max(0, Math.min(canvas.height - 1, y)),
      };
    };

    const brushScale = (e: PointerEvent | MouseEvent) => {
      const pe = e as PointerEvent;
      const p = typeof pe.pressure === "number" && pe.pressure > 0 ? pe.pressure : 0.5;
      return 0.56 + p * 0.42;
    };

    const strokeAlpha = 1.0;

    /** Capture phase so moves reach us before R3F/canvas bubble handlers that may call stopPropagation. */
    const captureOpts = { capture: true } as const;
    const moveOpts = { passive: true, capture: true } as const;

    let detachActiveStroke: (() => void) | null = null;

    const beginFromHostEvent = (e: MouseEvent | PointerEvent) => {
      if (e.button !== 0) return;
      detachActiveStroke?.();

      const pid = pointerIdFromHostEvent(e);
      drawing.current = true;

      const strokeMove = (ev: PointerEvent) => {
        if (!drawing.current || ev.pointerId !== pid) return;
        const p = pos(ev);
        const scale = brushScale(ev);
        stampAlongSegment(ctx, dab, last.x, last.y, p.x, p.y, STAMP_SPACING, scale, strokeAlpha);
        last.x = p.x;
        last.y = p.y;
      };

      const endStroke = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return;
        if (!drawing.current) return;
        drawing.current = false;
        window.removeEventListener("pointermove", strokeMove, moveOpts);
        window.removeEventListener("pointerup", endStroke, captureOpts);
        window.removeEventListener("pointercancel", endStroke, captureOpts);
        detachActiveStroke = null;
        try {
          canvas.releasePointerCapture(pid);
        } catch {
          /* ignore */
        }
      };

      detachActiveStroke = () => {
        window.removeEventListener("pointermove", strokeMove, moveOpts);
        window.removeEventListener("pointerup", endStroke, captureOpts);
        window.removeEventListener("pointercancel", endStroke, captureOpts);
        drawing.current = false;
        detachActiveStroke = null;
        try {
          canvas.releasePointerCapture(pid);
        } catch {
          /* ignore */
        }
      };

      try {
        canvas.setPointerCapture(pid);
      } catch {
        /* ignore */
      }
      const p = pos(e);
      last.x = p.x;
      last.y = p.y;
      stampDab(ctx, dab, p.x, p.y, -Math.PI / 2, brushScale(e), strokeAlpha * 1.05);

      window.addEventListener("pointermove", strokeMove, moveOpts);
      window.addEventListener("pointerup", endStroke, captureOpts);
      window.addEventListener("pointercancel", endStroke, captureOpts);
    };

    beginStrokeRef.current = beginFromHostEvent;

    return () => {
      beginStrokeRef.current = () => {};
      detachActiveStroke?.();
      ro?.disconnect();
    };
  }, [active, brushColor]);

  useImperativeHandle(
    ref,
    () => ({
      beginFromMissedPointer: (e) => beginStrokeRef.current(e),
    }),
    [],
  );

  if (!active) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-[12] touch-none"
      aria-label="Paint on the page"
      role="application"
    >
      <canvas ref={canvasRef} className="block h-full w-full touch-none bg-transparent" />
    </div>
  );
});
