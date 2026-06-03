import {
  Globe,
  Smartphone,
  Code,
  Network,
  Brain,
  Blocks,
  Plug,
  LucideIcon,
} from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { StaggerContainer } from '../animations/StaggerContainer';
import { AnimatedIcon } from '../ui/AnimatedIcon';
import { services } from '../../constants';

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Smartphone,
  Code,
  Network,
  Brain,
  Blocks,
  Plug,
};

export const Services = () => {
  return (
    <Section id="services" className="scroll-mt-20">
      <div className="section-divider mb-12" />
      <SectionHeading
        title="What We Do"
        subtitle="We deliver end-to-end digital solutions across multiple technology domains"
      />

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {services.map((service, i) => {
          const IconComponent = iconMap[service.icon];
          return (
            <Card key={service.id} className="group">
              <AnimatedIcon
                index={i}
                className="w-12 h-12 rounded-sq-lg bg-cream-green flex items-center justify-center mb-4 group-hover:bg-forest-deep transition-colors duration-300"
              >
                {IconComponent && (
                  <IconComponent className="w-6 h-6 text-forest-primary group-hover:text-white transition-colors duration-300" />
                )}
              </AnimatedIcon>
              <h3 className="text-lg font-semibold text-forest-deep mb-2">
                {service.title}
              </h3>
              <p className="text-neutral-medium-gray text-sm leading-relaxed">
                {service.description}
              </p>
            </Card>
          );
        })}
      </StaggerContainer>
    </Section>
  );
};
