import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split the big libraries into stable, separately-cacheable chunks.
        // Paired with the immutable cache headers in vercel.json, these only
        // re-download when the library itself changes — and the browser fetches
        // them in parallel over HTTP/2 on first load. `cobe` (the WebGL globe,
        // home page only) is isolated so it never weighs down other routes.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion')) return 'framer-motion'
          if (id.includes('cobe')) return 'cobe'
          if (id.includes('react-router') || id.includes('/react-router-dom/')) return 'router'
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) return 'react'
          if (id.includes('lucide-react')) return 'icons'
          return 'vendor'
        },
      },
    },
  },
})
