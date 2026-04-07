import { useState } from "react";

interface CloudinaryImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export function CloudinaryImage({
  className = "",
  wrapperClassName = "",
  onLoad,
  ...props
}: CloudinaryImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${wrapperClassName}`}>
      {!loaded && (
        <div
          className={`absolute inset-0 skeleton-shimmer rounded-[inherit] ${className}`}
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
    </div>
  );
}
