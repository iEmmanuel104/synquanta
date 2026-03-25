import { motion, useReducedMotion } from 'framer-motion';

const circuitPaths = [
  'M 100 100 L 300 100 L 300 250 L 500 250',
  'M 800 80 L 800 200 L 1000 200 L 1000 350',
  'M 200 500 L 400 500 L 400 650 L 600 650',
  'M 700 400 L 900 400 L 900 550 L 1100 550',
  'M 50 300 L 200 300 L 200 450 L 350 450',
  'M 900 150 L 1100 150 L 1100 300',
  'M 400 100 L 400 300 L 600 300',
  'M 600 500 L 800 500 L 800 700',
];

const nodes = [
  { cx: 300, cy: 100, delay: 0 },
  { cx: 500, cy: 250, delay: 0.5 },
  { cx: 800, cy: 200, delay: 1 },
  { cx: 1000, cy: 350, delay: 1.5 },
  { cx: 400, cy: 500, delay: 0.3 },
  { cx: 600, cy: 650, delay: 0.8 },
  { cx: 900, cy: 400, delay: 1.2 },
  { cx: 1100, cy: 550, delay: 0.6 },
  { cx: 200, cy: 300, delay: 1.8 },
  { cx: 350, cy: 450, delay: 0.9 },
  { cx: 1100, cy: 150, delay: 1.4 },
  { cx: 100, cy: 100, delay: 0.2 },
];

export const AnimatedGrid = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Dark gradient background - creates distinction from header and page */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-deep via-forest-deep/95 to-forest-deep/90" />

      {/* Dot Grid Layer - lighter for dark bg */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(149,213,178,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* SVG Circuit Lines and Nodes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* Circuit Paths - more visible on dark bg */}
        {circuitPaths.map((d, i) =>
          shouldReduceMotion ? (
            <path
              key={i}
              d={d}
              stroke="rgba(82,183,136,0.15)"
              strokeWidth="1"
              fill="none"
            />
          ) : (
            <motion.path
              key={i}
              d={d}
              stroke="rgba(82,183,136,0.25)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: 3 + i * 0.7,
                  delay: i * 0.4,
                  repeat: Infinity,
                  repeatType: 'loop',
                  repeatDelay: 2,
                  ease: 'easeInOut',
                },
                opacity: { duration: 0.5, delay: i * 0.4 },
              }}
            />
          )
        )}

        {/* Connection Nodes - brighter on dark bg */}
        {nodes.map((node, i) =>
          shouldReduceMotion ? (
            <circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r="3"
              fill="rgba(82,183,136,0.2)"
            />
          ) : (
            <motion.circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r="3"
              fill="rgba(82,183,136,0.5)"
              initial={{ opacity: 0.15, scale: 0.8 }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 3 + (i % 3),
                delay: node.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                filter: 'drop-shadow(0 0 6px rgba(82,183,136,0.4))',
              }}
            />
          )
        )}
      </svg>

      {/* Gradient mesh blobs - more visible on dark bg */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(45,106,79,0.3) 0%, transparent 70%)' }}
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, rgba(64,145,108,0.2) 0%, transparent 70%)' }}
            animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 70%)' }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Bottom fade to off-white - smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-off-white to-transparent" />
    </div>
  );
};
