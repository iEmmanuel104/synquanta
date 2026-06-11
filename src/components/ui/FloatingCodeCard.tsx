import { m as motion, useReducedMotion } from 'framer-motion';

const codeLines = [
  { text: '// synquanta.config.ts', type: 'comment' },
  { text: 'export default {', type: 'keyword' },
  { text: '  innovation: ', type: 'key', value: 'true', valueType: 'boolean' },
  { text: '  quality: ', type: 'key', value: '"enterprise"', valueType: 'string' },
  { text: '  scale: ', type: 'key', value: 'Infinity', valueType: 'keyword' },
  { text: '}', type: 'keyword' },
];

export const FloatingCodeCard = () => {
  const shouldReduceMotion = useReducedMotion();

  const cardContent = (
    <div className="bg-neutral-dark-gray rounded-xl shadow-sq-xl border border-white/10 overflow-hidden w-full max-w-xs lg:max-w-sm" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 60px rgba(82,183,136,0.08)' }}>
      {/* Terminal Header */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-black/20 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        <span className="ml-2 text-[10px] text-white/30 font-mono">synquanta.config.ts</span>
      </div>

      {/* Code Content */}
      <div className="p-4 font-mono text-sm leading-relaxed">
        {codeLines.map((line, i) => (
          <div key={i} className="flex">
            <span className="w-5 text-right mr-3 text-white/15 text-xs select-none">
              {i + 1}
            </span>
            {line.type === 'comment' && (
              <span className="text-neutral-medium-gray/80">{line.text}</span>
            )}
            {line.type === 'keyword' && (
              <span className="text-mint-soft/90">{line.text}</span>
            )}
            {line.type === 'key' && (
              <span>
                <span className="text-white/70">{line.text}</span>
                <span
                  className={
                    line.valueType === 'string'
                      ? 'text-sage-light'
                      : line.valueType === 'boolean'
                        ? 'text-mint-pale'
                        : 'text-mint-soft'
                  }
                >
                  {line.value}
                </span>
                <span className="text-white/40">,</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (shouldReduceMotion) {
    return (
      <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      className="hidden lg:flex items-center justify-center"
      aria-hidden="true"
      initial={{ opacity: 0, x: 40, rotateY: -5 }}
      animate={{
        opacity: 1,
        x: 0,
        rotateY: 0,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay: 0.6 },
        x: { duration: 0.8, delay: 0.6, ease: 'easeOut' },
        rotateY: { duration: 0.8, delay: 0.6 },
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
      }}
    >
      {cardContent}
    </motion.div>
  );
};
