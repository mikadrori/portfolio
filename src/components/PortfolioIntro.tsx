import { useState, useEffect } from "react";

const ARROW_VARIANTS = ["", ">", ">>", ">>>", ">>", ">", ""];

export const PortfolioIntro = () => {
  const [index, setIndex] = useState(3);

  useEffect(() => {
    const delay = index === 3 ? 600 : 150;
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % ARROW_VARIANTS.length);
    }, delay);
    return () => clearTimeout(id);
  }, [index]);

  return (
    <div className="flex items-baseline gap-2 flex-nowrap overflow-x-auto my-2">
      <span className="font-['Bricolage_Grotesque'] font-light text-base md:text-lg text-[#2200b8] tracking-[0.5px] whitespace-nowrap shrink-0">
        And this is my portfolio. Check out my projects
      </span>
      <span className="inline-block font-['Bricolage_Grotesque'] font-light text-base md:text-lg text-[#2200b8] tracking-[0.5px] min-w-[48px] min-h-[1em] shrink-0">
        {ARROW_VARIANTS[index] || "\u00A0"}
      </span>
    </div>
  );
};
