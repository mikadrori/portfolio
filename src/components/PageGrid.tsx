import { type ElementType } from "react";

interface PageGridProps {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}

export const PageGrid = ({
  children,
  className = "",
  as: Component = "div",
}: PageGridProps) => {
  return (
    <Component
      className={`grid grid-cols-8 gap-[var(--grid-gutter)] px-[var(--grid-margin)] w-full max-w-[1920px] mx-auto ${className}`.trim()}
    >
      {children}
    </Component>
  );
};
