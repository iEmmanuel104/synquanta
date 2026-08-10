import { ArrowUp, Mail, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { navLinks, legalLinks, services } from '../../constants';
import { captureEvent } from '../../lib/posthog';
import { trackContact } from '../../lib/facebook-pixel';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-mesh-forest text-white">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="container-custom relative z-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" aria-label="SynQuanta home" className="mb-6 inline-flex">
              <Logo variant="white" />
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-white/70">
              We find out what should be built, then we build it. Web and mobile products for
              founders and teams.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              {/* Emailing us is a conversion, not navigation — it just happens
                  on someone else's client, so nothing downstream would ever see
                  it. Meta's `Contact` standard event is what makes that visible.
                  See lib/facebook-pixel.ts. */}
              <a
                href="mailto:info@synquanta.com"
                onClick={() => {
                  captureEvent('contact_email_clicked', { location: 'footer' });
                  trackContact({ content_category: 'email' });
                }}
                className="inline-flex items-center gap-2 py-1 text-white/70 transition-colors hover:text-white"
              >
                <Mail size={16} />
                info@synquanta.com
              </a>
              <a
                href="https://synquanta.com"
                className="inline-flex items-center gap-2 py-1 text-white/70 transition-colors hover:text-white"
              >
                <Globe size={16} />
                synquanta.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-1.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block py-1 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Services</h3>
            <ul className="space-y-1.5">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    to="/services#services"
                    className="inline-block py-1 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {service.title.split(' ').slice(0, 2).join(' ')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Start a project CTA */}
          <div className="rounded-sq-xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="mb-2 text-lg font-semibold">Start a project</h3>
            <p className="mb-5 text-sm leading-relaxed text-white/70">
              Send us the idea, or the product that has outgrown what it was built on.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-sq bg-white px-4 py-2.5 text-sm font-semibold text-forest-deep transition-colors hover:bg-cream-green"
            >
              Get in touch
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Legal — Terms, Privacy and Refund must be publicly linked; Paddle's
            account verification checks for exactly these three. */}
        <nav
          aria-label="Legal"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-8 sm:justify-start"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="py-1 text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/60">
            &copy; {currentYear} SynQuanta Technologies Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://storyset.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 transition-colors hover:text-white/70"
            >
              Illustrations by Storyset
            </a>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
              aria-label="Back to top"
            >
              Back to top
              <ArrowUp size={16} className="transition-transform group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
