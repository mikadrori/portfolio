const PALETTE = [
  { large: "#0d0439", narrow: "#ffe786" },
  { large: "#1d1171", narrow: "#00ffd4" },
  { large: "#3d00fe", narrow: "#fe00d4" },
];

export function ColorPaletteGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {PALETTE.map((row, i) => (
        <div key={i} className="flex gap-3 items-stretch">
          <div
            className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-[8px]"
            style={{ backgroundColor: row.large }}
          />
          <div
            className="w-[35px] md:w-[40px] rounded-[8px]"
            style={{ backgroundColor: row.narrow }}
          />
        </div>
      ))}
    </div>
  );
}
