import { useState } from "react";
import { DragCarousel } from "./DragCarousel";
import { cloudinaryUrl } from "../../lib/cloudinary";

const IMAGES = [
  "fairymaze1_hpnn8s_iyckpo.jpg",
  "start_d6hknt_ebrz5b.jpg",
  "run1_mlpq80_zomihb.jpg",
  "swamp2_oqflgy_c9hr7v.jpg",
  "magicstump2_e7skrj_jkqw9x.jpg",
  "river_view_v85kxl_y46dq9.jpg",
  "trail_jp0hxe_tqhdqd.jpg",
  "portalwin_aneuma_hio0nf.jpg",
  "magicstump3_pzbyk3_x6l3kt.jpg",
];

const DEFAULT_TEMPLATE = "1fr 1fr 1fr";

export function VisualStyleGallery() {
  const [hovered, setHovered] = useState<number | null>(null);

  const hoveredCol = hovered !== null ? hovered % 3 : -1;
  const hoveredRow = hovered !== null ? Math.floor(hovered / 3) : -1;

  const cols = [0, 1, 2].map((c) => (c === hoveredCol ? "4fr" : "1fr")).join(" ");
  const rows = [0, 1, 2].map((r) => (r === hoveredRow ? "4fr" : "1fr")).join(" ");

  return (
    <>
      {/* Mobile: carousel */}
      <div className="md:hidden">
        <DragCarousel>
          {IMAGES.map((img) => (
            <img
              key={img}
              src={cloudinaryUrl(img)}
              alt=""
              className="w-[300px] h-[188px] rounded-[5px] object-cover shrink-0"
            />
          ))}
        </DragCarousel>
      </div>

      {/* Desktop: 3x3 grid with hover push effect */}
      <div
        className="hidden md:grid gap-3 h-[580px]"
        style={{
          gridTemplateColumns: hovered !== null ? cols : DEFAULT_TEMPLATE,
          gridTemplateRows: hovered !== null ? rows : DEFAULT_TEMPLATE,
          transition: "grid-template-columns 0.35s ease, grid-template-rows 0.35s ease",
        }}
        onMouseLeave={() => setHovered(null)}
      >
        {IMAGES.map((img, i) => (
          <img
            key={img}
            src={cloudinaryUrl(img)}
            alt=""
            onMouseEnter={() => setHovered(i)}
            className={`w-full h-full object-cover cursor-pointer transition-all duration-300 min-h-0 ${
              hovered === i
                ? "rounded-[10px] opacity-100"
                : hovered !== null
                  ? "rounded-[5px] opacity-50"
                  : "rounded-[5px] opacity-100"
            }`}
          />
        ))}
      </div>
    </>
  );
}
