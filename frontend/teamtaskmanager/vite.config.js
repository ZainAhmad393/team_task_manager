import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    }
  },

  server: {
    port: 5173,
    proxy: mode === 'development'
      ? {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
          },
        }
      : {},
  },
}))