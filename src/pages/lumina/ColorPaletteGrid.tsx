const DARK_ROW = ["#0d0439", "#1d1171", "#3d00fe"];
const BRIGHT_ROW = ["#ffe786", "#00ffd4", "#fe00d4"];

export function ColorPaletteGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {DARK_ROW.map((color) => (
        <div
          key={color}
          className="aspect-[5/3] rounded-[8px]"
          style={{ backgroundColor: color }}
        />
      ))}
      {BRIGHT_ROW.map((color) => (
        <div
          key={color}
          className="aspect-[6/1.5] rounded-[8px]"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
