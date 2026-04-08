const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME || "dmrtjbfbb";

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
