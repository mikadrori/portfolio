import { useState, useRef, useCallback, useEffect } from "react";
import { NavBar } from "./components/NavBar";
import { Home } from "./pages/Home";
import { Footer } from "./components/Footer";
import { ContentArea } from "./components/ContentArea";
import { type ProjectId } from "./components/CategoryCubes";

type TransitionSource = "cube" | "nav" | "next-project";

export default function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const transitionSource = useRef<TransitionSource>("cube");
  const prevSection = useRef<string | null>(null);

  const handleSelectFromCube = useCallback((id: ProjectId) => {
    if (id === activeSection) {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    transitionSource.current = "cube";
    prevSection.current = activeSection;
    setActiveSection(id);
  }, [activeSection]);

  const handleSelectSection = useCallback((id: string | null) => {
    if (id === activeSection) return;
    transitionSource.current = "nav";
    prevSection.current = activeSection;
    setActiveSection(id);
  }, [activeSection]);

  const handleSelectFromProject = useCallback((id: string) => {
    if (id === activeSection) return;
    transitionSource.current = "next-project";
    prevSection.current = activeSection;
    setActiveSection(id);
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== null && prevSection.current === null) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          contentRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      });
    }
  }, [activeSection]);

  const handleExitComplete = useCallback(() => {
    if (activeSection === null) {
      window.scrollTo({ top: 0 });
      return;
    }

    const source = transitionSource.current;
    if (source === "cube") {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      contentRef.current?.scrollIntoView();
    }
  }, [activeSection]);

  return (
    <main className="min-h-screen flex flex-col bg-[#fcf7ee] selection:bg-[#2200b8] selection:text-[#fcf7ee]">
      <NavBar onSelectSection={handleSelectSection} />
      <Home onSelectProject={handleSelectFromCube} />
      <div ref={contentRef}>
        <ContentArea
          sectionId={activeSection}
          onSelectSection={handleSelectFromProject}
          onExitComplete={handleExitComplete}
        />
      </div>
      {activeSection && <Footer />}
    </main>
  );
}
