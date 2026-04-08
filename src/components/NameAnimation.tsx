import { useState, useEffect } from "react";

const VARIANTS = ["", "M", "MI", "MIK", "MIKA", "MIK", "MI", "M"];

export const NameAnimation = () => {
  const [index, setIndex] = useState(4);

  useEffect(() => {
    const delay = index === 4 ? 800 : 200;
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % VARIANTS.length);
    }, delay);
    return () => clearTimeout(id);
  }, [index]);

  return (
    <span className="inline-block shrink-0 text-left font-['Permanent_Marker'] text-[clamp(32px,5.5vw,70px)] text-[#ff0090] tracking-[5px] w-[clamp(92px,26vw,200px)] min-h-[1em] leading-none">
      {VARIANTS[index] || "\u00A0"}
    </span>
  );
};
