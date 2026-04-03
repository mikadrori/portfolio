const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME || "dwsbq2yhr";

const useLocalAssets =
  import.meta.env.DEV && import.meta.env.VITE_USE_CLOUDINARY !== "true";

export function cloudinaryUrl(
  publicId: string,
  opts?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
    resourceType?: "image" | "video";
    raw?: boolean;
  }
): string {
  if (useLocalAssets) {
    return `/assets/${publicId}`;
  }

  const type = opts?.resourceType ?? "image";
  const hasResize = opts?.width || opts?.height || opts?.crop;

  if (!hasResize || opts?.raw || publicId.endsWith(".svg")) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/${type}/upload/${publicId}`;
  }

  const transforms: string[] = [];
  transforms.push("f_auto");
  transforms.push(opts?.quality ? `q_${opts.quality}` : "q_auto");
  if (opts?.width) transforms.push(`w_${opts.width}`);
  if (opts?.height) transforms.push(`h_${opts.height}`);
  if (opts?.crop) transforms.push(`c_${opts.crop}`);

  return `https://res.cloudinary.com/${CLOUD_NAME}/${type}/upload/${transforms.join(",")}/${publicId}`;
}

const BREAKPOINTS = [400, 640, 768, 1024, 1280, 1920];

export function cloudinarySrcSet(publicId: string, maxWidth = 1920): string {
  if (publicId.endsWith(".svg")) return "";

  return BREAKPOINTS.filter((w) => w <= maxWidth)
    .map((w) => `${cloudinaryUrl(publicId, { width: w, crop: "scale" })} ${w}w`)
    .join(", ");
}
