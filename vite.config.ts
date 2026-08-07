import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

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
// Deliberately default Vite chunking — no vendor splitting. The old 7-way split
// meant 7 modulepreloaded scripts on the critical path, and Safari is the
// slowest browser at resolving many parallel module requests (plus a known
// WebKit modulepreload caching quirk). One straightforward bundle is the
// stable, fast-everywhere configuration for a site this size.
//
// MEASURED 2026-08-07 — do not retry the obvious fix.
//
// index.html declares two module entries: `main.tsx` (client) and
// `entry-prerender.tsx` (build-only; its script tag is stripped from the
// output). Rollup puts their shared graph in one chunk, so `react-dom/server`
// rides along into the chunk real visitors load — `renderToStaticMarkup` and
// `renderToReadableStream` are both greppable in the shipped bundle.
//
// Splitting it out with `manualChunks(id => /react-dom.server/ ...)` makes it
// WORSE, measured: React 18's server renderer re-exports from `react-dom`
// itself, so the extracted chunk still holds a client-needed export and the
// client imports it anyway. Result was 156.8KB gz across THREE modulepreloads
// vs 156.5KB across one — no byte saving, and precisely the Safari-hostile
// shape the paragraph above exists to prevent.
//
// Removing the entry to measure the true ceiling isn't possible either:
// vite-prerender-plugin hard-fails with "Unable to detect prerender entry
// script". A real fix means a two-pass build (client build, then a separate
// SSR build for prerendering) — a restructure, not a config tweak. Not worth
// it until something else forces the issue.
export default defineConfig({
  // Order matters: prerender renders each route into the HTML template, then
  // inlineCss() (enforce:'post') inlines the stylesheet into every emitted file.
  // renderTarget '#root' injects markup INTO #root and leaves the #sq-boot shell
  // and module scripts untouched.
  plugins: [
    react(),
    tailwindcss(),
    vitePrerenderPlugin({ renderTarget: '#root' }),
    inlineCss(),
  ],
})
