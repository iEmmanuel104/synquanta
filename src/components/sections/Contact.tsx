import { Mail, Globe, MapPin, ExternalLink } from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { FadeIn } from '../animations/FadeIn';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@synquanta.com',
    href: 'mailto:info@synquanta.com',
    description: 'Send us an email anytime',
  },
  {
    icon: Globe,
    label: 'Website',
    value: 'synquanta.com',
    href: 'https://synquanta.com',
    description: 'Visit our website',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Nigeria',
    href: null,
    description: 'Serving clients globally',
  },
];

export const Contact = () => {
  return (
    <Section id="contact" variant="light" className="scroll-mt-20">
      <SectionHeading
        title="Get In Touch"
        subtitle="Have a project in mind? We'd love to hear from you"
      />

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {contactInfo.map((item, index) => (
            <FadeIn key={item.label} delay={index * 0.1}>
              <div className="bg-white rounded-sq-xl p-6 lg:p-8 text-center shadow-sq border border-cream-green hover:shadow-sq-lg transition-shadow duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-forest-deep to-sage-medium flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-forest-deep mb-1">
                  {item.label}
                </h3>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-forest-primary hover:text-sage-light transition-colors inline-flex items-center gap-1 font-medium"
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {item.value}
                    {item.href.startsWith('http') && <ExternalLink size={14} />}
                  </a>
                ) : (
                  <span className="text-forest-primary font-medium">{item.value}</span>
                )}
                <p className="text-sm text-neutral-medium-gray mt-2">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Additional CTA */}
        <FadeIn delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-neutral-medium-gray mb-4">
              Prefer email? Reach out directly at
            </p>
            <a
              href="mailto:info@synquanta.com"
              className="inline-flex items-center gap-2 text-xl font-semibold text-forest-deep hover:text-forest-primary transition-colors"
            >
              <Mail className="w-5 h-5" />
              info@synquanta.com
            </a>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
};
