import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'light' | 'dark' | 'gradient';
}

export const Section = ({
  id,
  children,
  className = '',
  variant = 'default',
}: SectionProps) => {
  const variants = {
    default: 'bg-neutral-off-white',
    light: 'bg-cream-green',
    dark: 'bg-forest-deep text-white',
    gradient:
      'bg-gradient-to-br from-forest-deep via-forest-primary to-sage-medium text-white',
  };

  return (
    <section
      id={id}
      className={`section-padding ${variants[variant]} ${className}`}
    >
      <div className="container-custom">{children}</div>
    </section>
  );
};
