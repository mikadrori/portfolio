import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LoadingCubes } from "./LoadingCubes";

const AboutMe = lazy(() =>
  import("./AboutMe").then((m) => ({ default: m.AboutMe }))
);
const PackUp = lazy(() =>
  import("../pages/PackUp").then((m) => ({ default: m.default }))
);
const MuchiWaze = lazy(() =>
  import("../pages/MuchiWaze").then((m) => ({ default: m.default }))
);
const WeWereLiars = lazy(() =>
  import("../pages/WeWereLiars").then((m) => ({ default: m.default }))
);
const Aviv = lazy(() =>
  import("../pages/Aviv").then((m) => ({ default: m.default }))
);
const LuminaForest = lazy(() =>
  import("../pages/LuminaForest").then((m) => ({ default: m.default }))
);

type SectionComponent = React.ComponentType<{
  onSelectSection: (id: string) => void;
  onReady?: () => void;
  /** Incremented from App when navbar cube is clicked on About — only AboutMe uses it. */
  aboutResetSignal?: number;
}>;

const SECTION_MAP: Record<string, React.LazyExoticComponent<SectionComponent>> = {
  about: AboutMe as React.LazyExoticComponent<SectionComponent>,
  packup: PackUp,
  muchiwaze: MuchiWaze,
  wwl: WeWereLiars,
  aviv: Aviv,
  lumina: LuminaForest,
};

interface ContentAreaProps {
  sectionId: string | null;
  onSelectSection: (id: string) => void;
  onExitComplete: () => void;
  onContentReady: () => void;
  aboutResetSignal?: number;
}

export const ContentArea = ({
  sectionId,
  onSelectSection,
  onExitComplete,
  onContentReady,
  aboutResetSignal = 0,
}: ContentAreaProps) => {
  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {sectionId && SECTION_MAP[sectionId] && (
        <motion.div
          key={sectionId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <LoadingCubes />
              </div>
            }
          >
            {(() => {
              const Component = SECTION_MAP[sectionId];
              return (
                <Component
                  onSelectSection={onSelectSection}
                  onReady={onContentReady}
                  aboutResetSignal={sectionId === "about" ? aboutResetSignal : undefined}
                />
              );
            })()}
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
