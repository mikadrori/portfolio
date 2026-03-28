import { useState } from "react";
import { motion } from "motion/react";
import { cloudinaryUrl } from "../lib/cloudinary";

export type ProjectId = "lumina" | "aviv" | "packup" | "muchiwaze" | "wwl";

export const PROJECT_ORDER: ProjectId[] = [
  "lumina",
  "aviv",
  "packup",
  "muchiwaze",
  "wwl",
];

const CUBES: {
  id: number;
  projectId: ProjectId;
  label: string;
  subtitle: string;
}[] = [
  { id: 1, projectId: "lumina", label: "Lumina Forest", subtitle: "gaming" },
  { id: 2, projectId: "aviv", label: "Moonlight Atmosphere", subtitle: "ux ui" },
  { id: 3, projectId: "packup", label: "Pack Up", subtitle: "ux ui" },
  { id: 4, projectId: "muchiwaze", label: "MuchiWaze", subtitle: "ux ui" },
  { id: 5, projectId: "wwl", label: "We Were Liars", subtitle: "motion" },
];

type CubeId = (typeof CUBES)[number]["id"];

const PYRAMID_LAYOUT: Record<
  CubeId,
  { left: string; top: string; zIndex: number; size: string }
> = {
  1: { left: "50%", top: "0%", zIndex: 5, size: "46%" },
  2: { left: "28%", top: "28%", zIndex: 3, size: "44%" },
  3: { left: "72%", top: "28%", zIndex: 4, size: "46%" },
  4: { left: "26%", top: "56%", zIndex: 1, size: "48%" },
  5: { left: "74%", top: "56%", zIndex: 2, size: "48%" },
};

const DROP_ORDER: Record<CubeId, number> = { 4: 0, 5: 1, 2: 2, 3: 3, 1: 4 };

function cubeAsset(n: number, color: "blue" | "pink") {
  const map: Record<string, string> = {
    "1_blue": "cube_1_blue_x0wgmp.svg",
    "1_pink": "cube_1_pink_pw7pjr.svg",
    "2_blue": "cube_2_blue_mqkddp.svg",
    "2_pink": "cube_2_pink_kfccxk.svg",
    "3_blue": "cube_3_blue_k8ozy7.svg",
    "3_pink": "cube_3_pink_uoakkh.svg",
    "4_blue": "cube_4_blue_ymx0kq.svg",
    "4_pink": "cube_4_pink_xicof5.svg",
    "5_blue": "cube_5_blue_t0crn1.svg",
    "5_pink": "cube_5_pink_vzrvlg.svg",
  };
  return cloudinaryUrl(map[`${n}_${color}`]);
}

interface CategoryCubesProps {
  onSelectProject: (id: ProjectId) => void;
  animationKey?: number;
}

export const CategoryCubes = ({ onSelectProject, animationKey = 0 }: CategoryCubesProps) => {
  const [hoveredId, setHoveredId] = useState<CubeId | null>(null);

  return (
    <div
      key={animationKey}
      className="relative flex justify-center items-end overflow-visible"
      style={{
        width: "clamp(250px, 40vw, 500px)",
        aspectRatio: "1 / 1",
      }}
    >
      {CUBES.map(({ id, projectId, label }) => {
        const layout = PYRAMID_LAYOUT[id];
        const isHovered = hoveredId === id;
        const src = cubeAsset(id, isHovered ? "pink" : "blue");
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
              transform: "translate(-50%, 0)",
            }}
            initial={{ y: -600, visibility: "hidden" as const }}
            animate={{ y: [null, 0, 8, -4, 0], visibility: "visible" as const }}
            transition={{
              delay: dropIndex * 0.35,
              duration: 0.45,
              times: [0, 0.6, 0.75, 0.9, 1],
              ease: "easeOut",
              visibility: { delay: dropIndex * 0.35, duration: 0 },
            }}
            aria-label={label}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectProject(projectId)}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-contain pointer-events-none select-none"
              draggable={false}
            />
          </motion.button>
        );
      })}
    </div>
  );
};
