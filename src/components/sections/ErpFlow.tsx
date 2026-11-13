import { useEffect, useRef, useState } from 'react';
import { m as motion, useInView, useReducedMotion } from 'framer-motion';
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  LayoutDashboard,
  Mail,
  MessageCircle,
  NotebookPen,
  Receipt,
  Search,
  ShoppingCart,
  Rocket,
  Hammer,
  Map as MapIcon,
  Users,
  UserCog,
  EyeOff,
  Repeat,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { AnimatedIcon } from '../ui/AnimatedIcon';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { EASE_OUT, DUR, VIEWPORT } from '../../lib/motion';

/* ─────────────────────────────────────────────────────────────────────────────
 * Visual building blocks for /erp. Brand motion system (lib/motion) only; every
 * loop is switched off under prefers-reduced-motion.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Three-step "what happens" guide, used in the hero (light) and beside the form. */
const NEXT_STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ClipboardList, title: 'Tell us about your business', text: 'About 2 minutes, mostly taps.' },
  { icon: Mail, title: 'We reply within one working day', text: 'A real person, with first thoughts.' },
  { icon: Users, title: 'Session with our team', text: 'We map how you work and plan the first step.' },
];

export const HeroFlow = () => {
  const reduce = useReducedMotion();
  return (
    <ol className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-2 sm:gap-4" aria-label="How it works">
      {NEXT_STEPS.map(({ icon: Icon, title }, i) => (
        <motion.li
          key={title}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR.base, ease: EASE_OUT, delay: 0.35 + i * 0.18 }}
          className="relative flex flex-col items-center text-center"
        >
          {i < NEXT_STEPS.length - 1 && (
            <span aria-hidden="true" className="absolute left-[calc(50%+28px)] right-[calc(-50%+28px)] top-6 h-px overflow-hidden bg-white/15">
              {!reduce && (
                <motion.span
                  className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-mint-pale to-transparent"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
                />
              )}
            </span>
          )}
          <span className="relative mb-2.5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
            <Icon className="h-5 w-5 text-mint-pale" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-mint-pale text-[11px] font-bold text-forest-deep">
              {i + 1}
            </span>
          </span>
          <span className="text-[12.5px] font-medium leading-snug text-white/85 sm:text-sm">{title}</span>
        </motion.li>
      ))}
    </ol>
  );
};

/** Vertical guide beside the form: a line that fills as it scrolls into view. */
export const NextStepsRail = () => {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  return (
    <div className="rounded-sq-xl border border-cream-green bg-white p-6 shadow-sq">
      <p className="sq-eyebrow mb-1 text-sage-medium">What happens next</p>
      <h3 className="mb-6 text-xl font-semibold text-forest-deep">From your answers to a plan</h3>
      <ol ref={ref} className="relative space-y-6">
        <span aria-hidden="true" className="absolute bottom-5 left-5 top-5 w-0.5 bg-cream-green" />
        <motion.span
          aria-hidden="true"
          className="absolute left-5 top-5 w-0.5 origin-top bg-gradient-to-b from-forest-primary to-sage-medium"
          style={{ bottom: '1.25rem' }}
          initial={reduce ? false : { scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : undefined}
          transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.2 }}
        />
        {NEXT_STEPS.map(({ icon: Icon, title, text }, i) => (
          <motion.li
            key={title}
            className="relative flex gap-4"
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: DUR.fast, ease: EASE_OUT, delay: 0.25 + i * 0.4 }}
          >
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest-deep to-sage-medium shadow-sq">
              <Icon className="h-[18px] w-[18px] text-white" />
            </span>
            <span className="pt-1">
              <span className="block font-semibold text-forest-deep">{title}</span>
              <span className="block text-sm leading-relaxed text-neutral-medium-gray">{text}</span>
            </span>
          </motion.li>
        ))}
      </ol>
      <div className="mt-6 flex items-start gap-2.5 rounded-sq-lg bg-mint-pale/50 p-3.5 text-sm text-forest-deep">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest-primary" />
        No obligation. You only go ahead once you’re happy with the plan and the cost.
      </div>
    </div>
  );
};

