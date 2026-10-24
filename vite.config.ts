import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repo at https://<user>.github.io/portfolio/
  // Use '/' instead if you deploy to Netlify/Vercel or a custom domain.
  base: '/portfolio/',
  build: {
    // The 3D scene is lazy-loaded; three.js alone is large by nature.
    chunkSizeWarningLimit: 1500,
  },
})
