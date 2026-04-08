import { useState } from "react";

interface CloudinaryImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  /** Use `span` for inline placement next to text (wrapper is `inline-block`). */
  as?: "div" | "span";
}

export function CloudinaryImage({
  className = "",
  wrapperClassName = "",
  as = "div",
  onLoad,
  ...props
}: CloudinaryImageProps) {
  const [loaded, setLoaded] = useState(false);
  const Wrapper = as === "span" ? "span" : "div";
  const wrapperBase =
    as === "span" ? "relative inline-block align-middle" : "relative";

  return (
    <Wrapper className={`${wrapperBase} ${wrapperClassName}`.trim()}>
      {!loaded && (
        <span
          className={`absolute inset-0 block skeleton-shimmer-primary rounded-[inherit] ${className}`}
        />
      )}
      <img
        loading="lazy"
        {...props}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </Wrapper>
  );
}
