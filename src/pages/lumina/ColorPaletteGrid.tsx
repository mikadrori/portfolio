const PALETTE = [
  { large: "#0d0439", narrow: "#ffe786" },
  { large: "#1d1171", narrow: "#00ffd4" },
  { large: "#3d00fe", narrow: "#fe00d4" },
];

export function ColorPaletteGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-row lg:flex-col gap-3 ${className}`}>
      {PALETTE.map((row, i) => (
        <div key={i} className="flex lg:flex-1 gap-2 lg:gap-3 items-stretch">
          <div
            className="w-[60px] lg:flex-[3] h-[60px] lg:h-auto rounded-[8px]"
            style={{ backgroundColor: row.large }}
          />
          <div
            className="w-[20px] h-[60px] lg:h-auto lg:flex-1 rounded-[8px]"
            style={{ backgroundColor: row.narrow }}
          />
        </div>
      ))}
    </div>
  );
}
