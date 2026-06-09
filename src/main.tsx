import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './styles/index.css'
import { initPostHog } from './lib/posthog'

initPostHog()

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
