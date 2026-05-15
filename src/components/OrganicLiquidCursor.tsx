import { useEffect, useRef, useState } from "react";
import chroma from "chroma-js";
import { createNoise2D, createNoise3D } from "simplex-noise";

type GradientStop = { offset: number; color: string; opacity?: number | null };

type OmbreGradient = {
  type: "linear" | "radial";
  stops: GradientStop[];
};

/** Matches Clay reference `controls` preset from the HTML prototype. */
const CONTROLS = {
  color_mode: "ombre" as "ombre" | "palette",
  shape: "cube",
  playing: true,
  morph_speed: 0.6,
  abstraction: 0,
  size_base: 14,
  contrast_amount: 120,
  lifespan: 700,
  density_rate: 0.4,
  blur_amount: 0,
  ombre_gradient: {
    type: "linear" as const,
    stops: [
      { offset: 0, color: "#FF0090", opacity: 100 },
      { offset: 1, color: "#2200B8", opacity: 100 },
    ],
  } satisfies OmbreGradient,
  palette: ["#ff0055", "#00ccff", "#ffcc00"] as string[],
};

const MAX_BLOBS = 2000;

let chromaScaleCache: ((v: number) => chroma.Color) | null = null;
let lastGradientJSON = "";

function getGradientColor(gradient: OmbreGradient, amount: number): string {
  if (!gradient?.stops?.length) return "#ffffff";

  const currentJSON = JSON.stringify(gradient.stops);
  if (currentJSON !== lastGradientJSON || !chromaScaleCache) {
    const sorted = [...gradient.stops].sort((a, b) => a.offset - b.offset);
    const colors = sorted.map((s) => s.color);
    const offsets = sorted.map((s) => s.offset);
    chromaScaleCache = chroma.scale(colors).domain(offsets).mode("oklch");
    lastGradientJSON = currentJSON;
  }

  return chromaScaleCache(amount).hex();
}

const CUBE_VERTICES: [number, number, number][] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

const CUBE_FACES = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4, 7, 3],
  [1, 5, 6, 2],
  [3, 2, 6, 7],
  [0, 1, 5, 4],
] as const;

class Blob {
  x: number;
  y: number;
  baseSize: number;
  initialColor: string;
  birth: number;
  lifespan: number;
  seed: number;
  points = 16;
  shape: string;

  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;

  constructor(x: number, y: number, size: number, color: string, lifespan: number, shape: string) {
    this.x = x;
    this.y = y;
    this.baseSize = size * (0.8 + Math.random() * 0.4);
    this.initialColor = color;
    this.birth = performance.now();
    this.lifespan = lifespan;
    this.seed = Math.random() * 1000;
    this.shape = shape;

    this.rotX = Math.random() * Math.PI * 2;
    this.rotY = Math.random() * Math.PI * 2;
    this.rotZ = Math.random() * Math.PI * 2;
    this.rotSpeedX = (Math.random() - 0.5) * 0.05;
    this.rotSpeedY = (Math.random() - 0.5) * 0.05;
    this.rotSpeedZ = (Math.random() - 0.5) * 0.05;
  }

  rotate3D(v: [number, number, number], rx: number, ry: number, rz: number): [number, number, number] {
    let x = v[0];
    let y = v[1];
    let z = v[2];

    let cos = Math.cos(rx);
    let sin = Math.sin(rx);
    let y1 = y * cos - z * sin;
    let z1 = y * sin + z * cos;
    y = y1;
    z = z1;

    cos = Math.cos(ry);
    sin = Math.sin(ry);
    const x1 = x * cos + z * sin;
    const z2 = -x * sin + z * cos;
    x = x1;
    z = z2;

    cos = Math.cos(rz);
    sin = Math.sin(rz);
    const x2 = x * cos - y * sin;
    const y2 = x * sin + y * cos;
    x = x2;
    y = y2;

    return [x, y, z];
  }

