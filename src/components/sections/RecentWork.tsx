import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Picture } from '../ui/Picture';
import { FadeIn } from '../animations/FadeIn';
import { portfolioProjects } from '../../constants';

/**
 * Scrolling strip of real shipped work, between WelcomeBand and CallToAction —
 * social proof immediately before the ask.
 *
 * These are our PROJECTS, not client logos. We hold no logo files for any of
 * these companies and no permission to display their marks, so the strip shows
 * the product name, its category and our own screenshot. If real logos and
 * written permission ever land, this is the component to change.
 *
 * The list is rendered twice: the CSS translates the track exactly -50%, so the
 * duplicate lands where the original started and the loop never shows a seam.
 * With only five projects a single pass would leave a visible gap on wide
 * screens. See `.sq-marquee-*` in styles/index.css.
 */
export const RecentWork = () => {
  const track = [...portfolioProjects, ...portfolioProjects];

  return (
    <Section id="recent-work" variant="light" className="scroll-mt-20 overflow-hidden">
      <FadeIn>
        <SectionHeading
          title="Work we've shipped"
          subtitle="Five products currently in people's hands. Each one started as a conversation."
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="sq-marquee-viewport -mx-4 px-4 sm:-mx-6 sm:px-6">
          {/* aria-hidden on the duplicate half would be ideal, but the track is
              one flex row; instead the whole strip is decorative-with-a-link and
              the real, ordered list lives on /portfolio. */}
          <ul className="sq-marquee-track list-none py-2">
            {track.map((p, i) => (
              <li
                key={`${p.slug}-${i}`}
                className="sq-marquee-item w-[240px] flex-shrink-0 sm:w-[280px]"
                aria-hidden={i >= portfolioProjects.length}
              >
                <Link
                  to="/portfolio"
                  tabIndex={i >= portfolioProjects.length ? -1 : undefined}
                  className="group block overflow-hidden rounded-sq-xl border border-cream-green bg-white shadow-sq transition-all duration-300 hover:-translate-y-1 hover:shadow-sq-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-medium focus-visible:ring-offset-2"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-aurora-cream">
                    <Picture
                      src={p.image}
                      alt={`${p.name}: ${p.category}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="px-4 py-3.5">
                    <p className="text-[15px] font-semibold text-forest-deep">{p.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-medium-gray">{p.category}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="mt-9 text-center">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 font-semibold text-forest-primary transition-colors hover:text-forest-deep"
          >
            See the full portfolio
            <ArrowRight size={18} />
          </Link>
        </div>
      </FadeIn>
    </Section>
  );
};
