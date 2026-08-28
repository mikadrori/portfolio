/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUD_NAME?: string;
  readonly VITE_VIDEO_CDN_URL?: string;
  readonly VITE_USE_CLOUDINARY?: string;
  readonly VITE_CLARITY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
