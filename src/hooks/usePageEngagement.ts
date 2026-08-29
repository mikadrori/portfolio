import { useEffect } from "react";
import { slugify, trackEvent } from "../lib/analytics";

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

/** A section counts as reached once it overlaps the middle half of the screen. */
const BAND_TOP = 0.25;
const BAND_BOTTOM = 0.75;

/** Section titles render twice (mobile sticky + desktop column); either one names the section. */
function sectionLabel(section: Element): string | null {
  const text = section.querySelector("h2")?.textContent?.trim();
  return text ? text : null;
}


/**
 * Reports how far visitors actually get through a project page.
 *
 * Emits three kinds of event, all scoped to the current page:
 * - `view_<page>` once per route, giving the funnel its denominator
 * - `section_<page>_<slug>` the first time each `<section>` crosses mid-screen
 * - `scroll_<depth>` at 25 / 50 / 75 / 100% of the page
 *
 * Event names carry the page and section because Clarity builds funnels from
 * distinct event names — a shared name with the section as a tag would make
 * every funnel step identical. The readable page/section values are also sent
 * as tags so recordings stay filterable.
 *
 * Together these answer "where do people stop reading" per case study, which
 * Clarity's pixel-based scroll map cannot do across breakpoints.
 *
 * Both checks share one scroll handler that detaches once everything on the
 * page has been recorded. Project pages are lazy-loaded inside
 * `AnimatePresence`, so sections appear after this effect first runs — a
 * MutationObserver re-runs the check as they mount.
 */
export function usePageEngagement(
  pageId: string | null,
  containerRef: React.RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const page = pageId ?? "home";
    trackEvent(`view_${slugify(page)}`, { page });

    const container = containerRef.current;
    if (!container || pageId === null) return;

    const seenSections = new Set<string>();
    const seenMilestones = new Set<number>();
    let sectionCount = 0;

    /** Everything is recorded once — stop listening rather than throttling forever. */
    const isComplete = () =>
      sectionCount > 0 &&
      seenSections.size >= sectionCount &&
      seenMilestones.size === SCROLL_MILESTONES.length;

    const report = () => {
      const viewportHeight = window.innerHeight;
      const bandTop = viewportHeight * BAND_TOP;
      const bandBottom = viewportHeight * BAND_BOTTOM;

      const sections = container.querySelectorAll("section");
      sectionCount = sections.length;

      for (const section of sections) {
        const { top, bottom } = section.getBoundingClientRect();
        if (top > bandBottom || bottom < bandTop) continue;
        const label = sectionLabel(section);
        if (!label || seenSections.has(label)) continue;
        seenSections.add(label);
        trackEvent(`section_${slugify(page)}_${slugify(label)}`, {
          page,
          section: label,
        });
      }

      const scrollable = document.documentElement.scrollHeight - viewportHeight;
      if (scrollable <= 0) return;
      const percent = (window.scrollY / scrollable) * 100;
      for (const milestone of SCROLL_MILESTONES) {
        if (percent < milestone || seenMilestones.has(milestone)) continue;
        seenMilestones.add(milestone);
        trackEvent(`scroll_${milestone}`, { page, depth: milestone });
      }
    };

    const mutationObserver = new MutationObserver(() => report());

    const stop = () => {
      mutationObserver.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };

    function onScrollOrResize() {
      report();
      if (isComplete()) stop();
    }

    report();
    mutationObserver.observe(container, { childList: true, subtree: true });
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return stop;
  }, [pageId, containerRef]);
}
