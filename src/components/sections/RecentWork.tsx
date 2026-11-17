import { useEffect, useRef, type FocusEvent, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  animate,
  m as motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { FadeIn } from '../animations/FadeIn';
import { portfolioProjects } from '../../constants';
import { EASE_OUT } from '../../lib/motion';

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
const count = WORDS[portfolioProjects.length] ?? String(portfolioProjects.length);

/** Cruising speed of the strip, in pixels per second. */
const SPEED = 38;

/**
 * Scrolling strip of the clients we have shipped for, between WelcomeBand and
 * CallToAction — social proof immediately before the ask.
 *
 * These are real client logos, served from /public/logos and downloaded from
 * each company's own site. They sit on white tiles because the set has mixed
 * polarity (BlackAt is black-and-red, Funded Forge gold, Nevelline a black
 * wordmark); a white tile is the one background every mark reads against.
 *
 * The list renders TWICE and the strip is moved by Motion: when the offset
 * passes half the track width it wraps, so the duplicate lands exactly where
 * the original started and the loop shows no seam. Hovering or focusing a card
 * eases the strip to a stop (and back up to speed) instead of freezing it, and
 * the loop does no work while the section is off screen. Under reduced motion
 * the strip stays still and becomes a row the visitor can scroll themselves.
 * The duplicate half is aria-hidden and untabbable so it is not announced twice.
 */
export const RecentWork = () => {
  const track = [...portfolioProjects, ...portfolioProjects];
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const inView = useInView(viewportRef, { margin: '120px' });
  const x = useMotionValue(0);
  const pace = useMotionValue(1);
  const half = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      half.current = el.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView || !half.current) return;
    // Cap the step so a background-tab return does not jump the strip.
    let next = x.get() - (SPEED * pace.get() * Math.min(delta, 64)) / 1000;
    if (next <= -half.current) next += half.current;
    x.set(next);
  });

  const easeTo = (target: number) =>
    animate(pace, target, { duration: target === 0 ? 0.6 : 0.9, ease: EASE_OUT });

  /* Tilt the tile toward the pointer and move its highlight with it. */
  const tilt = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || reduce) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((px - 0.5) * 16).toFixed(2));
    el.style.setProperty('--rx', ((0.5 - py) * 16).toFixed(2));
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };
  const untilt = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0');
    el.style.setProperty('--ry', '0');
    el.style.setProperty('--mx', '30%');
    el.style.setProperty('--my', '18%');
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) easeTo(1);
  };

  return (
    <Section id="recent-work" variant="light" className="scroll-mt-20 overflow-hidden">
      <SectionHeading
        eyebrow="Selected work"
        title="Work we've shipped"
        subtitle={`${count} live products, from AI tools to marketplaces. Each one started as a conversation.`}
      />

      <FadeIn delay={0.15}>
        <div
          ref={viewportRef}
          className={`sq-marquee-viewport -mx-4 px-4 sm:-mx-6 sm:px-6 ${reduce ? 'overflow-x-auto' : ''}`}
          onPointerEnter={() => easeTo(0)}
          onPointerLeave={() => easeTo(1)}
          onFocus={() => easeTo(0)}
          onBlur={onBlur}
        >
          <motion.ul ref={trackRef} className="flex w-max list-none pb-6 pt-10" style={reduce ? undefined : { x }}>
            {track.map((p, i) => {
              const isDupe = i >= portfolioProjects.length;
              const [industry] = p.category.split(' · ');
              return (
                <li
                  key={`${p.slug}-${i}`}
                  className="mr-8 w-[136px] flex-shrink-0 sm:mr-12 sm:w-[164px]"
                  aria-hidden={isDupe}
                >
                  <Link
                    to="/portfolio"
                    tabIndex={isDupe ? -1 : undefined}
                    aria-label={`${p.name}: ${p.category}. See our portfolio.`}
                    className="group block rounded-[30%] text-center focus-visible:outline-none"
                  >
                    <div className="sq-logo-tile" onPointerMove={tilt} onPointerLeave={untilt}>
                      <img
                        src={p.logo}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="relative max-h-[52%] max-w-[78%] object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
                      />
                    </div>
                    {/* Labels sit below the floor reflection */}
                    <p className="mt-14 text-[11px] font-semibold uppercase tracking-[0.12em] text-sage-medium">{industry}</p>
                    <p className="mt-1 text-[15px] font-semibold leading-snug text-forest-deep transition-colors duration-300 group-hover:text-forest-primary">
                      {p.name}
                    </p>
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </FadeIn>

      <FadeIn delay={0.25}>
        <div className="mt-9 text-center">
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 font-semibold text-forest-primary transition-colors hover:text-forest-deep"
          >
            See the full portfolio
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </FadeIn>
    </Section>
  );
};
