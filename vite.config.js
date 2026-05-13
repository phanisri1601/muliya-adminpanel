import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Same-origin in dev → avoids CORS. Backend must still accept upload size (see image compression).
      '/api': {
        target: 'https://muliya.ourapi.co.in',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
