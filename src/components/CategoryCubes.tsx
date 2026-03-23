import { useState } from "react";
import { motion } from "motion/react";

const cubeAsset = (n: number, color: "blue" | "pink") =>
  `/svg/cube%20${n}%20${color}.svg`;

const CUBES = [
  { id: 1, row: 1, label: "Project 1" },
  { id: 2, row: 2, label: "Project 2" },
  { id: 3, row: 3, label: "Project 3" },
  { id: 4, row: 4, label: "Project 4" },
  { id: 5, row: 5, label: "Project 5" },
] as const;

type CubeId = (typeof CUBES)[number]["id"];

const CUBE_1_SIZE = "clamp(115px, 62vw, 220px)";
const CUBE_2_SIZE = "clamp(110px, 60vw, 210px)";
const CUBE_3_SIZE = "clamp(115px, 62vw, 220px)";
const CUBE_4_SIZE = "clamp(119px, 60vw, 238px)";
const CUBE_5_SIZE = "clamp(123px, 63vw, 240px)";

const PYRAMID_LAYOUT: Record<
  CubeId,
  { left: string; top: string; zIndex: number; size: string }
> = {
  1: { left: "54%", top: "-23%", zIndex: 5, size: CUBE_1_SIZE },
  2: { left: "23%", top: "20%", zIndex: 3, size: CUBE_2_SIZE },
  3: { left: "85%", top: "20%", zIndex: 4, size: CUBE_3_SIZE },
  4: { left: "20%", top: "66%", zIndex: 1, size: CUBE_4_SIZE },
  5: { left: "86%", top: "65%", zIndex: 2, size: CUBE_5_SIZE },
};


export const CategoryCubes = () => {
  const [hoveredId, setHoveredId] = useState<CubeId | null>(null);

  return (
    <div
      className="relative w-full flex justify-center items-end"
      style={{
        maxWidth: "min(100%, 420px)",
        aspectRatio: "4 / 3",
        minHeight: "380px",
      }}
    >
      {CUBES.map(({ id, label }) => {
        const layout = PYRAMID_LAYOUT[id];
        const isHovered = hoveredId === id;
        const src = cubeAsset(id, isHovered ? "pink" : "blue");
        const size = layout.size;

        return (
          <motion.button
            key={id}
            type="button"
            className="absolute cursor-pointer border-none bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2200b8] focus-visible:ring-offset-2 rounded-sm"
            style={{
              left: layout.left,
              top: layout.top,
              zIndex: layout.zIndex,
              width: size,
              height: size,
              transform: "translate(-50%, 0)",
            }}
            aria-label={label}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
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
