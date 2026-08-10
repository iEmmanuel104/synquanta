import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './styles/index.css'
import { initPostHog } from './lib/posthog'
import { initFacebookPixel } from './lib/facebook-pixel'

// Deliberately client-render (createRoot) OVER the prerendered HTML rather than
// hydrateRoot. This is a framer-motion-heavy site (AnimatedText/FadeIn/grid),
// where SSR vs client motion markup mismatches make hydration fragile. The
// prerendered HTML exists for crawlers/social/AI scrapers (SEO); for real users
// React renders fresh — identical to pre-prerender behaviour, zero mismatch
// warnings. The #sq-boot shell stays hidden the moment #root has content.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)

// Analytics is non-critical: load + init posthog-js and the Meta Pixel only
// once the browser is idle (or 2s later as a fallback) so neither competes with
// first paint or the initial render on slow mobile devices. Nothing is lost by
// deferring — the first $pageview is queued by capturePageview(), and fbq's own
// stub queues anything fired before fbevents.js lands.
if (typeof window !== 'undefined') {
  const ric =
    window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000))
  ric(() => {
    void initPostHog()
    initFacebookPixel()
  })
}
