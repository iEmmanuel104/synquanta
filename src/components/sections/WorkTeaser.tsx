import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { portfolioProjects } from '../../constants';

/** Featured work strip on the home page → links through to the full Portfolio. */
export const WorkTeaser = () => {
  const featured = portfolioProjects.slice(0, 3);
  const reduce = useReducedMotion();

  return (
    <Section variant="light">
      <SectionHeading
        title="Work we're proud of"
        subtitle="A few of the products we've designed and built for founders and teams across industries."
      />

      <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {featured.map((p) => (
          <motion.div key={p.slug} variants={reduce ? undefined : staggerItemVariants}>
            <Link
              to="/portfolio"
              aria-label={`See ${p.name} and more work`}
              className="group flex h-full flex-col overflow-hidden rounded-sq-2xl border border-cream-green bg-white shadow-sq transition-all duration-300 hover:-translate-y-1.5 hover:shadow-sq-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.category}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-sage-medium">
                  {p.category}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-forest-deep">{p.name}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </StaggerContainer>

      <div className="mt-10 text-center">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 font-semibold text-forest-primary transition-colors hover:text-forest-deep"
        >
          View all work
          <ArrowRight size={18} />
        </Link>
      </div>
    </Section>
  );
};
