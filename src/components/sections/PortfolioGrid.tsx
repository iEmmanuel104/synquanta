import { useState } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { Section } from '../layout/Section';
import { Lightbox } from '../ui/Lightbox';
import { Picture } from '../ui/Picture';
import { staggerItemVariants, StaggerContainer } from '../animations/StaggerContainer';
import { portfolioProjects } from '../../constants';
import { PortfolioProject } from '../../types';

export const PortfolioGrid = () => {
  const [active, setActive] = useState<PortfolioProject | null>(null);
  const reduce = useReducedMotion();

  return (
    <Section>
      <StaggerContainer className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:gap-8">
        {portfolioProjects.map((p) => (
          <motion.button
            key={p.slug}
            type="button"
            variants={reduce ? undefined : staggerItemVariants}
            onClick={() => setActive(p)}
            aria-label={`Preview ${p.name}`}
            className="group relative flex flex-col overflow-hidden rounded-sq-2xl border border-cream-green bg-white text-left shadow-sq transition-all duration-300 hover:-translate-y-1.5 hover:shadow-sq-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2"
          >
            {/* Screenshot */}
            <div className="relative aspect-[16/10] overflow-hidden">
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
            </div>

            {/* Caption */}
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-forest-deep">{p.name}</h3>
              </div>
              <p className="text-sm leading-relaxed text-neutral-medium-gray">{p.blurb}</p>
              {p.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-cream-green px-2.5 py-1 text-[11px] font-medium text-forest-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </StaggerContainer>

      <Lightbox project={active} onClose={() => setActive(null)} />
    </Section>
  );
};
