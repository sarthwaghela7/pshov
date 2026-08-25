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
        about: path.resolve(process.cwd(), 'about/index.html'),
        ventures: path.resolve(process.cwd(), 'ventures/index.html'),
        services: path.resolve(process.cwd(), 'services/index.html'),
        contact: path.resolve(process.cwd(), 'contact/index.html'),
      },
    },
  },
});
