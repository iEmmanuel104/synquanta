import { Search, FileText, Hammer, LucideIcon } from 'lucide-react';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { PhoneMock } from '../ui/PhoneMock';
import { FadeIn } from '../animations/FadeIn';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { AnimatedIcon } from '../ui/AnimatedIcon';
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
    description: 'We study your site speed, reviews, maps ranking and nearby competitors.',
  },
  {
    icon: FileText,
    title: 'We report',
    description: 'You get a plain-English plan with the exact revenue at stake — no jargon.',
  },
  {
    icon: Hammer,
    title: 'We build',
    description: 'We build only what moves the needle, custom-made for your business.',
  },
];

export const WelcomeBand = () => {
  return (
    <Section id="about" className="scroll-mt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text content */}
        <div>
          <FadeIn>
            <p className="sq-eyebrow mb-4">For local businesses</p>
            <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-tight text-forest-deep md:text-4xl lg:text-[40px]">
              Got a call from us? You're in the right place.
            </h2>
            <p className="mb-6 max-w-xl text-lg leading-relaxed text-neutral-medium-gray">
              We're not a cold call with a sales pitch. Before we ever reached out, we researched your
              business the way a World Cup tourist would find you — and we already know what's costing
              you covers.
            </p>

            <StaggerContainer className="mb-8 flex flex-col gap-3.5">
              {steps.map((step, i) => (
                <motion.div key={step.title} variants={staggerItemVariants} className="flex items-start gap-3.5">
                  <AnimatedIcon
                    index={i}
                    className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sage-medium to-sage-light text-white shadow-sq"
                  >
                    <step.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </AnimatedIcon>
                  <div>
                    <h3 className="mb-0.5 text-[16.5px] font-semibold text-forest-deep">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-neutral-medium-gray">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>

            <Button href="/contact" variant="primary" size="md">
              See what we'd build for you
            </Button>
          </FadeIn>
        </div>

        {/* Phone mock */}
        <FadeIn direction="left" delay={0.12} className="flex justify-center">
          <PhoneMock />
        </FadeIn>
      </div>
    </Section>
  );
};
