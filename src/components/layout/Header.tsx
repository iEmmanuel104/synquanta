import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { navLinks } from '../../constants';
import { useScrollPosition } from '../../hooks';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollPosition(50);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sq'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-custom" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-neutral-charcoal hover:text-forest-primary transition-colors duration-200 font-medium"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Button href="#contact" size="sm">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-forest-deep hover:bg-cream-green rounded-sq transition-colors"
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
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a
                        href={link.href}
                        className="block py-2 text-lg text-neutral-charcoal hover:text-forest-primary transition-colors font-medium"
                        onClick={closeMobileMenu}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                    className="pt-4"
                  >
                    <Button href="#contact" className="w-full" onClick={closeMobileMenu}>
                      Get Started
                    </Button>
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
