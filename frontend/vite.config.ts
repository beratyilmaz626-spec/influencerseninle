import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: [
      'dark-glass-ui.preview.emergentagent.com',
      '.emergentagent.com',
      '.preview.emergentagent.com',
      '.emergentcf.cloud',
      '.cluster-0.preview.emergentcf.cloud',
      'ui-video-deploy.cluster-0.preview.emergentcf.cloud',
      'localhost',
    ],
    hmr: false, // HMR tamamen kapalı - otomatik yenileme olmayacak
    watch: null, // Dosya izleme kapalı
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
});
