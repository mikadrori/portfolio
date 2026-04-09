const DARK_COL = ["#0d0439", "#1d1171", "#3d00fe"];
const BRIGHT_COL = ["#ffe786", "#00ffd4", "#fe00d4"];

export function ColorPaletteGrid({ className = "" }: { className?: string }) {
  return (
    <>
      {/* Mobile / tablet: original 3-col layout (dark row then bright row) */}
      <div className={`grid grid-cols-3 gap-3 lg:hidden ${className}`}>
        {DARK_COL.map((color) => (
          <div
            key={color}
            className="aspect-[5/3] rounded-[8px]"
            style={{ backgroundColor: color }}
          />
        ))}
        {BRIGHT_COL.map((color) => (
          <div
            key={color}
            className="aspect-[6/1.5] rounded-[8px]"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Desktop (lg+): 2-col × 3-row — dark left, bright right, stretches to parent height */}
      <div className={`hidden lg:grid grid-cols-[7fr_3fr] grid-rows-3 gap-3 ${className}`}>
        {DARK_COL.map((dark, i) => {
          const bright = BRIGHT_COL[i];
          return (
            <div key={dark} className="contents">
              <div className="rounded-[8px] min-h-0" style={{ backgroundColor: dark }} />
              <div className="rounded-[8px] min-h-0" style={{ backgroundColor: bright }} />
            </div>
          );
        })}
      </div>
    </>
  );
}
