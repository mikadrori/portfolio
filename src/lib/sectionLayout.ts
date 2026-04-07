/** Use these for any PageGrid inside a content <section>. Matches We Were Liars "Final Intro" vertical rhythm. */

export const sectionPageGridPaddingClass = "py-8 md:py-12";

export const sectionColumnPaddingClass = "py-4 md:py-8";

export const sectionPageGridClass = `items-start ${sectionPageGridPaddingClass}`;

export const sectionPageGridStretchClass = `items-start md:items-stretch ${sectionPageGridPaddingClass}`;

/**
 * Use on the outer wrapper of a horizontal carousel when the parent cell is
 * `md:col-start-3 md:col-span-4` (text through column 6). Extends the strip to column 7.
 * See `.cursor/rules/grid-carousels.mdc`.
 */
export const extendContentToCol7Class =
  "w-full min-w-0 md:w-[calc(100%+25%+var(--grid-gutter)/4)] md:max-w-none";
