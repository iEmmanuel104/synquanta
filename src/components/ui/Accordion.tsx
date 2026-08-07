import { useState } from 'react';
import { m as motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '../../types';

interface AccordionProps {
  items: FaqItem[];
  /** Index that starts open, or null for all-closed. Defaults to the first item. */
  defaultOpen?: number | null;
  /** Fired when an item is opened (not when it is closed). For analytics. */
  onOpen?: (item: FaqItem, index: number) => void;
}

/** One-open-at-a-time accordion. Accessible (aria-expanded), reduced-motion safe. */
export const Accordion = ({ items, defaultOpen = 0, onOpen }: AccordionProps) => {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const reduce = useReducedMotion();

  return (
    <div className="mx-auto max-w-3xl divide-y divide-cream-green overflow-hidden rounded-sq-2xl border border-cream-green bg-white shadow-sq">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const btnId = `faq-button-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? null : i);
                  if (!isOpen) onOpen?.(item, i);
                }}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-neutral-off-white sm:px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage-light"
              >
                <span className="text-[16.5px] font-semibold text-forest-deep">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 text-sage-medium transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-neutral-medium-gray sm:px-6">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
