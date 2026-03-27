import { ProjectNav } from "../components/ProjectNav";

export default function PackUp({ onSelectSection }: { onSelectSection: (id: string) => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="font-['Permanent_Marker'] text-4xl md:text-5xl text-[#ff0090] tracking-[2px]">
            Pack Up
          </h2>
          <p className="font-['Bricolage_Grotesque'] font-light text-lg text-[#2200b8] tracking-[0.5px]">
            Project page coming soon
          </p>
        </div>
      </div>
      <ProjectNav currentProject="packup" onSelectSection={onSelectSection} />
    </div>
  );
}
