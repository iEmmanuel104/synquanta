import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
// Deliberately default Vite chunking — no manualChunks. The 7-way vendor split
// meant 7 modulepreloaded scripts on the critical path, and Safari is the
// slowest browser at resolving many parallel module requests (plus a known
// WebKit modulepreload caching quirk). One straightforward bundle is the
// stable, fast-everywhere configuration for a site this size.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
