import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Inline the built CSS into index.html instead of emitting a render-blocking
 * <link rel="stylesheet">. The whole stylesheet is only ~13KB gzipped, but as
 * an external file it costs a full round-trip before ANYTHING paints — and
 * Safari re-validates subresources on every reload, so that round-trip is paid
 * on each reload too. Inlined, the page styles (and the boot shell) paint the
 * moment the HTML arrives; the only remaining render-blocking resource is the
 * HTML itself.
 */
function inlineCss(): Plugin {
  return {
    name: 'synquanta:inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return html
        let out = html
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (asset.type === 'asset' && fileName.endsWith('.css')) {
            const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const linkRe = new RegExp(`<link[^>]+href="/${escaped}"[^>]*>`)
            if (linkRe.test(out)) {
              out = out.replace(linkRe, () => `<style>${asset.source}</style>`)
              delete bundle[fileName]
            }
          }
        }
        return out
      },
    },
  }
}

// https://vitejs.dev/config/
// Deliberately default Vite chunking — no manualChunks. The 7-way vendor split
// meant 7 modulepreloaded scripts on the critical path, and Safari is the
// slowest browser at resolving many parallel module requests (plus a known
// WebKit modulepreload caching quirk). One straightforward bundle is the
// stable, fast-everywhere configuration for a site this size.
export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCss()],
})
