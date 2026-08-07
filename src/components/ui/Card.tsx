import { m as motion, useReducedMotion } from 'framer-motion';
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

  // Reduced motion: no motion node at all. StaggerContainer also degrades to a
  // plain <div> in that mode, so a child still carrying `variants` has nothing
  // orchestrating it — harmless today, but one `initial` away from rendering
  // permanently hidden. FadeIn and AnimatedText bail out the same way.
  if (shouldReduceMotion) {
    return <div className={`${baseStyles} ${className}`}>{children}</div>;
  }

  if (!hover) {
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
