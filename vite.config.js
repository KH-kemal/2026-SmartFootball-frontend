import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // The custom domain serves the application from the domain root.
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
