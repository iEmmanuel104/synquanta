import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { Globe, hasWebGL, prefersReducedMotion } from '../ui/Globe';

/**
 * Home-page showcase of the WebGL globe — frames our work as global and shows
 * off the technical craft. General copy + globe dots (no campaign tie-in).
 */
export const GlobalReach = () => {
  // Skip the WebGL globe on phones — cobe download + GPU/WebGL init is the
  // heaviest thing on mid-range mobile, exactly where first-load is slow. The
  // lightweight radial-gradient fallback below renders instead. Desktop keeps
  // the interactive globe.
  const [flat] = useState(
    () =>
      prefersReducedMotion() ||
      !hasWebGL() ||
      (typeof window !== 'undefined' && window.innerWidth < 768),
  );

  return (
    <section className="relative overflow-hidden bg-mesh-forest py-20 text-white lg:py-28">
      <div className="grain-overlay" aria-hidden="true" />
      <div className="container-custom relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <FadeIn>
            <p className="sq-eyebrow mb-3.5 text-mint-pale">Global by design</p>
            <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-[44px]">
              Distance has never been the hard part
            </h2>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/70">
              We work remotely with founders and teams in several countries, from a first prototype
              through to a product carrying real traffic. Overlapping hours matter more than a shared
              postcode, and we plan the week around them.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-sq bg-white px-5 py-3 text-sm font-semibold text-forest-deep transition-colors hover:bg-cream-green"
              >
                See our work
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-sq border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Start a project
              </Link>
            </div>
          </FadeIn>

          {/* Globe */}
          <FadeIn direction="left" delay={0.1} className="flex justify-center">
            <div className="globe-stage">
              {flat ? (
                <div
                  className="aspect-square w-full rounded-full"
                  aria-hidden="true"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 38%, rgba(82,183,136,0.38), rgba(27,67,50,0.15) 58%, transparent 72%)',
                  }}
                />
              ) : (
                <Globe
                  className="globe-canvas"
                  ariaLabel="Interactive globe showing the worldwide reach of our work"
                />
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
