import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { PortfolioProject } from '../../types';
import { Picture } from './Picture';

interface LightboxProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

/**
 * In-page screenshot viewer. Purely a showcase — there is no link off our site.
 * Closes on backdrop click or Escape; locks body scroll while open.
 */
export const Lightbox = ({ project, onClose }: LightboxProps) => {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} preview`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-forest-deep/80 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-sq-2xl bg-white shadow-sq-xl"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-forest-deep/70 text-white backdrop-blur-sm transition-colors hover:bg-forest-deep"
            >
              <X size={18} />
            </button>
            <Picture
              src={project.image}
              alt={`${project.name} — ${project.category}`}
              className="max-h-[70vh] w-full object-cover object-top"
            />
            <div className="p-6 sm:p-7">
              <p className="sq-eyebrow mb-1.5 text-sage-medium">{project.category}</p>
              <h3 className="text-xl font-semibold text-forest-deep sm:text-2xl">{project.name}</h3>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-neutral-medium-gray">
                {project.blurb}
              </p>
              {project.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-cream-green px-3 py-1 text-xs font-medium text-forest-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
