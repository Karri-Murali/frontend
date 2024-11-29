import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',  // Ensure this points to the 'build' directory
    emptyOutDir: true,  // Ensure the build directory is emptied before building
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Adjust to your backend URL during development
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    'process.env': {}, // Fix for any issues with environment variables in Vite
  }
})
