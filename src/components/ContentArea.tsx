import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";

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

const SECTION_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<{ onSelectSection: (id: string) => void }>>> = {
  about: AboutMe as React.LazyExoticComponent<React.ComponentType<{ onSelectSection: (id: string) => void }>>,
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
}

export const ContentArea = ({
  sectionId,
  onSelectSection,
  onExitComplete,
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
                <div className="w-8 h-8 border-2 border-[#2200b8] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            {(() => {
              const Component = SECTION_MAP[sectionId];
              return <Component onSelectSection={onSelectSection} />;
            })()}
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
