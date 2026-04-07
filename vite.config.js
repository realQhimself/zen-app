import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/rq-zen-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,m4a,mp3}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB for audio files
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: false,
    }),
  ],
  server: {
    host: true, // Listen on all addresses
    allowedHosts: true, // Allow tunnel hostnames
  }
})
