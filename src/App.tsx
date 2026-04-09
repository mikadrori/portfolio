import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Home } from "./pages/Home";
import { Footer } from "./components/Footer";
import { ContentArea } from "./components/ContentArea";
import { type ProjectId } from "./components/CategoryCubes";
import {
  pathnameToSection,
  sectionToPath,
  isValidRoutePathname,
} from "./lib/routes";

type TransitionSource = "cube" | "nav" | "next-project";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeSection = useMemo(
    () => pathnameToSection(location.pathname),
    [location.pathname],
  );

  useLayoutEffect(() => {
    if (!isValidRoutePathname(location.pathname)) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  const [cubeAnimKey, setCubeAnimKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const transitionSource = useRef<TransitionSource>("cube");
  const prevSection = useRef<string | null>(null);
  const scrollHandledByExit = useRef(false);

  const handleSelectFromCube = useCallback(
    (id: ProjectId) => {
      if (id === activeSection) {
        contentRef.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      transitionSource.current = "cube";
      scrollHandledByExit.current = false;
      prevSection.current = activeSection;
      navigate(sectionToPath(id));
    },
    [activeSection, navigate],
  );

  const handleNavIntent = useCallback(
    (target: "home" | "about") => {
      const nextSection = target === "home" ? null : "about";
      if (nextSection === activeSection) return;
      transitionSource.current = "nav";
      scrollHandledByExit.current = false;
      prevSection.current = activeSection;
      if (target === "home") setCubeAnimKey((k) => k + 1);
    },
    [activeSection],
  );

  const handleSelectFromProject = useCallback(
    (id: string) => {
      if (id === activeSection) return;
      transitionSource.current = "next-project";
      scrollHandledByExit.current = false;
      prevSection.current = activeSection;
      navigate(sectionToPath(id));
    },
    [activeSection, navigate],
  );

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

  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const onKey = (e: KeyboardEvent) => {
      const isBackslash = e.code === "Backslash" || e.key === "\\";
      if (isBackslash && e.ctrlKey) {
        e.preventDefault();
        setShowGrid((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#fcf7ee] selection:bg-[#2200b8] selection:text-[#fcf7ee]">
      {showGrid && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="grid grid-cols-8 gap-[var(--grid-gutter)] px-[var(--grid-margin)] w-full max-w-[1920px] mx-auto h-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-full bg-red-500/10 border-x border-red-400/30" />
            ))}
          </div>
        </div>
      )}
      <NavBar onNavIntent={handleNavIntent} />
      <Home onSelectProject={handleSelectFromCube} animationKey={cubeAnimKey} />
      <div ref={contentRef} className="scroll-mt-[56px] md:scroll-mt-[72px]">
        <ContentArea
          sectionId={activeSection}
          onSelectSection={handleSelectFromProject}
          onExitComplete={handleExitComplete}
          onContentReady={handleContentReady}
        />
      </div>
      {activeSection && activeSection !== "about" && <Footer />}
    </main>
  );
}
