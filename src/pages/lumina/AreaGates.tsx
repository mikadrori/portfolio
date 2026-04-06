import { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DragCarousel } from "./DragCarousel";
import { FbxModelViewer } from "./FbxModelViewer";
import { AutoPlayVideo } from "./AutoPlayVideo";
import { bodyTextClass } from "../../lib/typography";
import { cloudinaryUrl } from "../../lib/cloudinary";

type AreaId = "yellow" | "green" | "pink";

interface CarouselItem {
  type: "video" | "image";
  src: string;
}

interface AreaData {
  id: AreaId;
  name: string;
  environment: string;
  guardian: string;
  goal: string;
  obstacle: string;
  collectibleLabel: string;
  obstacleLabel: string;
  gateImage: string;
  guardianGlb: string;
  collectibleImg: string;
  obstacleImg: string;
  carouselItems: CarouselItem[];
}

const AREAS: AreaData[] = [
  {
    id: "yellow",
    name: "The Fairy Village",
    environment:
      "A village filled with fairy houses, structured as a dark and mysterious maze",
    guardian: "Deceptive Fairies",
    goal: "Find the mushroom located inside the Great Tree at the center of the maze",
    obstacle: "Toxic mushrooms",
    collectibleLabel: "Yellow mushroom",
    obstacleLabel: "Poison mushroom",
    gateImage: cloudinaryUrl("Arch_yellow_big_ttysac_zkkaxq.png"),
    guardianGlb: cloudinaryUrl("Meshy_AI_Golden_Leaf_Fairy_0404114531_texture-v1_1_vhbwa0_sbsflm.glb", { raw: true }),
    collectibleImg: cloudinaryUrl("sprite_yellow_mushroom_wbx2er_wrvtic.png"),
    obstacleImg: cloudinaryUrl("sprite_poisonmushroom_o2zidl_x3dfo1.png"),
    carouselItems: [
      { type: "video", src: cloudinaryUrl("yellow_mission_ltcsai_oeu7wy.mp4", { resourceType: "video" }) },
      { type: "video", src: cloudinaryUrl("fairymaze_v7gifw_w15slq.mp4", { resourceType: "video" }) },
      { type: "image", src: cloudinaryUrl("fairymaze1_hpnn8s_iyckpo.jpg") },
      { type: "image", src: cloudinaryUrl("fairymaze2_lngr3w_oyf6zv.jpg") },
      { type: "image", src: cloudinaryUrl("fairymaze4_unep0j_yo6azx.jpg") },
      { type: "image", src: cloudinaryUrl("fairymaze7_gxlpuy_xtqzx2.jpg") },
      { type: "image", src: cloudinaryUrl("fairymaze10_cltscy_nbjs6i.jpg") },
      { type: "image", src: cloudinaryUrl("fairymaze11_qk4zm7_xoy8dt.jpg") },
    ],
  },
  {
    id: "green",
    name: "The Troll's Swamp",
    environment:
      "A murky and putrid swamp, featuring a jumping course of stepping stones and lily pads",
    guardian: "Grumpy Troll",
    goal: "Find the mushroom in the stone gate at the end of the trail",
    obstacle: "Poisoned swamp water",
    collectibleLabel: "Blue mushroom",
    obstacleLabel: "Swamp",
    gateImage: cloudinaryUrl("Arch_green_big_gohb2c_vczigg.png"),
    guardianGlb: cloudinaryUrl("Meshy_AI_Goblin_Grumble_0404113802_texture_vpqydy_rfocn4.glb", { raw: true }),
    collectibleImg: cloudinaryUrl("sprite_blue_mushroom_edj95u_aewdfw.png"),
    obstacleImg: cloudinaryUrl("sprite_swamp_ju4zed_owwkf5.png"),
    carouselItems: [
      { type: "video", src: cloudinaryUrl("green_mission_d5gkkl_cysyrc.mp4", { resourceType: "video" }) },
      { type: "video", src: cloudinaryUrl("swamp_xnndgt_ziuzbv.mp4", { resourceType: "video" }) },
      { type: "image", src: cloudinaryUrl("swamp2_oqflgy_c9hr7v.jpg") },
      { type: "image", src: cloudinaryUrl("swamp5_tp6f92_ufntfb.jpg") },
      { type: "image", src: cloudinaryUrl("swamp6_fy2m2c_elvb6c.jpg") },
      { type: "image", src: cloudinaryUrl("swamp7_oijc2o_i33p9m.jpg") },
      { type: "image", src: cloudinaryUrl("swamp8_l4pd4c_oufncu.jpg") },
    ],
  },
  {
    id: "pink",
    name: "The Enchanted River",
    environment:
      "A rushing river surrounded by glowing trees, an in-water obstacle course, and a bridge",
    guardian: "Mischievous River Elf",
    goal: "Find the mushroom at the end of the rushing river",
    obstacle: "Floating logs",
    collectibleLabel: "Pink mushroom",
    obstacleLabel: "Log",
    gateImage: cloudinaryUrl("Arch_pink_big_fwcxdq_knjlog.png"),
    guardianGlb: cloudinaryUrl("Meshy_AI_Floral_Sprite_0404113616_texture_b4ydnh_a5ywwl.glb", { raw: true }),
    collectibleImg: cloudinaryUrl("sprite_pink_mushroom_pbseb2_asriqy.png"),
    obstacleImg: cloudinaryUrl("sprite_log_mzfgs4_ohynjg.png"),
    carouselItems: [
      { type: "video", src: cloudinaryUrl("pink_mission_ypme3g_onejtk.mp4", { resourceType: "video" }) },
      { type: "video", src: cloudinaryUrl("river_erlzvg_npf2dk.mp4", { resourceType: "video" }) },
      { type: "image", src: cloudinaryUrl("river_view_v85kxl_y46dq9.jpg") },
      { type: "image", src: cloudinaryUrl("river2_jat1wd_lbywfb.jpg") },
      { type: "image", src: cloudinaryUrl("river5_pcy2im_mrmdko.jpg") },
      { type: "image", src: cloudinaryUrl("river6_bjlhqm_yk02ga.jpg") },
      { type: "image", src: cloudinaryUrl("river9_rtggfh_pnqvzj.jpg") },
      { type: "image", src: cloudinaryUrl("river_9_yt1bt2_kwwkzw.jpg") },
    ],
  },
];

