import { Search, FileText, Hammer, LucideIcon } from 'lucide-react';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { PhoneMock } from '../ui/PhoneMock';
import { FadeIn } from '../animations/FadeIn';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { AnimatedIcon } from '../ui/AnimatedIcon';
import { m as motion, useReducedMotion } from 'framer-motion';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Search,
    title: 'First, we go and look',
    description:
      'Your users, your market, the competitors already doing well. This is where most briefs change.',
  },
  {
    icon: FileText,
    title: 'Then we draw it',
    description:
      'The product gets mapped and designed before anyone writes code, so the expensive decisions happen on paper.',
  },
  {
    icon: Hammer,
    title: 'Then we build and launch it',
    description:
      'Web and mobile, engineered to hold up under real traffic. We stay on it until it is live.',
  },
];

export const WelcomeBand = () => {
  // StaggerContainer degrades to a plain <div> under prefers-reduced-motion, so
  // a child still passing `staggerItemVariants` has no parent orchestrating it.
  // Drop the variants in that mode, exactly as ServicesTeaser/PortfolioGrid do.
  const reduce = useReducedMotion();

  return (
    <Section id="about" className="scroll-mt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text content */}
        <div>
          <FadeIn>
            <p className="sq-eyebrow mb-4">How we work</p>
            <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-tight text-forest-deep md:text-4xl lg:text-[40px]">
              Research comes first. Always.
            </h2>
            <p className="mb-6 max-w-xl text-lg leading-relaxed text-neutral-medium-gray">
              No project here starts from a template. It starts with a week of finding out who your
              users actually are and what the people already serving them get wrong. Only then do we
              decide what to build, which is often not the thing you came in asking for.
            </p>

            <StaggerContainer className="mb-8 flex flex-col gap-3.5">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  variants={reduce ? undefined : staggerItemVariants}
                  className="flex items-start gap-3.5"
                >
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
