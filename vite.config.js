import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://192.168.88.117:5000',
        changeOrigin: true,
        secure: false,
      },

      '/image': {
        target: 'http://192.168.88.117:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})