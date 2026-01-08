import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
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
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={combinedClassName}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
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
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};
