import { useRef, useState, KeyboardEvent } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { Section } from '../layout/Section';
import { Lightbox } from '../ui/Lightbox';
import { Picture } from '../ui/Picture';
import { VisitLink } from '../ui/VisitLink';
import { staggerItemVariants, StaggerContainer } from '../animations/StaggerContainer';
import { portfolioProjects, portfolioTypes } from '../../constants';
import { PortfolioProject, PortfolioType } from '../../types';

type Filter = 'all' | PortfolioType;

type Tab = { id: Filter; label: string; count: number };

const tabs: Tab[] = [
  { id: 'all' as const, label: 'All work', count: portfolioProjects.length },
  ...portfolioTypes.map<Tab>((t) => ({
    ...t,
    count: portfolioProjects.filter((p) => p.types.includes(t.id)).length,
  })),
].filter((t) => t.count > 0);

export const PortfolioGrid = () => {
  const [active, setActive] = useState<PortfolioProject | null>(null);
  // Starts on "all" so the prerendered HTML carries every project.
  const [filter, setFilter] = useState<Filter>('all');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  const visible =
    filter === 'all' ? portfolioProjects : portfolioProjects.filter((p) => p.types.includes(filter));

  // Arrow-key roving focus across the tabs (WAI-ARIA tabs pattern).
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + tabs.length) % tabs.length;
    setFilter(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section>
      <div
        role="tablist"
        aria-label="Filter work by type"
        className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 lg:mb-10"
      >
        {tabs.map((t, i) => {
          const selected = t.id === filter;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`portfolio-tab-${t.id}`}
              aria-selected={selected}
              aria-controls="portfolio-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setFilter(t.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2 ${
                selected
                  ? 'border-forest-deep bg-forest-deep text-white'
                  : 'border-cream-green bg-white text-forest-primary hover:border-sage-light hover:bg-cream-green'
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 text-[11px] font-semibold ${
                  selected ? 'bg-white/15 text-white' : 'bg-cream-green text-forest-primary'
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <div id="portfolio-panel" role="tabpanel" aria-labelledby={`portfolio-tab-${filter}`}>
        {/* Keyed by filter: remounting re-runs the stagger, so switching tabs
            animates without layout animations (only `domAnimation` is loaded). */}
        <StaggerContainer key={filter} className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:gap-8">
          {visible.map((p) => (
            <motion.article
              key={p.slug}
              variants={reduce ? undefined : staggerItemVariants}
              className="group relative flex flex-col overflow-hidden rounded-sq-2xl border border-cream-green bg-white text-left shadow-sq transition-all duration-300 hover:-translate-y-1.5 hover:shadow-sq-xl"
            >
              {/* Screenshot opens the in-page preview */}
              <button
                type="button"
                onClick={() => setActive(p)}
                aria-label={`Preview ${p.name}`}
                className="relative block aspect-[16/10] w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage-light"
              >
                <Picture
                  src={p.image}
                  alt={`${p.name}: ${p.category}`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
                />
                {/* Expand hint */}
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-forest-deep/55 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <Maximize2 size={16} />
                </span>
                {/* Gradient + overlay caption (rises in on hover) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-transparent p-5 pt-16">
                  <div className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs font-medium uppercase tracking-wider text-mint-pale">
                      {p.category}
                    </p>
                  </div>
                </div>
              </button>

              {/* Caption */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="mb-1.5 text-lg font-semibold text-forest-deep">{p.name}</h3>
                <p className="text-sm leading-relaxed text-neutral-medium-gray">{p.blurb}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                  {p.tags ? (
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-cream-green px-2.5 py-1 text-[11px] font-medium text-forest-primary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span />
                  )}
                  {p.url && <VisitLink url={p.url} name={p.name} />}
                </div>
              </div>
            </motion.article>
          ))}
        </StaggerContainer>
      </div>

      <Lightbox project={active} onClose={() => setActive(null)} />
    </Section>
  );
};