/* ── Scattered tools → one system ─────────────────────────────────────────── */

const TOOLS: { icon: LucideIcon; label: string; rot: number }[] = [
  { icon: FileSpreadsheet, label: 'Spreadsheets', rot: -4 },
  { icon: MessageCircle, label: 'Chat groups', rot: 3 },
  { icon: NotebookPen, label: 'Paper notes', rot: -2 },
  { icon: Mail, label: 'Email threads', rot: 4 },
  { icon: UserRound, label: 'Someone’s memory', rot: -3 },
];

const MODULES: { icon: LucideIcon; label: string }[] = [
  { icon: ShoppingCart, label: 'Sales & clients' },
  { icon: Boxes, label: 'Stock' },
  { icon: Receipt, label: 'Invoices & money' },
  { icon: UserCog, label: 'Staff & tasks' },
  { icon: ClipboardList, label: 'Projects' },
  { icon: BarChart3, label: 'Reports' },
];

/** Dots streaming along a connector; horizontal on desktop, vertical on phones. */
const Stream = ({ vertical }: { vertical?: boolean }) => {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${vertical ? 'mx-auto h-16 w-1' : 'h-1 w-full'} rounded-full bg-cream-green`}
    >
      {!reduce &&
        [0, 1, 2].map((d) => (
          <motion.span
            key={d}
            className={`absolute rounded-full bg-sage-medium ${vertical ? 'left-0 h-2 w-1' : 'top-0 h-1 w-2'}`}
            animate={vertical ? { top: ['-10%', '110%'] } : { left: ['-5%', '105%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: d * 0.6 }}
          />
        ))}
    </div>
  );
};

export const ErpHub = () => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-80px' });
  const [lit, setLit] = useState(0);

  // Modules light up one after another, like work moving through the system.
  useEffect(() => {
    if (reduce || !inView) return;
    const t = setInterval(() => setLit((n) => (n + 1) % MODULES.length), 1100);
    return () => clearInterval(t);
  }, [reduce, inView]);

  return (
    <div ref={ref} className="grid items-center gap-4 lg:grid-cols-[1fr_120px_1.25fr] lg:gap-6">
      {/* Today */}
      <div className="rounded-sq-xl border border-dashed border-cream-green bg-white/70 p-6">
        <p className="sq-eyebrow mb-4 text-neutral-medium-gray">Today</p>
        <StaggerContainer className="flex flex-wrap gap-2.5">
          {TOOLS.map(({ icon: Icon, label, rot }, i) => (
            <motion.div key={label} variants={reduce ? undefined : staggerItemVariants}>
              <motion.span
                className="flex items-center gap-2 rounded-full border border-cream-green bg-white px-3.5 py-2 text-sm font-medium text-neutral-charcoal shadow-sm"
                style={{ rotate: rot }}
                animate={reduce ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              >
                <Icon className="h-4 w-4 text-neutral-medium-gray" />
                {label}
              </motion.span>
            </motion.div>
          ))}
        </StaggerContainer>
        <p className="mt-5 text-sm leading-relaxed text-neutral-medium-gray">
          The same information typed in three places. Nobody sees the whole picture.
        </p>
      </div>

      <div className="hidden lg:block">
        <Stream />
      </div>
      <div className="lg:hidden">
        <Stream vertical />
      </div>

      {/* One system */}
      <div className="relative overflow-hidden rounded-sq-xl bg-gradient-to-br from-forest-deep via-forest-primary to-sage-medium p-6 text-white shadow-sq-xl">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(216,243,220,0.12) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        />
        <div className="relative">
          <div className="mb-5 flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-sq-lg bg-white/15">
              {!reduce && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-sq-lg border border-mint-pale/60"
                  animate={{ scale: [1, 1.35], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <LayoutDashboard className="h-5 w-5 text-mint-pale" />
            </span>
            <div>
              <p className="text-lg font-semibold leading-tight">One system</p>
              <p className="text-sm text-white/70">Built around how you work</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {MODULES.map(({ icon: Icon, label }, i) => {
              const on = !reduce && i === lit;
              return (
                <motion.div
                  key={label}
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: DUR.fast, ease: EASE_OUT, delay: 0.1 + i * 0.07 }}
                  className={`flex items-center gap-2 rounded-sq-lg border px-3 py-2.5 text-[13px] font-medium transition-all duration-500 ${
                    on ? 'border-mint-pale bg-white text-forest-deep shadow-sq' : 'border-white/15 bg-white/10 text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${on ? 'text-forest-primary' : 'text-mint-pale'}`} />
                  {label}
                </motion.div>
              );
            })}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/75">
            Enter it once. Everyone sees the same, up-to-date picture.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Pains as icon cards ──────────────────────────────────────────────────── */

