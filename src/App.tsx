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
// HIDDEN 2026-08-07 — kept, not deleted. See the commented /hvac route below.
// import { HvacPage } from './pages/HvacPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
// Product legal set — hidden with the AI Receptionist, kept not deleted.
// import { HvacTermsPage } from './pages/HvacTermsPage';
// import { HvacPrivacyPage } from './pages/HvacPrivacyPage';
// import { HvacRefundPolicyPage } from './pages/HvacRefundPolicyPage';
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
            {/* HIDDEN 2026-08-07 — the AI Receptionist is not shown anywhere
                on the site until the product is finished end to end. Commented
                out rather than deleted: HvacPage.tsx, constants/hvac.ts and
                sections/Flagship.tsx all stay in the tree, ready to restore.
                Un-hiding means: this route, the navLinks entry in
                constants/navigation.ts, the <Flagship/> band in HomePage.tsx,
                the ROUTES entry in entry-prerender.tsx, public/sitemap.xml and
                scripts/indexnow.mjs. */}
            {/* <Route path="/hvac" element={<HvacPage />} /> */}
            {/* The site's own legal pages. Scoped to this website only. */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {/* The AI Receptionist's separate legal set. Hidden with the
                product; these describe a paid subscription, call recording and
                Paddle billing, none of which the website itself does. Restore
                alongside the /hvac route above.
            <Route path="/hvac/terms" element={<HvacTermsPage />} />
            <Route path="/hvac/privacy" element={<HvacPrivacyPage />} />
            <Route path="/hvac/refund-policy" element={<HvacRefundPolicyPage />} />
            */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LazyMotion>
  );
}

export default App;
