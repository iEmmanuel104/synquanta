import { FadeIn, AnimatedText } from '../animations';

interface SectionHeadingProps {
  title: string;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export const SectionHeading = ({
  title,
  eyebrow,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) => {
  const alignment = centered ? 'text-center' : 'text-left';
  const titleColor = light ? 'text-white' : 'text-forest-deep';
  const subtitleColor = light ? 'text-white/80' : 'text-neutral-medium-gray';

  return (
    <div className={`mb-12 lg:mb-16 ${alignment}`}>
      {eyebrow && (
        <FadeIn>
          <p className={`sq-eyebrow mb-3.5 ${light ? 'text-mint-pale' : ''}`}>{eyebrow}</p>
        </FadeIn>
      )}
      <AnimatedText
        as="h2"
        text={title}
        className={`text-3xl md:text-4xl lg:text-5xl font-semibold ${titleColor} tracking-tight`}
      />
      {subtitle && (
        <FadeIn delay={0.2}>
          <p
            className={`mt-4 text-balance text-lg md:text-xl ${subtitleColor} max-w-3xl ${
              centered ? 'mx-auto' : ''
            }`}
          >
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  );
};
