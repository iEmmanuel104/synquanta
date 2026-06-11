import { m as motion, useReducedMotion } from 'framer-motion';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { services } from '../../constants';

export const Services = () => {
  const reduce = useReducedMotion();
  return (
    <Section id="services" className="scroll-mt-20 bg-aurora-soft">
      <SectionHeading
        title="What we do"
        subtitle="We don't just build websites — we design platforms, ship web & mobile products, and help teams take ideas all the way to launch."
      />

      <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={reduce ? undefined : staggerItemVariants}
            className="group flex flex-col overflow-hidden rounded-sq-xl border border-cream-green bg-white shadow-sq transition-all duration-300 hover:-translate-y-1.5 hover:shadow-sq-xl"
          >
            <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-aurora-cream p-6">
              <img
                src={service.illustration}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.05]"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-2 text-lg font-semibold text-forest-deep">{service.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-medium-gray">{service.description}</p>
            </div>
          </motion.div>
        ))}
      </StaggerContainer>
    </Section>
  );
};
