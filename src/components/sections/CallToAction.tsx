import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { FadeIn } from '../animations/FadeIn';

export const CallToAction = () => {
  return (
    <Section variant="gradient">
      <div className="text-center py-8 lg:py-12">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 tracking-tight">
            Ready to Build Something Great?
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Let's discuss your project and bring your ideas to life with modern digital solutions.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Button
            href="#contact"
            variant="secondary"
            size="lg"
            className="bg-white text-forest-deep hover:bg-cream-green hover:text-forest-deep border-white"
          >
            Get In Touch
          </Button>
        </FadeIn>
      </div>
    </Section>
  );
};
