import { m as motion } from 'framer-motion';
import { HERO_STEPS, HERO_STEP_MS } from '../../hooks/useHeroCycle';

interface HeroPipelineProps {
  step: number;
  cycle: number;
}

/** Four-stage progress strip: the studio's process, played as a loop. */
export const HeroPipeline = ({ step, cycle }: HeroPipelineProps) => (
  <ol
    className="mx-auto mt-10 grid w-full max-w-md grid-cols-4 gap-2 lg:mx-0"
    aria-label="How we work: research, design, build, launch"
  >
    {HERO_STEPS.map((label, i) => {
      const state = i < step ? 'done' : i === step ? 'active' : 'todo';
      return (
        <li key={label} className="flex flex-col gap-2">
          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
              state === 'todo' ? 'text-white/35' : 'text-mint-pale'
            }`}
          >
            {label}
          </span>
          <span className="relative h-[3px] overflow-hidden rounded-full bg-white/10">
            <motion.span
              key={state === 'active' ? `a-${cycle}-${i}` : state}
              className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-sage-light to-mint-pale"
              initial={{ scaleX: state === 'active' ? 0 : state === 'done' ? 1 : 0 }}
              animate={{ scaleX: state === 'todo' ? 0 : 1 }}
              transition={
                state === 'active'
                  ? { duration: HERO_STEP_MS / 1000, ease: 'linear' }
                  : { duration: 0.2 }
              }
            />
          </span>
        </li>
      );
    })}
  </ol>
);
