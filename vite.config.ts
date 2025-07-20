import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Compatibility config for development environment
// This allows the development server to work while the app uses Next.js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  // Configure to work with Next.js structure
  root: '.',
  build: {
    outDir: 'dist',
  },
})