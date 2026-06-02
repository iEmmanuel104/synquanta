import { Search, FileText, Hammer, LucideIcon } from 'lucide-react';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { FadeIn } from '../animations/FadeIn';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { motion } from 'framer-motion';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Search,
    title: 'We research',
    description:
      'We study your site speed, reviews, maps ranking and nearby competitors.',
  },
  {
    icon: FileText,
    title: 'We report',
    description:
      'You get a plain-English plan with the exact revenue at stake — no jargon.',
  },
  {
    icon: Hammer,
    title: 'We build',
    description:
      'We build only what moves the needle, custom-made for your business.',
  },
];

export const ForBusinesses = () => {
  return (
    <Section id="for-businesses" variant="light" className="scroll-mt-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text content */}
        <div>
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-sage-medium mb-4">
              For local businesses
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-deep tracking-tight leading-tight mb-5">
              Local business? You're in the right place.
            </h2>
            <p className="text-lg text-neutral-medium-gray leading-relaxed mb-8 max-w-xl">
              We're not a cold call with a sales pitch. Before we ever reach out,
              we research your business the way a 2026 visitor would find you — and
              we already know what's costing you customers. The surge is coming.
              Let's make sure they find you first.
            </p>
            <Button href="#contact" variant="primary" size="md">
              See what we'd build for you
            </Button>
          </FadeIn>
        </div>

        {/* Research-led steps */}
        <StaggerContainer className="flex flex-col gap-4">
          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={staggerItemVariants}
              className="flex items-start gap-4 rounded-sq-xl bg-white p-5 sm:p-6 shadow-sq border border-cream-green"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sage-medium to-sage-light text-white shadow-sq">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-forest-deep mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-medium-gray leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </Section>
  );
};
