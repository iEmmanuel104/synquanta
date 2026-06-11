import { Search, FileText, Hammer, LucideIcon } from 'lucide-react';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { PhoneMock } from '../ui/PhoneMock';
import { FadeIn } from '../animations/FadeIn';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { AnimatedIcon } from '../ui/AnimatedIcon';
import { m as motion } from 'framer-motion';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Search,
    title: 'We research',
    description: 'We study your users, your market and the competition — the data behind every decision.',
  },
  {
    icon: FileText,
    title: 'We design',
    description: 'We map the product and design the experience, so what we build is right the first time.',
  },
  {
    icon: Hammer,
    title: 'We build',
    description: 'We engineer fast, reliable web and mobile products — and ship them to launch.',
  },
];

export const WelcomeBand = () => {
  return (
    <Section id="about" className="scroll-mt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text content */}
        <div>
          <FadeIn>
            <p className="sq-eyebrow mb-4">How we work</p>
            <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-tight text-forest-deep md:text-4xl lg:text-[40px]">
              We research, design, and build — in that order.
            </h2>
            <p className="mb-6 max-w-xl text-lg leading-relaxed text-neutral-medium-gray">
              Every engagement starts with research, never a template. We learn your users, your market
              and your goals, then design and build exactly what moves the needle — whether that's a new
              platform, a mobile app, or an idea you're taking from zero to one.
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
              Request a quote
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
