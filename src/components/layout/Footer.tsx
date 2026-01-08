import { ArrowUp, Mail, MapPin, Globe } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { navLinks, services } from '../../constants';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-deep text-white">
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Logo variant="white" className="mb-6" />
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Building solutions that are practical, innovative, and aligned with real-world business needs.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="mailto:info@synquanta.com"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <Mail size={16} />
                info@synquanta.com
              </a>
              <a
                href="https://synquanta.com"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <Globe size={16} />
                synquanta.com
              </a>
              <span className="flex items-center gap-2 text-white/70">
                <MapPin size={16} />
                Nigeria
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {service.title.split(' ').slice(0, 2).join(' ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Founded: 2026</li>
              <li>Serving clients globally</li>
              <li>Modern digital solutions</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            &copy; {currentYear} SynQuanta Technologies Ltd. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm group"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp
              size={16}
              className="group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};
