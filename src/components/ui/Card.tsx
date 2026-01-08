import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { staggerItemVariants } from '../animations';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = true }: CardProps) => {
  const shouldReduceMotion = useReducedMotion();

  const baseStyles =
    'bg-white rounded-sq-xl p-6 lg:p-8 shadow-sq border border-cream-green';

  if (!hover || shouldReduceMotion) {
    return (
      <motion.div
        className={`${baseStyles} ${className}`}
        variants={staggerItemVariants}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${baseStyles} ${className}`}
      variants={staggerItemVariants}
      whileHover={{
        y: -4,
        boxShadow: '0 8px 32px rgba(27, 67, 50, 0.12)',
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
};
