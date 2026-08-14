import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    build: {
      outDir: 'dist',
    },
    plugins: [
      react(),
      svgr()
    ],
    base: '/',
    assetsInclude: ['**/*.md']
  };
});