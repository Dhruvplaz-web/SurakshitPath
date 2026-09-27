import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    fs: {
      strict: false,
      allow: ['..', 'E:/Software/acm sdg', 'E:/Software/acm sdg-v1']
    }
  },
  resolve: {
    preserveSymlinks: true
  },
  build: {
    // Disable production source maps to protect intellectual property and reduce bundle overhead
    sourcemap: false,
    // Target modern evergreen browsers
    target: 'esnext',
    // Warn if chunk exceeds 500kb
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Chunk splitting strategy: isolate heavy libraries into dedicated cacheable bundles
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-geo': ['leaflet', '@turf/turf'],
          'vendor-ui': ['lucide-react'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});