const GATE_COLORS: Record<AreaId, string> = {
  yellow: "#ffe786",
  green: "#00ffd4",
  pink: "#fe00d4",
};

const AREA_INDEX: Record<AreaId, number> = { yellow: 0, green: 1, pink: 2 };

function GateSprite({
  area,
  isSelected,
  onSelect,
}: {
  area: AreaData;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative z-10 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none"
    >
      <img
        src={area.gateImage}
        alt={`${area.name} gate`}
        className="w-[56px] h-[64px] md:w-[76px] md:h-[88px] object-contain"
        style={{
          filter: isSelected
            ? `drop-shadow(0 0 12px ${GATE_COLORS[area.id]}80)`
            : "none",
        }}
      />
    </motion.button>
  );
}

function AreaContent({ area, visible }: { area: AreaData; visible: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={visible ? "" : "hidden"}
    >
      <div className="relative">
        <div className="flex flex-col gap-4 xl:pr-[280px]">
          <h4 className="font-['Bricolage_Grotesque'] font-normal text-[25px] text-[#fcf7ee] tracking-[0.75px]">
            {area.name}
          </h4>

          {/* Guardian — below title on <xl, absolutely positioned on xl+ */}
          <div className={`xl:absolute xl:right-0 xl:top-0 xl:h-full ${area.id === "yellow" ? "xl:w-[220px]" : "xl:w-[260px]"}`}>
            <FbxModelViewer
              url={area.guardianGlb}
              label={area.guardian}
              transparent
              className={`w-full ${area.id === "yellow" ? "h-[240px]" : "h-[300px]"}`}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="font-['Bricolage_Grotesque'] font-normal text-[18px] text-[#fcf7ee] tracking-[0.54px]">
                Environment
              </p>
              <p className={`${bodyTextClass} !text-[#fcf7ee] mt-1`}>
                {area.environment}
              </p>
            </div>
            <div>
              <p className="font-['Bricolage_Grotesque'] font-normal text-[18px] text-[#fcf7ee] tracking-[0.54px]">
                Goal
              </p>
              <p className={`${bodyTextClass} !text-[#fcf7ee] mt-1`}>
                {area.goal}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-['Bricolage_Grotesque'] font-normal text-[18px] text-[#fcf7ee] tracking-[0.54px]">
                  Guardian
                </p>
                <p className={`${bodyTextClass} !text-[#fcf7ee] mt-1`}>
                  {area.guardian}
                </p>
              </div>
              <div>
                <p className="font-['Bricolage_Grotesque'] font-normal text-[18px] text-[#fcf7ee] tracking-[0.54px]">
                  Obstacle
                </p>
                <p className={`${bodyTextClass} !text-[#fcf7ee] mt-1`}>
                  {area.obstacle}
                </p>
              </div>
            </div>

            {/* Sprites — side by side below text on <xl, in matched columns on xl+ */}
            <div className="hidden xl:block" />
            <div className="flex gap-4 xl:block">
              <img src={area.collectibleImg} alt={area.collectibleLabel} className="w-[64px] h-[64px] object-contain" />
              <img src={area.obstacleImg} alt={area.obstacleLabel} className="w-[64px] h-[64px] object-contain xl:hidden" />
            </div>
            <div className="hidden xl:block">
              <img src={area.obstacleImg} alt={area.obstacleLabel} className="w-[64px] h-[64px] object-contain" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <DragCarousel>
          {area.carouselItems.map((item, i) =>
            item.type === "video" ? (
              <AutoPlayVideo
                key={i}
                src={item.src}
                className="w-[420px] md:w-[600px] h-[260px] md:h-[375px] shrink-0"
              />
            ) : (
              <img
                key={i}
                src={item.src}
                alt=""
                className="w-[420px] md:w-[600px] h-[260px] md:h-[375px] rounded-[12px] object-cover shrink-0 pointer-events-none"
              />
            )
          )}
        </DragCarousel>
      </div>
    </motion.div>
  );
}

export function AreaGates() {
  const [selected, setSelected] = useState<AreaId | null>(null);
  const [visited, setVisited] = useState<Set<AreaId>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelected("yellow");
      setVisited(new Set(["yellow"]));
    }, 600);
    return () => clearTimeout(timer);
  }, []);
  const gateRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [tabStyle, setTabStyle] = useState({ x: 0, width: 0 });

  const selectedIdx = selected ? AREA_INDEX[selected] : -1;
  const isOpen = selected !== null;
  const selectedArea = AREAS.find((a) => a.id === selected);

  const PAD = 16;

  const measureTab = useCallback(() => {
    if (selectedIdx < 0 || !rowRef.current) return;
    const gate = gateRefs.current[selectedIdx];
    if (!gate) return;

    if (selectedIdx === 0) {
      setTabStyle({
        x: 0,
        width: gate.offsetLeft + gate.offsetWidth + PAD,
      });
    } else {
      setTabStyle({
        x: gate.offsetLeft - PAD,
        width: gate.offsetWidth + PAD * 2,
      });
    }
  }, [selectedIdx]);

  useLayoutEffect(() => {
    measureTab();
  }, [measureTab]);

  const handleSelect = (id: AreaId) => {
    setSelected((prev) => (prev === id ? null : id));
    setVisited((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const panelRounding = "rounded-[12px]";

  const tabRadius =
    selectedIdx === 0
      ? { borderTopLeftRadius: 12, borderTopRightRadius: 16, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
      : { borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-['Bricolage_Grotesque'] font-semibold text-[28px] text-[#2200b8] tracking-[1.4px]">
        Areas
      </h3>

      <div className="flex flex-col">
        {/* Gates row */}
        <div ref={rowRef} className="relative z-[1] flex gap-12 md:gap-20 items-end pl-4">
          <motion.div
            className="absolute left-0 bg-[#0d0439]"
            style={{ top: -12, bottom: -14 }}
            initial={false}
            animate={{
              x: tabStyle.x,
              width: tabStyle.width,
              opacity: isOpen ? 1 : 0,
              ...tabRadius,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              opacity: { duration: 0 },
            }}
          />

          {AREAS.map((area, i) => (
            <div
              key={area.id}
              ref={(el) => { gateRefs.current[i] = el; }}
              className="relative pb-[2px]"
            >
              <div className="relative z-[1]">
                <GateSprite
                  area={area}
                  isSelected={selected === area.id}
                  onSelect={() => handleSelect(area.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Expandable panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="area-panel"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className={`bg-[#0d0439] ${panelRounding} p-6 md:p-8`}>
                {AREAS.filter((area) => visited.has(area.id)).map((area) => (
                  <AreaContent
                    key={area.id}
                    area={area}
                    visible={selected === area.id}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
