/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      formats: ['iife'],
      name: 'react.bundle',
    },
    outDir: path.join(__dirname, 'dist/clientlib-react'),
    rollupOptions: {
      output: {
        assetFileNames: (file) => {
          if (file.name?.endsWith('.css')) {
            return 'react.bundle.[ext]';
          }
          return `resources/[name].[ext]`;
        },
        entryFileNames: `react.bundle.js`,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  root: path.join(__dirname, 'src'),
  server: {
    port: 3000,
    proxy: {
      '^/content/chumley/.*.model.json': {
        changeOrigin: true,
        target: 'http://localhost:4502',
      },
      '^/content/chumley/.*/.*.coreimg.jpeg/.*.jpeg': {
        changeOrigin: true,
        target: 'http://localhost:4502',
      },
      '^/content/dam/chumley/': {
        changeOrigin: true,
        target: 'http://localhost:4502',
      },
      '^/etc.clientlibs/.*': {
        changeOrigin: true,
        target: 'http://localhost:4502',
      },
    },
  },
});
