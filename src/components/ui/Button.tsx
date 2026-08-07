import { m as motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const MotionLink = motion.create(Link);

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  href,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-sq transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-forest-deep via-forest-primary to-sage-medium text-white shadow-sq hover:shadow-sq-lg',
    secondary:
      'bg-transparent text-forest-deep border-2 border-forest-deep hover:bg-forest-deep hover:text-white',
    ghost: 'bg-transparent text-forest-primary hover:bg-cream-green',
    gold: 'bg-gradient-to-br from-[#E6C772] to-[#F2DC9C] text-neutral-charcoal shadow-[0_8px_28px_rgba(230,199,114,0.42)] hover:shadow-[0_12px_40px_rgba(230,199,114,0.55)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // Every variant below shares one hover/tap spring. Under prefers-reduced-motion
  // the scale is dropped entirely (the CSS colour transition still gives the
  // affordance) — this component previously animated regardless of the setting.
  const shouldReduceMotion = useReducedMotion();
  const press = shouldReduceMotion
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
      };

  if (href) {
    // Internal route → client-side <Link>; external / hash / mailto → plain anchor.
    const isInternal = href.startsWith('/') && !href.startsWith('//');
    if (isInternal) {
      return (
        <MotionLink
          to={href}
          className={combinedClassName}
          onClick={onClick}
          {...press}
        >
          {children}
        </MotionLink>
      );
    }
    // onClick is forwarded to the link variants too — a landing-page CTA needs
    // to fire an analytics event on the way out, and navigation still happens
    // natively via href.
    return (
      <motion.a
        href={href}
        className={combinedClassName}
        onClick={onClick}
        {...press}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      {...(disabled ? {} : press)}
    >
      {children}
    </motion.button>
  );
};
