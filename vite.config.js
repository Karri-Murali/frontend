import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000', // Local backend for development
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'build', // Custom build directory as 'build'
    },
    define: {
      'process.env.VITE_BACKEND_URL': JSON.stringify(
        isProduction
          ? 'https://backend-sya5.onrender.com/api' // Backend URL for production
          : 'http://localhost:5000/api' // Backend URL for development
      ),
      'process.env.VITE_ASSET_URL': JSON.stringify(
        isProduction
          ? 'https://backend-sya5.onrender.com' // Asset URL for production
          : 'http://localhost:5000' // Asset URL for development
      ),
    },
  };
});
