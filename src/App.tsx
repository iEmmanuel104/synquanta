import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/layout';

// Code-split each page into its own chunk → smaller initial load (esp. mobile).
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then((m) => ({ default: m.PortfolioPage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));

/**
 * Branded fallback while a page chunk loads — the self-animating Orbit Atom
 * mark instead of a generic spinner. Chunks are tiny + immutably cached, so this
 * is rarely seen and never lingers; the logo simply keeps the brand on screen
 * for the brief first-load handoff.
 */
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-neutral-off-white">
    <img src="/brand-kit/orbit-atom-animated.svg" alt="" width={64} height={64} className="h-16 w-16" />
    <span className="sr-only">Loading</span>
  </div>
);

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

function App() {
  return (
    <div className="min-h-screen">
      <ScrollManager />
      <Header />
      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
