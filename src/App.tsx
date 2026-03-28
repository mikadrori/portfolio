import { useState, useRef, useCallback } from "react";
import { NavBar } from "./components/NavBar";
import { Home } from "./pages/Home";
import { Footer } from "./components/Footer";
import { ContentArea } from "./components/ContentArea";
import { type ProjectId } from "./components/CategoryCubes";

type TransitionSource = "cube" | "nav" | "next-project";

export default function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [cubeAnimKey, setCubeAnimKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const transitionSource = useRef<TransitionSource>("cube");
  const prevSection = useRef<string | null>(null);
  const scrollHandledByExit = useRef(false);

  const handleSelectFromCube = useCallback((id: ProjectId) => {
    if (id === activeSection) {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    transitionSource.current = "cube";
    scrollHandledByExit.current = false;
    prevSection.current = activeSection;
    setActiveSection(id);
  }, [activeSection]);

  const handleSelectSection = useCallback((id: string | null) => {
    if (id === activeSection) return;
    transitionSource.current = "nav";
    scrollHandledByExit.current = false;
    prevSection.current = activeSection;
    if (id === null) setCubeAnimKey((k) => k + 1);
    setActiveSection(id);
  }, [activeSection]);

  const handleSelectFromProject = useCallback((id: string) => {
    if (id === activeSection) return;
    transitionSource.current = "next-project";
    scrollHandledByExit.current = false;
    prevSection.current = activeSection;
    setActiveSection(id);
  }, [activeSection]);

  const handleExitComplete = useCallback(() => {
    if (activeSection === null) {
      window.scrollTo({ top: 0 });
      return;
    }

    scrollHandledByExit.current = true;
    const source = transitionSource.current;
    if (source === "cube") {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      contentRef.current?.scrollIntoView();
    }
  }, [activeSection]);

  const handleContentReady = useCallback(() => {
    if (scrollHandledByExit.current) return;
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#fcf7ee] selection:bg-[#2200b8] selection:text-[#fcf7ee]">
      <NavBar onSelectSection={handleSelectSection} />
      <Home onSelectProject={handleSelectFromCube} animationKey={cubeAnimKey} />
      <div ref={contentRef}>
        <ContentArea
          sectionId={activeSection}
          onSelectSection={handleSelectFromProject}
          onExitComplete={handleExitComplete}
          onContentReady={handleContentReady}
        />
      </div>
      {activeSection && <Footer />}
    </main>
  );
}
