import { useState } from "react";
import { motion } from "motion/react";

import { cloudinaryUrl } from "../lib/cloudinary";

export type ProjectId = "lumina" | "ogen" | "aviv" | "packup" | "muchiwaze" | "nabat" | "wwl" | "signal50";

export const PROJECT_ORDER: ProjectId[] = [
  "lumina",
  "ogen",
  "packup",
  "nabat",
  "signal50",
];

type CubeKey = "lumina" | "ogen" | "packup" | "nabat" | "signal";

const CUBES: {
  id: number;
  projectId: ProjectId;
  cubeKey: CubeKey;
  label: string;
  subtitle: string;
}[] = [
  { id: 1, projectId: "lumina", cubeKey: "lumina", label: "Lumina Forest", subtitle: "gaming" },
  { id: 2, projectId: "ogen", cubeKey: "ogen", label: "OGEN", subtitle: "ux ui" },
  { id: 3, projectId: "packup", cubeKey: "packup", label: "Pack Up", subtitle: "ux ui" },
  { id: 4, projectId: "nabat", cubeKey: "nabat", label: "Nabat", subtitle: "ux ui" },
  { id: 5, projectId: "signal50", cubeKey: "signal", label: "Signal", subtitle: "motion" },
];

type CubeId = (typeof CUBES)[number]["id"];

const PYRAMID_LAYOUT: Record<
  CubeId,
  { left: string; top: string; zIndex: number; size: string }
> = {
  // Exact live portfolio layout (mikadrori.vercel.app).
  1: { left: "38%", top: "-12%", zIndex: 5, size: "46%" },
  2: { left: "13%", top: "22%", zIndex: 3, size: "46%" },
  3: { left: "63%", top: "22%", zIndex: 4, size: "48%" },
  4: { left: "9%", top: "61%", zIndex: 1, size: "51%" },
  5: { left: "65%", top: "59%", zIndex: 2, size: "53%" },
};

const DROP_ORDER: Record<CubeId, number> = { 4: 0, 5: 1, 2: 2, 3: 3, 1: 4 };

const CUBE_ASSETS: Record<CubeKey, { blue: string; pink: string }> = {
  lumina: {
    blue: "Cube_Lumina_BLUE_ld4ech.svg",
    pink: "Cube_Lumina_PINK_iuufit.svg",
  },
  ogen: {
    blue: "Cube_Ogen_BLUE_kkkzyr.svg",
    pink: "Cube_Ogen_PINK_k3muyb.svg",
  },
  packup: {
    blue: "Cube_PackUp_BLUE_vuoogj.svg",
    pink: "Cube_PackUp_PINK_guqqi3.svg",
  },
  nabat: {
    blue: "Cube_Nabat_BLUE_phzcjh.svg",
    pink: "Cube_Nabat_PINK_uvwph7.svg",
  },
  signal: {
    blue: "Cube_Signal_BLUE_uttch6.svg",
    pink: "Cube_Signal_PINK_ibeyjx.svg",
  },
};

/** Matches Cloudinary folder + local `public/assets/New Cubes/` (space encoded). */
function cubeAsset(cubeKey: CubeKey, color: "blue" | "pink") {
  return cloudinaryUrl(encodeURI(`New Cubes/${CUBE_ASSETS[cubeKey][color]}`));
}

const PINK_HOVER_SCALE: Partial<Record<CubeKey, number>> = {
  lumina: 1.02,
  nabat: 1.05,
  signal: 1.05,
};

interface CategoryCubesProps {
  onSelectProject: (id: ProjectId) => void;
  animationKey?: number;
  /** Fires with the hovered cube's project, or null when the pointer leaves. */
  onHoverChange?: (id: ProjectId | null) => void;
}

export const CategoryCubes = ({
  onSelectProject,
  animationKey = 0,
  onHoverChange,
}: CategoryCubesProps) => {
  const [hoveredId, setHoveredId] = useState<CubeId | null>(null);

  return (
    <div
      key={animationKey}
      className="cube-pyramid relative flex justify-center items-end overflow-visible w-[clamp(220px,50vw,340px)] md:w-[clamp(135px,24vw,200px)] lg:w-[clamp(240px,26vw,350px)] 2xl:w-[clamp(280px,28vw,420px)]"
      style={{
        aspectRatio: "1 / 1",
      }}
    >
      {CUBES.map(({ id, projectId, cubeKey, label }) => {
        const layout = PYRAMID_LAYOUT[id];
        const isHovered = hoveredId === id;
        const src = cubeAsset(cubeKey, isHovered ? "pink" : "blue");
        const dropIndex = DROP_ORDER[id];

        return (
          <motion.button
            key={id}
            type="button"
            className="absolute cursor-pointer border-none bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2200b8] focus-visible:ring-offset-2 rounded-sm"
            style={{
              left: layout.left,
              top: layout.top,
              zIndex: layout.zIndex,
              width: layout.size,
              height: layout.size,
            }}
            initial={{ x: "-50%", y: -600, visibility: "hidden" as const }}
            animate={{ x: "-50%", y: [null, 0, 8, -4, 0], visibility: "visible" as const }}
            transition={{
              delay: dropIndex * 0.5,
              duration: 0.45,
              times: [0, 0.6, 0.75, 0.9, 1],
              ease: "easeOut",
              visibility: { delay: dropIndex * 0.5, duration: 0 },
            }}
            aria-label={label}
            onMouseEnter={() => {
              setHoveredId(id);
              onHoverChange?.(projectId);
            }}
            onMouseLeave={() => {
              setHoveredId(null);
              onHoverChange?.(null);
            }}
            onClick={() => onSelectProject(projectId)}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-contain pointer-events-none select-none"
              style={
                isHovered && PINK_HOVER_SCALE[cubeKey]
                  ? { transform: `scale(${PINK_HOVER_SCALE[cubeKey]})` }
                  : undefined
              }
              draggable={false}
            />
          </motion.button>
        );
      })}
    </div>
  );
};
