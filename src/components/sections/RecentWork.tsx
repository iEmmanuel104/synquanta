import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { FadeIn } from '../animations/FadeIn';
import { portfolioProjects } from '../../constants';

/**
 * Scrolling strip of the clients we have shipped for, between WelcomeBand and
 * CallToAction — social proof immediately before the ask.
 *
 * These are real client logos, served from /public/logos and downloaded from
 * each company's own site. They sit on white tiles rather than directly on the
 * section background, because the set has mixed polarity: BlackAt's mark is
 * black-and-red, Funded Forge's is gold, Nevelline's is a black wordmark. A
 * white tile is the one background all five read against, and it avoids
 * recolouring anyone's mark to force consistency.
 *
 * The list renders TWICE. The CSS translates the track exactly -50%, so the
 * duplicate lands where the original started and the loop shows no seam; with
 * only five clients a single pass would leave a gap on a wide screen. The
 * duplicate half is aria-hidden and untabbable so it is not announced twice.
 * See `.sq-marquee-*` in styles/index.css.
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
          <ul className="sq-marquee-track list-none py-2">
            {track.map((p, i) => {
              const isDupe = i >= portfolioProjects.length;
              return (
                <li
                  key={`${p.slug}-${i}`}
                  className="sq-marquee-item w-[210px] flex-shrink-0 sm:w-[240px]"
                  aria-hidden={isDupe}
                >
                  <Link
                    to="/portfolio"
                    tabIndex={isDupe ? -1 : undefined}
                    aria-label={`${p.name}: ${p.category}. See our portfolio.`}
                    className="group flex h-full flex-col items-center gap-4 rounded-sq-xl border border-cream-green bg-white px-6 py-7 shadow-sq transition-all duration-300 hover:-translate-y-1 hover:shadow-sq-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-medium focus-visible:ring-offset-2"
                  >
                    <div className="flex h-14 w-full items-center justify-center">
                      <img
                        src={p.logo}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        /* Full opacity, not the usual dimmed logo-wall treatment:
                           Funded Forge's mark is gold and washes out badly at
                           anything less, and these are real client logos rather
                           than decoration. */
                        className="max-h-14 max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[15px] font-semibold text-forest-deep">{p.name}</p>
                      <p className="mt-0.5 text-xs text-neutral-medium-gray">{p.category}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
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
