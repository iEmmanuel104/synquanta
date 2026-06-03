import { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { useInView } from '../../hooks';
import { Globe, hasWebGL, prefersReducedMotion } from '../ui/Globe';

interface HostCity {
  c: string;
  x: number;
  y: number;
  key?: boolean;
}

// 2026 host cities (USA) — approximate relative positions on a stylized field.
const HOST_CITIES: HostCity[] = [
  { c: 'Seattle', x: 13, y: 16, key: true },
  { c: 'SF Bay Area', x: 9, y: 38 },
  { c: 'Los Angeles', x: 14, y: 49, key: true },
  { c: 'Kansas City', x: 54, y: 37 },
  { c: 'Dallas', x: 48, y: 55 },
  { c: 'Houston', x: 52, y: 63 },
  { c: 'Atlanta', x: 73, y: 53, key: true },
  { c: 'Miami', x: 83, y: 70 },
  { c: 'Philadelphia', x: 86, y: 34 },
  { c: 'New York / NJ', x: 89, y: 29, key: true },
  { c: 'Boston', x: 93, y: 23 },
];

// connective arcs (index pairs) that "draw in"
const ARCS: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [6, 7], [3, 8], [8, 9], [9, 10],
];

const stats: [string, string][] = [
  ['16', 'Host cities · USA, Canada & Mexico'],
  ['11', 'US cities in our coverage'],
  ['7.8 km', 'Avg. distance to a host stadium'],
];

const HostCitiesMap = () => {
  const [ref, seen] = useInView(0.2);
  const pt = (i: number) => ({ x: HOST_CITIES[i].x * 9 + 30, y: HOST_CITIES[i].y * 7 + 20 });

  return (
    <div ref={ref} className="map-wrap" data-seen={seen}>
      <svg viewBox="0 0 960 560" width="100%" preserveAspectRatio="xMidYMid meet" aria-label="US host-city coverage map">
        <defs>
          <radialGradient id="mapglow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="rgba(82,183,136,.18)" />
            <stop offset="100%" stopColor="rgba(82,183,136,0)" />
          </radialGradient>
          <pattern id="mapdots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="rgba(149,213,178,.16)" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="960" height="560" fill="url(#mapglow)" />
        {/* abstract coastlines suggesting the US shape */}
        <path
          d="M70 150 C 150 90, 250 90, 300 140 S 460 120, 560 150 S 760 120, 900 150"
          fill="none"
          stroke="rgba(149,213,178,.14)"
          strokeWidth="1.5"
        />
        <path
          d="M90 430 C 220 470, 360 460, 470 440 S 700 470, 880 420"
          fill="none"
          stroke="rgba(149,213,178,.14)"
          strokeWidth="1.5"
        />
        <ellipse cx="480" cy="290" rx="430" ry="200" fill="url(#mapdots)" opacity=".7" />
        {/* connective arcs */}
        {ARCS.map(([a, b], i) => {
          const p = pt(a);
          const q = pt(b);
          const mx = (p.x + q.x) / 2;
          const my = Math.min(p.y, q.y) - 26;
          return (
            <path
              key={i}
              className="map-arc"
              d={`M${p.x} ${p.y} Q ${mx} ${my} ${q.x} ${q.y}`}
              fill="none"
              stroke="rgba(200,161,75,.4)"
              strokeWidth="1.4"
              style={{ animationDelay: `${0.3 + i * 0.12}s` }}
            />
          );
        })}
        {/* city nodes */}
        {HOST_CITIES.map((city, i) => {
          const p = pt(i);
          const r = city.key ? 7 : 5;
          return (
            <g key={city.c} className="map-node" style={{ transitionDelay: `${i * 80}ms` }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={r + 7}
                fill={city.key ? 'rgba(200,161,75,.18)' : 'rgba(82,183,136,.16)'}
                className="map-halo"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill={city.key ? 'var(--sq-wc-gold-bright)' : 'var(--sq-sage-light)'}
                stroke="rgba(255,255,255,.5)"
                strokeWidth="1"
              />
              {city.key && (
                <text
                  x={p.x + 13}
                  y={p.y + 4}
                  fontSize="15"
                  fontFamily="var(--sq-font-mono)"
                  fontWeight="600"
                  fill="rgba(255,255,255,.82)"
                >
                  {city.c}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const CoverageBand = () => {
  // Globe by default; fall back to the static SVG map for reduced-motion / no-WebGL.
  const [flat] = useState(() => prefersReducedMotion() || !hasWebGL());
  return (
    <section id="coverage" className="coverage-sec scroll-mt-20">
      <div className="wc-pattern" style={{ opacity: 0.3 }} aria-hidden="true" />
      <div className="container-custom relative z-10">
        <p className="sq-eyebrow mb-3.5 text-center text-mint-pale">Coast to coast</p>
        <SectionHeading
          light
          title="Ready in every host city before the world arrives"
          subtitle="The 2026 surge spans 16 host cities across the USA, Canada and Mexico. We've mapped the businesses, the competitors and the stadiums in each one."
        />
        {flat ? (
          <HostCitiesMap />
        ) : (
          <div className="globe-stage" aria-hidden="false">
            <Globe className="globe-canvas" />
          </div>
        )}
        <div className="coverage-stats">
          {stats.map(([v, l]) => (
            <div key={l} className="cov-stat">
              <div
                className="font-mono"
                style={{ fontWeight: 700, fontSize: 34, color: '#fff', letterSpacing: '-0.01em' }}
              >
                {v}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
