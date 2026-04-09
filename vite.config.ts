import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const FAVICON_LOCAL = '/assets/Icon_cube_blue_uu5vvu_tv1dmc.svg';
const FAVICON_CDN = 'https://res.cloudinary.com/dmrtjbfbb/image/upload/Icon_cube_blue_uu5vvu_tv1dmc.svg';

function faviconPlugin(isProd: boolean) {
  return {
    name: 'favicon-cdn',
    transformIndexHtml(html: string) {
      if (isProd) {
        return html.replace(FAVICON_LOCAL, FAVICON_CDN);
      }
      return html;
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';
  return {
    // SPA: dev + preview serve index.html for non-file routes (client-side routing).
    appType: 'spa',
    plugins: [react(), tailwindcss(), faviconPlugin(isProd)],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
