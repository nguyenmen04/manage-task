import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api/v1/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1\/auth/, '/auth')
      },
      '/api/v1/tasks': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1\/tasks/, '/tasks')
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
