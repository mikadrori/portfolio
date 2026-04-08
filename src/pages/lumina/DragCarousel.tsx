import { type ReactNode } from "react";
import { useDragScroll } from "../../hooks/useDragScroll";

interface DragCarouselProps {
  children: ReactNode;
  className?: string;
  /** Extra space after the last item for horizontal scroll (e.g. videos). Set false for tight strips like sprite rows. */
  trailingScrollPadding?: boolean;
}

export function DragCarousel({
  children,
  className = "",
  trailingScrollPadding = true,
}: DragCarouselProps) {
  const { ref, onMouseDown } = useDragScroll();

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className={`overflow-x-auto scrollbar-hide cursor-grab ${className}`}
    >
      <div
        className={`flex w-max gap-4 md:gap-8`}
      >
        {children}
      </div>
    </div>
  );
}

export function PlaceholderCard({
  width = "w-[260px] md:w-[320px]",
  height = "h-[180px] md:h-[240px]",
  label,
  isVideo = false,
}: {
  width?: string;
  height?: string;
  label?: string;
  isVideo?: boolean;
}) {
  return (
    <div
      className={`${width} ${height} bg-[#d9d9d9] rounded-[12px] shrink-0 flex items-center justify-center pointer-events-none`}
    >
      {label && (
        <span className="text-[#999] text-sm font-['Bricolage_Grotesque'] select-none">
          {isVideo ? "▶ " : ""}{label}
        </span>
      )}
    </div>
  );
}
