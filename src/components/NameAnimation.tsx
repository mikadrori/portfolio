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
    <span className="inline-block font-['Permanent_Marker'] text-[40px] md:text-[60px] lg:text-[70px] text-[#ff0090] tracking-[5px] min-w-[80px] md:min-w-[140px] min-h-[1em] leading-none">
      {VARIANTS[index] || "\u00A0"}
    </span>
  );
};
