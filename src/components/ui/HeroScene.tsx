import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import {
  AnimatePresence,
  animate,
  m as motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { HERO_STEPS } from '../../hooks/useHeroCycle';

/* Bar heights (0–1) for each stage: the product visibly grows as it moves
   from research to launch. Animated with scaleY only, so it stays on the GPU. */
const BARS: number[][] = [
  [0.18, 0.22, 0.2, 0.26, 0.22, 0.28, 0.24, 0.3, 0.26, 0.3, 0.28, 0.32],
  [0.26, 0.32, 0.3, 0.38, 0.34, 0.42, 0.38, 0.46, 0.42, 0.5, 0.46, 0.52],
  [0.34, 0.44, 0.4, 0.52, 0.48, 0.58, 0.54, 0.64, 0.6, 0.7, 0.66, 0.74],
  [0.42, 0.54, 0.5, 0.64, 0.6, 0.72, 0.68, 0.8, 0.76, 0.88, 0.84, 0.96],
];

const STATUS = [
  { text: 'Researching', tone: 'bg-white/10 text-white/70', dot: 'bg-white/60' },
  { text: 'Designing', tone: 'bg-mint-soft/15 text-mint-pale', dot: 'bg-mint-soft' },
  { text: 'Building', tone: 'bg-sage-light/15 text-mint-pale', dot: 'bg-sage-light' },
  { text: 'Live', tone: 'bg-emerald-400/20 text-emerald-200', dot: 'bg-emerald-300' },
];

const TOASTS = [
  { title: 'Research synced', body: '14 user interviews summarised' },
  { title: 'Design approved', body: 'Client signed off on 32 screens' },
  { title: 'Build #128 passed', body: '214 tests green, ready to ship' },
  { title: 'Payment received', body: '₦250,000 from a new customer' },
];

const CODE = [
  { k: '// your-product.config.ts', c: 'text-white/35' },
  { k: 'export default {', c: 'text-mint-soft/90' },
  { k: '  research: ', v: 'true,', c: 'text-white/70', vc: 'text-mint-pale' },
  { k: '  platforms: ', v: '["web", "ios", "android"],', c: 'text-white/70', vc: 'text-sage-light' },
  { k: '  ships: ', v: '"weekly",', c: 'text-white/70', vc: 'text-sage-light' },
  { k: '}', c: 'text-mint-soft/90' },
];

/** Counts up to `to` whenever `run` changes. Writes straight to the DOM node. */
const Count = ({ to, run, format }: { to: number; run: number; format: (n: number) => string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(to * 0.6, to, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [to, run, format]);
  return <span ref={ref}>{format(to)}</span>;
};

const fmtUsers = (n: number) => Math.round(n).toLocaleString('en-NG');
const fmtRevenue = (n: number) => `₦${(n / 1_000_000).toFixed(1)}M`;
const fmtUptime = (n: number) => `${n.toFixed(1)}%`;

/** One parallax layer: deeper layers move further with the pointer. */
const Layer = ({
  depth,
  px,
  py,
  className,
  children,
}: {
  depth: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
  className: string;
  children: ReactNode;
}) => {
  const x = useTransform(px, [-0.5, 0.5], [-14 * depth, 14 * depth]);
  const y = useTransform(py, [-0.5, 0.5], [-10 * depth, 10 * depth]);
  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
};

interface HeroSceneProps {
  step: number;
  cycle: number;
}

export const HeroScene = ({ step, cycle }: HeroSceneProps) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.6 });
  const py = useSpring(my, { stiffness: 120, damping: 20, mass: 0.6 });
  const rotateY = useTransform(px, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(py, [-0.5, 0.5], [4, -4]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const status = STATUS[step];
  const toast = TOASTS[step];
  const live = step === HERO_STEPS.length - 1;

  return (
    <motion.div
      className="relative h-[470px] w-[540px] [perspective:1200px]"
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="relative h-full w-full" style={{ rotateX, rotateY }}>
        {/* Soft glow behind the product */}
        <div className="sq-aurora-pulse absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-light/20 blur-3xl" />

        {/* Back: the code that defines the product, typed in once */}
        <Layer depth={0.5} px={px} py={py} className="absolute left-0 top-0 w-[270px]">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-dark-gray/90 shadow-sq-xl backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/20 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
              <span className="h-2 w-2 rounded-full bg-green-400/70" />
            </div>
            <motion.div
              className="space-y-0.5 p-3 font-mono text-[11px] leading-relaxed"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { delayChildren: 0.7, staggerChildren: 0.22 } } }}
            >
              {CODE.map((line, i) => (
                <motion.div
                  key={i}
                  className="whitespace-nowrap"
                  variants={{
                    hidden: { clipPath: 'inset(0 100% 0 0)' },
                    show: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.35, ease: 'linear' } },
                  }}
                >
                  <span className={line.c}>{line.k}</span>
                  {line.v && <span className={line.vc}>{line.v}</span>}
                  {i === CODE.length - 1 && <span className="sq-caret ml-0.5 inline-block h-3 w-[6px] translate-y-0.5 bg-mint-soft/80" />}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Layer>

        {/* Middle: the product dashboard, growing stage by stage */}
        <Layer depth={1} px={px} py={py} className="absolute left-[56px] top-[92px] w-[430px]">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white/25" />
                <span className="h-2 w-2 rounded-full bg-white/25" />
                <span className="ml-1 rounded-md bg-black/20 px-2 py-0.5 font-mono text-[10px] text-white/45">
                  app.yourproduct.com
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors duration-300 ${status.tone}`}
              >
                <span className={`sq-livedot h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.text}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 p-4 pb-3">
              {[
                { label: 'Active users', to: 12480, f: fmtUsers },
                { label: 'Revenue', to: 4200000, f: fmtRevenue },
                { label: 'Uptime', to: 99.9, f: fmtUptime },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-lg border border-white/10 bg-black/15 px-2.5 py-2">
                  <div className="text-[9.5px] uppercase tracking-wider text-white/45">{kpi.label}</div>
                  <div className="mt-0.5 font-mono text-[15px] font-semibold text-white tabular-nums">
                    <Count to={kpi.to} run={cycle} format={kpi.f} />
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mx-4 mb-4 h-[118px] rounded-lg border border-white/10 bg-black/15 px-3 pb-2 pt-3">
              <div className="flex h-full items-end gap-[6px]">
                {BARS[step].map((h, i) => (
                  <motion.span
                    key={i}
                    className="h-full flex-1 origin-bottom rounded-t-[3px] bg-gradient-to-t from-sage-medium/70 to-mint-soft/90"
                    initial={{ scaleY: 0.05 }}
                    animate={{ scaleY: h }}
                    transition={{ type: 'spring', bounce: 0.15, visualDuration: 0.5, delay: i * 0.025 }}
                  />
                ))}
              </div>
              <svg className="pointer-events-none absolute inset-x-3 top-3 h-[96px] w-[calc(100%-24px)]" viewBox="0 0 372 96" fill="none">
                <motion.path
                  d="M2 84 C 46 76, 76 74, 112 64 S 180 54, 218 42 S 292 22, 370 8"
                  stroke="rgb(216 243 220 / 0.9)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: (step + 1) / HERO_STEPS.length }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </div>
          </div>
        </Layer>

        {/* Front: the phone app, with a notification for each stage */}
        <Layer depth={1.6} px={px} py={py} className="absolute -bottom-10 -right-2 w-[168px]">
          <div className="rounded-[26px] border-[5px] border-neutral-charcoal bg-forest-deep shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex h-[300px] flex-col gap-2 overflow-hidden rounded-[21px] bg-gradient-to-b from-forest-primary/60 to-forest-deep p-3">
              <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-white/20" />
              <div className="relative h-[66px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    className="absolute inset-x-0 top-0 rounded-xl border border-white/15 bg-white/90 p-2 shadow-sq-lg"
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ type: 'spring', bounce: 0.2, visualDuration: 0.35 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="grid h-4 w-4 place-items-center rounded-[5px] bg-forest-primary text-[8px] font-bold text-white">S</span>
                      <span className="text-[9.5px] font-semibold text-forest-deep">{toast.title}</span>
                    </div>
                    <p className="mt-0.5 text-[9px] leading-snug text-neutral-medium-gray">{toast.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="h-16 rounded-lg bg-white/10" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-12 rounded-lg bg-white/10" />
                <div className="h-12 rounded-lg bg-white/10" />
              </div>
              <div className="h-2 w-3/4 rounded-full bg-white/10" />
              <div className="h-2 w-1/2 rounded-full bg-white/10" />
              <div className="mt-auto rounded-lg bg-mint-soft/90 py-1.5 text-center text-[9px] font-semibold text-forest-deep">
                {live ? 'Open the app' : 'Coming soon'}
              </div>
            </div>
          </div>
        </Layer>

        {/* Floating result chip */}
        <Layer depth={2} px={px} py={py} className="absolute right-[150px] top-[40px]">
          <div className="sq-floaty flex items-center gap-2 rounded-full border border-white/15 bg-forest-deep/80 px-3 py-1.5 text-[11px] font-semibold text-mint-pale shadow-sq-lg backdrop-blur">
            <span className="text-emerald-300">●</span> {live ? 'Live on web, iOS & Android' : `Stage ${step + 1} of ${HERO_STEPS.length}`}
          </div>
        </Layer>
      </motion.div>
    </motion.div>
  );
};
