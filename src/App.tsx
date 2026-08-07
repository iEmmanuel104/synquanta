import { useEffect } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/layout';
import { capturePageview } from './lib/posthog';
// Pages are imported statically (no React.lazy / Suspense) so there is NO
// loading state on any browser — the page renders the instant the app mounts,
// and in-app navigation is immediate. Safari was the slowest to resolve the old
// dynamic-import chunks, which made its Suspense fallback linger; removing the
// boundary entirely fixes that everywhere. The pages are small and the heavy
// libraries are still split into cached vendor chunks via vite.config.ts.
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { HvacPage } from './pages/HvacPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * On every route change scroll to the top — unless the URL carries a #hash, in
 * which case scroll to that element (clearing the fixed header offset).
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);
  return null;
}

/**
 * Capture a PostHog $pageview on every client-side route change. PostHog's
 * automatic pageview is disabled (capture_pageview: false) because this SPA
 * never does a full page load between routes. capturePageview() is queue-safe:
 * PostHog is loaded lazily on idle, so the first pageview (fired before the SDK
 * finishes loading) is buffered and flushed once it's ready.
 */
function PostHogPageviews() {
  const { pathname } = useLocation();
  useEffect(() => {
    capturePageview();
  }, [pathname]);
  return null;
}

function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen">
        <ScrollManager />
        <PostHogPageviews />
        <Header />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Paid-ad landing page — deliberately NOT in navLinks (header/footer
                nav), but fully routed, prerendered, sitemapped and indexable. */}
            <Route path="/hvac" element={<HvacPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LazyMotion>
  );
}

export default App;
