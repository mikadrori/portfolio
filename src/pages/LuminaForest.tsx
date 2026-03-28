import { useEffect } from "react";
import { ProjectNav } from "../components/ProjectNav";
import { sectionTitleClass, bodyTextClass } from "../lib/typography";

export default function LuminaForest({ onSelectSection, onReady }: { onSelectSection: (id: string) => void; onReady?: () => void }) {
  useEffect(() => { onReady?.(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className={sectionTitleClass}>
            Lumina Forest
          </h2>
          <p className={bodyTextClass}>
            Coming soon
          </p>
        </div>
      </div>
      <ProjectNav currentProject="lumina" onSelectSection={onSelectSection} />
    </div>
  );
}
