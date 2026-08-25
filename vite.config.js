import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react({ include: /src\/.*\.[jt]sx?$/ })],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        site: path.resolve(process.cwd(), 'index.html'),
        admin: path.resolve(process.cwd(), 'admin/index.html'),
      },
    },
  },
});
