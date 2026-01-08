import { Target, Rocket, Users } from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { FadeIn } from '../animations/FadeIn';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { motion } from 'framer-motion';

const highlights = [
  {
    icon: Target,
    label: 'Precision',
    description: 'Quantifiable results',
  },
  {
    icon: Rocket,
    label: 'Innovation',
    description: 'Cutting-edge tech',
  },
  {
    icon: Users,
    label: 'Synergy',
    description: 'Collaborative approach',
  },
];

export const About = () => {
  return (
    <Section id="about" variant="light" className="scroll-mt-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text Content */}
        <div>
          <SectionHeading
            title="About SynQuanta"
            subtitle="Bringing together ideas, technologies, and people"
            centered={false}
          />

          <FadeIn delay={0.2}>
            <div className="space-y-4 text-neutral-medium-gray leading-relaxed">
              <p>
                <strong className="text-forest-deep">SynQuanta Technologies Ltd</strong> is a technology company focused on the design, development, and delivery of modern digital solutions. We work across web, mobile, and emerging technologies to help individuals, startups, and organizations turn ideas into reliable, scalable products.
              </p>
              <p>
                Our expertise spans software engineering, application development, system architecture, and advanced technologies such as artificial intelligence and blockchain. We approach every project with a strong emphasis on quality, security, and long-term sustainability.
              </p>
            </div>
          </FadeIn>

          {/* Mission */}
          <FadeIn delay={0.3}>
            <div className="mt-8 p-6 bg-white rounded-sq-xl border border-sage-light/20 shadow-sq">
              <h3 className="text-forest-primary font-semibold mb-2">Our Mission</h3>
              <p className="text-neutral-charcoal italic">
                "Building solutions that are practical, innovative, and aligned with real-world business needs."
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Visual / Brand Meaning */}
        <FadeIn direction="left" delay={0.2}>
          <div className="bg-white rounded-sq-xl p-8 lg:p-10 shadow-sq-lg border border-cream-green">
            <h3 className="text-2xl font-semibold text-forest-deep mb-6">
              The SynQuanta Name
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-forest-primary mb-2">
                  Syn<span className="text-sage-light">—</span>
                </h4>
                <p className="text-neutral-medium-gray">
                  From <em>"synthesis"</em> and <em>"synergy"</em> — bringing together ideas, technologies, and people to create something greater than the sum of its parts.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-forest-primary mb-2">
                  Quanta<span className="text-sage-light">—</span>
                </h4>
                <p className="text-neutral-medium-gray">
                  From <em>"quantum"</em> and <em>"quantifiable"</em> — precision, measurability, and cutting-edge capability in everything we build.
                </p>
              </div>
            </div>

            {/* Highlights */}
            <StaggerContainer className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-cream-green">
              {highlights.map((item) => (
                <motion.div
                  key={item.label}
                  className="text-center"
                  variants={staggerItemVariants}
                >
                  <div className="w-10 h-10 rounded-full bg-cream-green flex items-center justify-center mx-auto mb-2">
                    <item.icon className="w-5 h-5 text-forest-primary" />
                  </div>
                  <p className="text-sm font-semibold text-forest-deep">{item.label}</p>
                  <p className="text-xs text-neutral-medium-gray">{item.description}</p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
};
