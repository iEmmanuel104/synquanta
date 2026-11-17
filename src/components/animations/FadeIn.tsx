import { m as motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { EASE_OUT, DUR, VIEWPORT } from '../../lib/motion';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

export const FadeIn = ({
  children,
  delay = 0,
  direction = 'up',
  duration = DUR.base,
  className,
}: FadeInProps) => {
  const shouldReduceMotion = useReducedMotion();

  const directions = {
    up: { y: 16 },
    down: { y: -16 },
    left: { x: 16 },
    right: { x: -16 },
    none: {},
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
