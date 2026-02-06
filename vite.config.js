import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/zen-app/',
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    allowedHosts: true, // Allow tunnel hostnames
  }
})
