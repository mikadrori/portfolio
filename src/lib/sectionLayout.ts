/** Use these for any PageGrid inside a content <section>. Matches We Were Liars "Final Intro" vertical rhythm. */

export const sectionPageGridPaddingClass = "py-[length:var(--pad-section-y)]";

export const sectionColumnPaddingClass = "py-[length:var(--pad-column-y)]";

export const sectionPageGridClass = `items-start ${sectionPageGridPaddingClass}`;

export const sectionPageGridStretchClass = `items-start md:items-stretch ${sectionPageGridPaddingClass}`;

/**
 * Use on the outer wrapper of a horizontal carousel when the parent cell is
 * `md:col-start-3 md:col-span-4` (text through column 6). Extends the strip to column 7.
 * See `.cursor/rules/grid-carousels.mdc`.
 */
export const extendContentToCol7Class =
  "w-full min-w-0 md:w-[calc(100%+25%+var(--grid-gutter)/4)] md:max-w-none";
