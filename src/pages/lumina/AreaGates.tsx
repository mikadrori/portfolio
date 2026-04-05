import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DragCarousel, PlaceholderCard } from "./DragCarousel";
import { bodyTextClass, smallTitleClass } from "../../lib/typography";

type AreaId = "yellow" | "green" | "pink";

interface AreaData {
  id: AreaId;
  name: string;
  environment: string;
  guardian: string;
  goal: string;
  obstacle: string;
  collectibleLabel: string;
  obstacleLabel: string;
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
      <div
        className="w-[56px] h-[64px] md:w-[76px] md:h-[88px] rounded-t-[40%] rounded-b-[6px] flex items-center justify-center"
        style={{
          backgroundColor: GATE_COLORS[area.id],
          boxShadow: isSelected
            ? `0 0 20px ${GATE_COLORS[area.id]}80`
            : "none",
        }}
      >
        <div className="w-[28px] h-[36px] md:w-[38px] md:h-[46px] bg-[#0d0439] rounded-t-[40%] rounded-b-[3px] opacity-80" />
      </div>
    </motion.button>
  );
}

function AreaContent({ area }: { area: AreaData }) {
  return (
    <motion.div
      key={area.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: text info in 3 columns */}
        <div className="flex-1 flex flex-col gap-4">
          <h4 className="font-['Bricolage_Grotesque'] font-normal text-[20px] md:text-[22px] text-[#fcf7ee] tracking-[0.75px]">
            {area.name}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            {/* Column 1: Environment */}
            <div>
              <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] md:text-[16px] text-[#fcf7ee] tracking-[0.5px]">
                Environment
              </p>
              <p className={`${bodyTextClass} !text-[#fcf7ee] mt-1`}>
                {area.environment}
              </p>
            </div>
            {/* Column 2: Goal */}
            <div>
              <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] md:text-[16px] text-[#fcf7ee] tracking-[0.5px]">
                Goal
              </p>
              <p className={`${bodyTextClass} !text-[#fcf7ee] mt-1`}>
                {area.goal}
              </p>
            </div>
            {/* Column 3: Guardian + Obstacle stacked */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] md:text-[16px] text-[#fcf7ee] tracking-[0.5px]">
                  Guardian
                </p>
                <p className={`${bodyTextClass} !text-[#fcf7ee] mt-1`}>
                  {area.guardian}
                </p>
              </div>
              <div>
                <p className="font-['Bricolage_Grotesque'] font-normal text-[14px] md:text-[16px] text-[#fcf7ee] tracking-[0.5px]">
                  Obstacle
                </p>
                <p className={`${bodyTextClass} !text-[#fcf7ee] mt-1`}>
                  {area.obstacle}
                </p>
              </div>
            </div>
          </div>

          {/* Collectible + obstacle sprites */}
          <div className="flex gap-6 mt-2">
            <div className="w-[80px] h-[80px] bg-[#1d1171] rounded-[8px] flex items-center justify-center">
              <span className="text-[10px] text-[#fcf7ee80] text-center">
                {area.collectibleLabel}
              </span>
            </div>
            <div className="w-[80px] h-[80px] bg-[#1d1171] rounded-[8px] flex items-center justify-center">
              <span className="text-[10px] text-[#fcf7ee80] text-center">
                {area.obstacleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Right: character placeholder */}
        <div className="w-full md:w-[240px] h-[260px] bg-[#1d1171] rounded-[12px] shrink-0 flex items-center justify-center">
          <span className="text-[#fcf7ee40] text-sm">{area.guardian}</span>
        </div>
      </div>

      {/* Carousel placeholders */}
      <div className="mt-6">
        <DragCarousel>
          <PlaceholderCard
            width="w-[260px] md:w-[360px]"
            height="h-[180px] md:h-[220px]"
            label="Gameplay"
          />
          <PlaceholderCard
            width="w-[140px]"
            height="h-[180px] md:h-[220px]"
            label=""
          />
        </DragCarousel>
      </div>
    </motion.div>
  );
}

export function AreaGates() {
  const [selected, setSelected] = useState<AreaId | null>(null);
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
  };

  const panelRounding = "rounded-[12px]";

  const tabRadius =
    selectedIdx === 0
      ? { borderTopLeftRadius: 12, borderTopRightRadius: 16, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
      : { borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };

  return (
    <div className="flex flex-col gap-6">
      <h3 className={`${smallTitleClass} !text-[22px] md:!text-[19px]`}>
        Areas
      </h3>

      <div className="flex flex-col">
        {/* Gates row */}
        <div ref={rowRef} className="relative z-[1] flex gap-12 md:gap-20 items-end pl-4">
          {/* Single persistent tab — slides to the active gate */}
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
                <AnimatePresence mode="wait">
                  {selectedArea && (
                    <AreaContent key={selectedArea.id} area={selectedArea} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
