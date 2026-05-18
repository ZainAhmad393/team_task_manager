import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  build: {
    outDir: 'dist',
  },

  server: {
    port: 5173,
    // ✅ Proxy sirf development mein use hoga
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