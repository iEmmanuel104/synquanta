import { Globe, Smartphone, Code, Network, Brain, Blocks, ArrowRight, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { StaggerContainer } from '../animations/StaggerContainer';
import { AnimatedIcon } from '../ui/AnimatedIcon';
import { services } from '../../constants';

const iconMap: Record<string, LucideIcon> = { Globe, Smartphone, Code, Network, Brain, Blocks };

/** Condensed 3-up of what we do, on the home page → links to the full Services page. */
export const ServicesTeaser = () => {
  const featured = services.slice(0, 3);
  return (
    <Section id="explore" className="scroll-mt-20">
      <div className="section-divider mb-12" />
      <SectionHeading
        title="What we do"
        subtitle="End-to-end digital solutions — from research-led websites to custom software, AI and beyond."
      />

      <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {featured.map((service, i) => {
          const Icon = iconMap[service.icon];
          return (
            <Card key={service.id} className="group">
              <AnimatedIcon
                index={i}
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-sq-lg bg-cream-green transition-colors duration-300 group-hover:bg-forest-deep"
              >
                {Icon && (
                  <Icon className="h-6 w-6 text-forest-primary transition-colors duration-300 group-hover:text-white" />
                )}
              </AnimatedIcon>
              <h3 className="mb-2 text-lg font-semibold text-forest-deep">{service.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-medium-gray">{service.description}</p>
            </Card>
          );
        })}
      </StaggerContainer>

      <div className="mt-10 text-center">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 font-semibold text-forest-primary transition-colors hover:text-forest-deep"
        >
          Explore all services
          <ArrowRight size={18} />
        </Link>
      </div>
    </Section>
  );
};
