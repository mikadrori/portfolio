const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME || "dmrtjbfbb";
const VIDEO_CDN_URL = import.meta.env.VITE_VIDEO_CDN_URL;

const useLocalAssets =
  import.meta.env.DEV && import.meta.env.VITE_USE_CLOUDINARY !== "true";

export function cloudinaryUrl(
  publicId: string,
  opts?: {
    width?: number;
    quality?: string;
    resourceType?: "image" | "video";
    raw?: boolean;
  }
): string {
  if (useLocalAssets) {
    return `/assets/${publicId}`;
  }

  const type = opts?.resourceType ?? "image";

  if (type === "video" && VIDEO_CDN_URL) {
    return `${VIDEO_CDN_URL}/${publicId}`;
  }

  if (!opts?.width || opts?.raw || publicId.endsWith(".svg")) {
    return `https://res.cloudinary.com/${CLOUD_NAME}/${type}/upload/${publicId}`;
  }

  const transforms = [
    "f_auto",
    opts.quality ? `q_${opts.quality}` : "q_auto",
    `w_${opts.width}`,
  ];

  return `https://res.cloudinary.com/${CLOUD_NAME}/${type}/upload/${transforms.join(",")}/${publicId}`;
}
