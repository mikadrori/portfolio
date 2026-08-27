import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  pickRandomSneakPeek,
  type SneakPeekProjectId,
  type DisplayHint,
} from "../lib/sneakPeekPool";

type Placement = "top-left" | "bottom-left" | "center";

interface ZoneRect {
  leftMin: number;
  leftMax: number;
  verticalMin: number;
  verticalMax: number;
}

const ZONES: Record<Placement, ZoneRect> = {
  "top-left": { leftMin: 3, leftMax: 24, verticalMin: 1, verticalMax: 4 },
  "bottom-left": { leftMin: 3, leftMax: 24, verticalMin: 1, verticalMax: 4 },
  center: { leftMin: 39, leftMax: 42, verticalMin: 28, verticalMax: 54 },
};

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

const ALL_PLACEMENTS: Placement[] = ["top-left", "bottom-left", "center"];

function pickPlacement(hint: DisplayHint, lastPlacement: Placement | null): Placement {
  const allowed: Placement[] =
    hint === "normal" || hint === "wide" || hint === "ipad"
      ? ["top-left", "bottom-left"]
      : ALL_PLACEMENTS;

  // Filter out the last used placement so we always move to a different zone
  const candidates =
    lastPlacement && allowed.length > 1
      ? allowed.filter((p) => p !== lastPlacement)
      : allowed;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

const HINT_CLASSES: Record<DisplayHint, string> = {
  wide: "w-[clamp(200px,22vw,320px)] h-[clamp(160px,20vh,240px)] object-cover",
  tall: "max-w-[clamp(110px,13vw,170px)] max-h-[clamp(200px,28vh,300px)] object-contain",
  icon: "w-[clamp(70px,8vw,110px)] h-[clamp(70px,8vw,110px)] object-contain",
  normal: "max-w-[clamp(240px,26vw,400px)] max-h-[clamp(200px,26vh,300px)] object-contain",
  ipad: "max-w-[clamp(320px,36vw,540px)] max-h-[clamp(260px,36vh,420px)] object-contain",
};

interface PeekState {
  key: number;
  src: string;
  hint: DisplayHint;
  left: number;
  placement: Placement;
  offset: number;
}

interface SneakPeekImageProps {
  projectId: SneakPeekProjectId | null;
}

export function SneakPeekImage({ projectId }: SneakPeekImageProps) {
  const [peek, setPeek] = useState<PeekState | null>(null);
  const lastSrcRef = useRef<string | null>(null);
  const lastPlacementRef = useRef<Placement | null>(null);
  const keyRef = useRef(0);
  const failedSrcsRef = useRef<Set<string>>(new Set());
  const projectIdRef = useRef(projectId);
  projectIdRef.current = projectId;

  const showEntry = (entry: { src: string; hint: DisplayHint }) => {
    lastSrcRef.current = entry.src;
    keyRef.current += 1;
    const placement = pickPlacement(entry.hint, lastPlacementRef.current);
    lastPlacementRef.current = placement;
    const zone = ZONES[placement];
    setPeek({
      key: keyRef.current,
      src: entry.src,
      hint: entry.hint,
      left: randomInRange(zone.leftMin, zone.leftMax),
      placement,
      offset: randomInRange(zone.verticalMin, zone.verticalMax),
    });
  };

  useEffect(() => {
    if (!projectId) {
      setPeek(null);
      failedSrcsRef.current.clear();
      return;
    }

    failedSrcsRef.current.clear();
    const entry = pickRandomSneakPeek(projectId, lastSrcRef.current);
    if (!entry) {
      setPeek(null);
      return;
    }
    showEntry(entry);
  }, [projectId]);

  const handleImageError = () => {
    const id = projectIdRef.current;
    if (!id || !peek) return;

    failedSrcsRef.current.add(peek.src);
    // Prefer anything that has not failed this hover cycle
    let next = pickRandomSneakPeek(id, peek.src);
    let attempts = 0;
    while (
      next &&
      failedSrcsRef.current.has(next.src) &&
      attempts < 12
    ) {
      next = pickRandomSneakPeek(id, next.src);
      attempts += 1;
    }
    if (!next || failedSrcsRef.current.has(next.src)) {
      setPeek(null);
      return;
    }
    showEntry(next);
  };

  const positionStyle = (p: PeekState): React.CSSProperties => {
    const base: React.CSSProperties = { left: `${p.left}%` };
    if (p.placement === "bottom-left") {
      base.bottom = `${p.offset}%`;
    } else {
      base.top = `${p.offset}%`;
    }
    return base;
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
      aria-hidden
    >
      <AnimatePresence mode="wait">
        {peek ? (
          <motion.img
            key={peek.key}
            src={peek.src}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute ${HINT_CLASSES[peek.hint]}`}
            style={positionStyle(peek)}
            draggable={false}
            onError={handleImageError}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
