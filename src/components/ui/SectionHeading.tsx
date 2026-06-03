import { FadeIn, AnimatedText } from '../animations';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export const SectionHeading = ({
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) => {
  const alignment = centered ? 'text-center' : 'text-left';
  const titleColor = light ? 'text-white' : 'text-forest-deep';
  const subtitleColor = light ? 'text-white/80' : 'text-neutral-medium-gray';

  return (
    <FadeIn className={`mb-12 lg:mb-16 ${alignment}`}>
      <AnimatedText
        as="h2"
        text={title}
        light={light}
        className={`text-3xl md:text-4xl lg:text-5xl font-semibold ${titleColor} tracking-tight`}
      />
      {subtitle && (
        <p
          className={`mt-4 text-lg md:text-xl ${subtitleColor} max-w-3xl ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
};
