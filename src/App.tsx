import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/layout';
// Pages are imported statically (no React.lazy / Suspense) so there is NO
// loading state on any browser — the page renders the instant the app mounts,
// and in-app navigation is immediate. Safari was the slowest to resolve the old
// dynamic-import chunks, which made its Suspense fallback linger; removing the
// boundary entirely fixes that everywhere. The pages are small and the heavy
// libraries are still split into cached vendor chunks via vite.config.ts.
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProductsPage } from './pages/ProductsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
