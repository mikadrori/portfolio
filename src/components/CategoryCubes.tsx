import { motion } from "motion/react";

const CUBE_IMAGES = [
  "https://www.figma.com/api/mcp/asset/2a2e3dc0-e056-4734-8022-2a1144f3421c",
  "https://www.figma.com/api/mcp/asset/f42a4dbf-512a-4830-9f40-05a859ad401f",
  "https://www.figma.com/api/mcp/asset/167fe4f0-a2f8-4b0e-9c21-e99cbe25dcc9",
  "https://www.figma.com/api/mcp/asset/00b06c52-d146-4b19-b6ef-40b17a901629",
  "https://www.figma.com/api/mcp/asset/66ed5e7c-e566-49b7-bc1e-daea456bb070",
  "https://www.figma.com/api/mcp/asset/2a2e3dc0-e056-4734-8022-2a1144f3421c",
];

const POSITIONS = [
  { row: 3, col: 0 },
  { row: 3, col: 1 },
  { row: 3, col: 2 },
  { row: 2, col: 0.5 },
  { row: 2, col: 1.5 },
  { row: 1, col: 1 },
];

export const CategoryCubes = () => {
  return (
    <div className="relative w-full max-w-[400px] aspect-[4/3] md:max-w-[500px]">
      {POSITIONS.map((p, i) => {
        const baseW = 80 - p.row * 15;
        const size = Math.max(60, baseW);
        return (
          <motion.div
            key={i}
            className="absolute cursor-pointer bg-contain bg-no-repeat"
            style={{
              left: p.col * 35 + "%",
              top: (3 - p.row) * 30 + "%",
              width: size,
              height: size * 1.02,
              backgroundImage: "url(" + CUBE_IMAGES[i] + ")",
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        );
      })}
    </div>
  );
};
