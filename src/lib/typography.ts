/** Marker sizing without section padding (use with shared wrapper padding for baseline alignment). */
export const sectionTitleCoreClass =
  "font-['Permanent_Marker'] text-[28px] md:text-[30px] text-[#ff0090] tracking-[2px]";

/** pt matches section column rhythm so sticky titles keep the same gap below the nav while scrolling. */
export const sectionTitleClass = `${sectionTitleCoreClass} pt-4 md:pt-8`;

/** pb for overlap when sticky; top spacing comes from sectionTitleClass. */
export const stickyTitleClass =
  `sticky top-[56px] md:top-[72px] z-40 ${sectionTitleClass} self-start -mt-1 pb-2 bg-[#fcf7ee]`;

export const projectNameClass =
  "font-['Bricolage_Grotesque'] font-bold text-[24px] md:text-[24px] text-[#2200b8] tracking-[1.5px]";

export const subTitleClass =
  "font-['Bricolage_Grotesque'] font-semibold text-[19px] md:text-[19px] text-[#2200b8] tracking-[1.4px]";

export const smallTitleClass =
  "font-['Bricolage_Grotesque'] font-normal text-[17px] md:text-[17px] text-[#2200b8] tracking-[1px]";

export const bodyTextClass =
  "font-['Bricolage_Grotesque'] font-light text-[14px] md:text-[14px] text-[#2200b8] tracking-[0.7px] leading-[1.5]";
