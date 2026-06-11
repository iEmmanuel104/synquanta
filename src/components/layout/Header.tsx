import { useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { navLinks } from '../../constants';
import { useScrollPosition } from '../../hooks';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollPosition(50);
  const { pathname } = useLocation();

  // Transparent-over-dark only on the home hero; every other page (and the home
  // page once scrolled) gets the solid header.
  const onHome = pathname === '/';
  const solid = isScrolled || !onHome;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-forest-deep focus:text-white focus:rounded-sq"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          solid ? 'bg-white/95 backdrop-blur-md shadow-sq' : 'bg-transparent'
        }`}
      >
        <nav className="container-custom" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - white when over dark hero, default when solid */}
            <Link to="/" aria-label="SynQuanta home" className="flex items-center">
              <Logo variant={solid ? undefined : 'white'} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `transition-colors duration-200 font-medium ${
                          solid
                            ? isActive
                              ? 'text-forest-primary'
                              : 'text-neutral-charcoal hover:text-forest-primary'
                            : isActive
                              ? 'text-white'
                              : 'text-white/80 hover:text-white'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className={`inline-flex items-center justify-center font-medium rounded-sq px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2 ${
                    solid
                      ? 'bg-gradient-to-r from-forest-deep via-forest-primary to-sage-medium text-white shadow-sq hover:shadow-sq-lg'
                      : 'bg-white text-forest-deep hover:bg-cream-green'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-sq transition-colors ${
                solid ? 'text-forest-deep hover:bg-cream-green' : 'text-white hover:bg-white/10'
              }`}
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden bg-white border-t border-cream-green overflow-hidden"
            >
              <nav className="container-custom py-6">
                <ul className="flex flex-col gap-4">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <NavLink
                        to={link.to}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `block py-2 text-lg transition-colors font-medium ${
                            isActive
                              ? 'text-forest-primary'
                              : 'text-neutral-charcoal hover:text-forest-primary'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.08 }}
                    className="pt-4"
                  >
                    <Link
                      to="/contact"
                      onClick={closeMobileMenu}
                      className="block w-full text-center px-6 py-3 bg-gradient-to-r from-forest-deep via-forest-primary to-sage-medium text-white font-medium rounded-sq shadow-sq"
                    >
                      Get Started
                    </Link>
                  </motion.li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
