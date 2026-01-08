import {
  Award,
  Shield,
  Leaf,
  Lightbulb,
  Users,
  CheckCircle,
  LucideIcon,
} from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { StaggerContainer } from '../animations/StaggerContainer';
import { values } from '../../constants';

const iconMap: Record<string, LucideIcon> = {
  Award,
  Shield,
  Leaf,
  Lightbulb,
  Users,
  CheckCircle,
};

export const Values = () => {
  return (
    <Section id="values" className="scroll-mt-20">
      <SectionHeading
        title="What Drives Us"
        subtitle="Our core values guide every decision and every line of code we write"
      />

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {values.map((value) => {
          const IconComponent = iconMap[value.icon];
          return (
            <Card key={value.id} className="text-center group">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-forest-deep to-sage-medium flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                {IconComponent && (
                  <IconComponent className="w-7 h-7 text-white" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-forest-deep mb-2">
                {value.title}
              </h3>
              <p className="text-neutral-medium-gray text-sm">
                {value.description}
              </p>
            </Card>
          );
        })}
      </StaggerContainer>
    </Section>
  );
};
