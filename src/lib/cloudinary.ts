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
    const fileName = publicId.includes("/") ? publicId.split("/").pop()! : publicId;
    return `${VIDEO_CDN_URL}/${fileName}`;
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

/**
 * Still frame from a Cloudinary video (`so_` seek). Always uses the CDN so
 * DEV local mirrors still get a usable thumbnail without a local poster file.
 */
export function cloudinaryVideoThumbnail(
  videoPublicId: string,
  atSeconds = 3,
  width = 400,
): string {
  const bare = videoPublicId.replace(/\.(mp4|webm|mov)$/i, "");
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_${atSeconds},f_jpg,q_auto,w_${width}/${bare}.jpg`;
}
