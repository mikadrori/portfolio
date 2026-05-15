import { createElement, type ElementType, type ReactNode } from "react";

interface PageGridProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export const PageGrid = ({
  children,
  className = "",
  as: Component = "div",
}: PageGridProps) => {
  return createElement(
    Component,
    {
      className: `grid grid-cols-8 gap-[var(--grid-gutter)] px-[var(--grid-margin)] w-full max-w-[1920px] mx-auto ${className}`.trim(),
    },
    children,
  );
};
