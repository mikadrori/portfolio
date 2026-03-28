import { useEffect } from "react";
import { ProjectNav } from "../components/ProjectNav";
import { sectionTitleClass, bodyTextClass } from "../lib/typography";

export default function Aviv({ onSelectSection, onReady }: { onSelectSection: (id: string) => void; onReady?: () => void }) {
  useEffect(() => { onReady?.(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className={sectionTitleClass}>
            Moonlight Atmosphere
          </h2>
          <p className={bodyTextClass}>
            Project page coming soon
          </p>
        </div>
      </div>
      <ProjectNav currentProject="aviv" onSelectSection={onSelectSection} />
    </div>
  );
}