const PAINS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: FileSpreadsheet, title: 'Information everywhere', text: 'Spread across spreadsheets, chat groups and separate apps.' },
  { icon: EyeOff, title: 'No full picture', text: 'Nobody can see how the business is doing without asking around.' },
  { icon: UserRound, title: 'One person holds it all', text: 'Too much depends on someone remembering everything.' },
  { icon: Repeat, title: 'Double work', text: 'The same details typed in again and again, with mistakes creeping in.' },
];

export const PainCards = () => {
  const reduce = useReducedMotion();
  return (
    <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PAINS.map(({ icon: Icon, title, text }, i) => (
        <motion.div
          key={title}
          variants={reduce ? undefined : staggerItemVariants}
          className="group rounded-sq-xl border border-cream-green bg-white p-6 shadow-sq transition-all duration-300 hover:-translate-y-1.5 hover:shadow-sq-xl"
        >
          <AnimatedIcon
            index={i}
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-forest-deep to-sage-medium"
          >
            <Icon className="h-6 w-6 text-white" />
          </AnimatedIcon>
          <h3 className="mb-1.5 text-lg font-semibold text-forest-deep">{title}</h3>
          <p className="text-sm leading-relaxed text-neutral-medium-gray">{text}</p>
        </motion.div>
      ))}
    </StaggerContainer>
  );
};

/* ── How we work: a timeline that draws as it scrolls in ──────────────────── */

const WORK: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Search, title: 'Learn', text: 'We learn how your business runs today: the people, the steps, the tools.' },
  { icon: MapIcon, title: 'Plan', text: 'We agree what the system should do first, and what it will cost.' },
  { icon: Hammer, title: 'Build', text: 'We build it around the way you already work, and show progress as we go.' },
  { icon: Rocket, title: 'Launch', text: 'We set it up, move your information across and train your team.' },
];

export const WorkTimeline = () => {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const reduce = useReducedMotion();
  return (
    <ol ref={ref} className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
      {/* desktop horizontal line */}
      <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-cream-green md:block" />
      <motion.span
        aria-hidden="true"
        className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 origin-left bg-gradient-to-r from-forest-primary to-sage-medium md:block"
        initial={reduce ? false : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.2 }}
      />
      {/* phone vertical line */}
      <span aria-hidden="true" className="absolute bottom-7 left-7 top-7 w-0.5 bg-cream-green md:hidden" />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-7 left-7 top-7 w-0.5 origin-top bg-gradient-to-b from-forest-primary to-sage-medium md:hidden"
        initial={reduce ? false : { scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.2 }}
      />
      {WORK.map(({ icon: Icon, title, text }, i) => (
        <motion.li
          key={title}
          className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: DUR.base, ease: EASE_OUT, delay: 0.3 + i * 0.35 }}
        >
          <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-neutral-off-white bg-gradient-to-br from-forest-deep to-sage-medium shadow-sq md:mb-4">
            <Icon className="h-6 w-6 text-white" />
          </span>
          <span>
            <span className="sq-eyebrow block text-sage-medium">Step {i + 1}</span>
            <span className="mb-1 block text-lg font-semibold text-forest-deep">{title}</span>
            <span className="block text-sm leading-relaxed text-neutral-medium-gray md:mx-auto md:max-w-[15rem]">{text}</span>
          </span>
        </motion.li>
      ))}
    </ol>
  );
};
