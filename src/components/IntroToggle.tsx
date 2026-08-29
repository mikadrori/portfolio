import { useId, useState, type ReactNode } from "react";
import { smallTitleClass } from "../lib/typography";
import { currentPageId, slugify, trackEvent } from "../lib/analytics";

const buttonBaseClass = `${smallTitleClass} inline-flex w-fit px-3 py-1 cursor-pointer`;

interface IntroToggleProps {
  /** Button label shown at all times (e.g. "Brief"). */
  label: string;
  /** Body content revealed when the button is open. */
  children: ReactNode;
  /** Extra classes on the outer column wrapper. */
  className?: string;
}

/**
 * Project-intro Brief / Concept / Tools control.
 * Filled blue button with cream text; hover and open state switches to pink.
 * Body text is hidden until click.
 * Children are always rendered (collapsed to h-0 when closed) so the
 * toggle keeps a constant width and buttons never shift on open/close.
 */
export function IntroToggle({ label, children, className = "" }: IntroToggleProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const panelId = useId();

  const pink = open || hovered;

  return (
    <div className={`flex min-w-0 flex-col gap-4 ${className}`.trim()}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          // Only the open is interesting: this copy stays invisible until someone asks for it.
          if (!open) {
            const page = currentPageId();
            trackEvent(`intro_${page}_${slugify(label)}`, { page, panel: label });
          }
          setOpen((prev) => !prev);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={buttonBaseClass}
        style={{
          backgroundColor: pink ? "#ff0090" : "#2200b8",
          color: "#fcf7ee",
          transition: "background-color 0.15s ease",
        }}
      >
        {label}
      </button>
      <div
        id={panelId}
        aria-hidden={!open}
        className={open ? "min-w-0" : "h-0 overflow-hidden opacity-0"}
      >
        {children}
      </div>
    </div>
  );
}
