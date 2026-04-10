import { sectionTitleCoreClass } from "../lib/typography";

/**
 * Mobile-only sticky section title rendered outside the PageGrid
 * so it has the full section height as its scroll container.
 * Hidden on md+ where the grid-based sticky column handles it.
 */
export function MobileStickyTitle({
  children,
  leading = "leading-none",
}: {
  children: React.ReactNode;
  leading?: string;
}) {
  return (
    <div
      className={`sticky top-[56px] z-40 bg-[#fcf7ee] px-[var(--grid-margin)] pt-9 pb-3 md:hidden -mt-1`}
    >
      <h2 className={`${sectionTitleCoreClass} ${leading}`}>{children}</h2>
    </div>
  );
}

/** Grid column wrapper — visible only on md+ (desktop sticky column). */
export const TITLE_COL_DESKTOP_CLASS =
  "hidden md:flex col-span-8 md:col-start-1 md:col-end-3 w-max max-w-full md:w-full md:max-w-full self-start md:self-stretch md:flex-col md:items-start pb-[length:var(--pad-sticky-col-pb)]";
