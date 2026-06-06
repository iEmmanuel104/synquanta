import { ReactNode } from 'react';
import { FadeIn, AnimatedText } from '../animations';
import { Picture } from './Picture';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Background image path under /images. */
  image: string;
  children?: ReactNode;
}

/**
 * Consistent, image-rich header used at the top of every inner page. The photo
 * sits behind a forest-green wash so white text stays legible; height clears the
 * fixed header.
 */
export const PageHero = ({ eyebrow, title, subtitle, image, children }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-forest-deep">
      {/* Background image + brand wash */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* noAvif: eager above-the-fold image — webp decodes faster in Safari. */}
        <Picture
          src={image}
          alt=""
          loading="eager"
          fetchPriority="high"
          noAvif
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/85 via-forest-deep/80 to-forest-deep/95" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(149,213,178,0.10) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-16 lg:pt-40 lg:pb-20 text-center">
        {eyebrow && <p className="sq-eyebrow mb-3.5 text-mint-pale">{eyebrow}</p>}
        <AnimatedText
          as="h1"
          text={title}
          light
          className="mx-auto max-w-4xl text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1]"
        />
        {subtitle && (
          <FadeIn delay={0.15}>
            <p className="mx-auto mt-5 max-w-2xl text-lg md:text-xl text-white/70 leading-relaxed">
              {subtitle}
            </p>
          </FadeIn>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};