  update(
    ctx: CanvasRenderingContext2D,
    t: number,
    noise2D: (x: number, y: number) => number,
    noise3D: (x: number, y: number, z: number) => number,
    abstraction: number,
    morphSpeed: number,
    colorMode: "ombre" | "palette",
    gradient: OmbreGradient,
  ): boolean {
    const age = (performance.now() - this.birth) / this.lifespan;
    if (age >= 1) return false;

    let baseColor: string;
    if (colorMode === "ombre") {
      baseColor = getGradientColor(gradient, age);
    } else {
      baseColor = this.initialColor;
    }

    const currentSize = this.baseSize * (1 - age);

    if (this.shape === "cube") {
      this.rotX += this.rotSpeedX * morphSpeed;
      this.rotY += this.rotSpeedY * morphSpeed;
      this.rotZ += this.rotSpeedZ * morphSpeed;

      const projected = CUBE_VERTICES.map((v) => {
        const noiseX = noise3D(v[0], v[1], this.seed + t * morphSpeed) * abstraction;
        const noiseY = noise3D(v[1], v[2], this.seed + t * morphSpeed) * abstraction;
        const noiseZ = noise3D(v[2], v[0], this.seed + t * morphSpeed) * abstraction;

        const av: [number, number, number] = [v[0] + noiseX, v[1] + noiseY, v[2] + noiseZ];
        const rotated = this.rotate3D(av, this.rotX, this.rotY, this.rotZ);

        const focalLength = 400;
        const scale = focalLength / (focalLength + rotated[2] * currentSize);
        return [
          this.x + rotated[0] * currentSize * scale,
          this.y + rotated[1] * currentSize * scale,
          rotated[2],
        ] as [number, number, number];
      });

      const facesWithDepth = CUBE_FACES.map((face, i) => {
        const avgZ =
          (projected[face[0]][2] + projected[face[1]][2] + projected[face[2]][2] + projected[face[3]][2]) / 4;
        return { face, avgZ, index: i };
      });
      facesWithDepth.sort((a, b) => b.avgZ - a.avgZ);

      const shades = [0.7, 1.1, 0.8, 0.9, 1.2, 0.6];
      facesWithDepth.forEach(({ face, index }) => {
        ctx.beginPath();
        ctx.moveTo(projected[face[0]][0], projected[face[0]][1]);
        ctx.lineTo(projected[face[1]][0], projected[face[1]][1]);
        ctx.lineTo(projected[face[2]][0], projected[face[2]][1]);
        ctx.lineTo(projected[face[3]][0], projected[face[3]][1]);
        ctx.closePath();

        ctx.fillStyle = chroma(baseColor)
          .brighten(shades[index]! - 1)
          .hex();
        ctx.fill();
      });
    } else if (this.shape === "square") {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotZ + t * morphSpeed * 0.5);
      const noiseVal = noise2D(this.seed, t * morphSpeed * 0.2);
      const w = currentSize * (1 + noiseVal * abstraction);
      const h = currentSize * (1 - noiseVal * abstraction);
      ctx.fillStyle = baseColor;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.restore();
    } else {
      ctx.beginPath();
      for (let i = 0; i <= this.points; i++) {
        const angle = (i / this.points) * Math.PI * 2;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        const noiseVal = noise3D(nx * 0.8, ny * 0.8, this.seed + t * morphSpeed);
        const r = currentSize * (1 + noiseVal * abstraction);
        const px = this.x + r * nx;
        const py = this.y + r * ny;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = baseColor;
      ctx.fill();
    }

    return true;
  }
}

function getMousePos(canvas: HTMLCanvasElement, event: PointerEvent | MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function spawnBlobs(
  blobs: Blob[],
  distSinceLastSpawnRef: { v: number },
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const density = CONTROLS.density_rate;
  const baseSize = CONTROLS.size_base;
  const threshold = baseSize / density;

  distSinceLastSpawnRef.v += dist;

  const mode = CONTROLS.color_mode;
  const palette = CONTROLS.palette;
  const lifespan = CONTROLS.lifespan;
  const shape = CONTROLS.shape;

  while (distSinceLastSpawnRef.v >= threshold) {
    const ratio = 1 - (distSinceLastSpawnRef.v - threshold) / Math.max(dist, 0.001);
    const px = x1 + (x2 - x1) * ratio;
    const py = y1 + (y2 - y1) * ratio;

    const jitter = baseSize * 0.1;
    const jX = px + (Math.random() - 0.5) * jitter;
    const jY = py + (Math.random() - 0.5) * jitter;

    let color = "#fff";
    if (mode === "palette" && palette.length > 0) {
      color = palette[Math.floor(Math.random() * palette.length)]!;
    }

    if (blobs.length >= MAX_BLOBS) blobs.splice(0, blobs.length - MAX_BLOBS + 1);
    blobs.push(new Blob(jX, jY, baseSize, color, lifespan, shape));
    distSinceLastSpawnRef.v -= threshold;
  }
}

type Props = { enabled?: boolean };

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function OrganicLiquidCursor({ enabled = true }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const active = enabled && !reducedMotion;

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !wrap) return;

    const noise2D = createNoise2D();
    const noise3D = createNoise3D();
    const blobs: Blob[] = [];
    const distSinceLastSpawn = { v: 0 };
    const mouse = { x: 0, y: 0, active: false };

    const isNarrow = () => window.innerWidth <= 768;
    const maxDim = () => (isNarrow() ? 960 : 4096);

    const resize = () => {
      const area = wrap;
      const cs = getComputedStyle(area);
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      canvas.width = Math.min(maxDim(), area.clientWidth - padX);
      canvas.height = Math.min(maxDim(), area.clientHeight - padY);
      canvas.style.filter = `blur(${CONTROLS.blur_amount}px) contrast(${CONTROLS.contrast_amount}%)`;
    };

    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(wrap);
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      const pos = getMousePos(canvas, e);
      if (mouse.active) {
        spawnBlobs(blobs, distSinceLastSpawn, mouse.x, mouse.y, pos.x, pos.y);
      }
      mouse.x = pos.x;
      mouse.y = pos.y;
      mouse.active = true;
    };

    const onPointerLeaveWindow = () => {
      mouse.active = false;
    };

    const onPointerOut = (e: PointerEvent) => {
      if (e.relatedTarget == null) mouse.active = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerMove);
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("blur", onPointerLeaveWindow);

    let raf = 0;

    const draw = (timestamp: number) => {
      const t = timestamp * 0.001;
      const playing = CONTROLS.playing;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const abstraction = CONTROLS.abstraction;
      const morphSpeed = CONTROLS.morph_speed;
      const colorMode = CONTROLS.color_mode;
      const gradient = CONTROLS.ombre_gradient;

      if (playing) {
        for (let i = blobs.length - 1; i >= 0; i--) {
          if (!blobs[i]!.update(ctx, t, noise2D, noise3D, abstraction, morphSpeed, colorMode, gradient)) {
            blobs.splice(i, 1);
          }
        }
      } else {
        blobs.forEach((b) => b.update(ctx, t, noise2D, noise3D, abstraction, 0, colorMode, gradient));
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onPointerLeaveWindow);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed inset-0 z-[10001]"
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full bg-transparent"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
