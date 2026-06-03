import { MapPin } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { useInView, useCountUp } from '../../hooks';
import wcStadium from '../../assets/worldcup/wc-stadium.svg';

/** Circular gauge (score out of 100), count-up animated when `active`. */
const Gauge = ({
  value,
  max = 100,
  size = 92,
  stroke = 8,
  color,
  track = 'rgba(27,67,50,.1)',
  active,
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  color: string;
  track?: string;
  active: boolean;
  label?: string;
}) => {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const offset = active ? C * (1 - pct) : C;
  const shown = useCountUp(value, active, 1200);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          className="font-mono"
          style={{
            fontWeight: 700,
            fontSize: size > 80 ? 22 : 18,
            color: 'var(--sq-charcoal)',
            lineHeight: 1,
          }}
        >
          {Math.round(shown)}
        </span>
        {label && (
          <span style={{ fontSize: 10, color: 'var(--sq-medium-gray)', marginTop: 2 }}>{label}</span>
        )}
      </div>
    </div>
  );
};

interface Competitor {
  name: string;
  rating: number;
  reviews: number;
  score: number;
  you?: boolean;
}

/** Horizontal score bar for a competitor row. */
const CompRow = ({
  name,
  rating,
  reviews,
  score,
  maxScore,
  active,
  delay = 0,
  you,
}: Competitor & { maxScore: number; active: boolean; delay?: number }) => {
  const w = active ? `${Math.max(8, (score / maxScore) * 100)}%` : '0%';
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '4px 14px',
        alignItems: 'center',
        padding: '9px 0',
        borderBottom: '1px solid var(--sq-cream-green)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: you ? 'var(--sq-forest-primary)' : 'var(--sq-charcoal)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </span>
          {you && (
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '.06em',
                color: '#fff',
                background: 'var(--sq-error)',
                padding: '2px 7px',
                borderRadius: 9999,
                whiteSpace: 'nowrap',
              }}
            >
              YOU · #15
            </span>
          )}
        </div>
        <div className="bar-track" style={{ marginTop: 6 }}>
          <div
            className="bar-fill"
            style={{
              width: w,
              background: you ? 'var(--sq-medium-gray)' : 'var(--sq-gradient-accent)',
              transitionDelay: `${delay}ms`,
            }}
          />
        </div>
      </div>
      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        <span className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--sq-charcoal)' }}>
          {rating.toFixed(1)}★
        </span>
        <span className="font-mono" style={{ fontSize: 12, color: 'var(--sq-medium-gray)', marginLeft: 8 }}>
          {reviews.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const COMPETITORS: Competitor[] = [
  { name: "Dick's Drive-In", rating: 4.6, reviews: 9548, score: 18.31 },
  { name: 'Taste of India', rating: 4.4, reviews: 3161, score: 15.4 },
  { name: "Voula's Offshore Cafe", rating: 4.7, reviews: 1415, score: 14.81 },
  { name: 'Portage Bay Cafe', rating: 4.3, reviews: 2495, score: 14.61 },
  { name: 'Burritos California', rating: 3.9, reviews: 1581, score: 9.4, you: true },
];

const RevenueRisk = ({ active }: { active: boolean }) => {
  const v = useCountUp(20167, active, 1400);
  return (
    <span
      className="font-mono"
      style={{
        fontWeight: 700,
        fontSize: 'clamp(30px,3.4vw,40px)',
        color: 'var(--sq-wc-gold-bright)',
        letterSpacing: '-0.01em',
        lineHeight: 1,
      }}
    >
      ${Math.round(v).toLocaleString()}
      <span style={{ fontSize: 18, color: 'rgba(230,199,114,.6)', fontWeight: 600 }}>/mo</span>
    </span>
  );
};

export const Intel = () => {
  const [ref, seen] = useInView(0.22);
  const maxScore = 18.31;

  return (
    <section id="research" className="intel-sec scroll-mt-20">
      <div className="wc-pattern" style={{ opacity: 0.4 }} aria-hidden="true" />
      <img src={wcStadium} alt="" aria-hidden="true" className="intel-stadium" />
      <div className="container-custom relative z-10">
        <p className="sq-eyebrow mb-3.5 text-center text-mint-pale">The research engine</p>
        <SectionHeading
          light
          title="We study your business before we ever say hello"
          subtitle="Every call starts with a real report built from live Google data. Here's an actual one — a restaurant 7.8 km from a 2026 host stadium."
        />

        <div ref={ref} className="report-card reveal-up" data-seen={seen}>
          {/* identity + readiness */}
          <div className="report-head">
            <div>
              <span className="report-live">
                <span className="report-livedot" /> Live Google &amp; BrightLocal data
              </span>
              <h3 className="report-name">Burritos California</h3>
              <div className="report-meta">
                <MapPin size={15} /> 4743 University Wy NE, Seattle, WA
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Gauge value={60} active={seen} color="var(--sq-warning)" label="ready" />
              <div style={{ maxWidth: 130 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    color: 'var(--sq-medium-gray)',
                  }}
                >
                  World Cup
                  <br />
                  readiness score
                </div>
              </div>
            </div>
          </div>

          {/* metric tiles */}
          <div className="report-tiles">
            <div className="tile tile-risk">
              <div className="tile-label">Estimated monthly exposure</div>
              <RevenueRisk active={seen} />
              <div className="tile-sub">Revenue at risk before kickoff</div>
            </div>
            <div className="tile">
              <div className="tile-label">Mobile PageSpeed</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Gauge value={43} active={seen} size={70} stroke={7} color="var(--sq-error)" />
                <div
                  className="font-mono"
                  style={{ fontSize: 13, color: 'var(--sq-medium-gray)', lineHeight: 1.5 }}
                >
                  3.0s load
                  <br />
                  53% leave
                </div>
              </div>
            </div>
            <div className="tile">
              <div className="tile-label">Local map rank</div>
              <div
                className="font-mono"
                style={{ fontWeight: 700, fontSize: 30, color: 'var(--sq-charcoal)' }}
              >
                #15
                <span style={{ fontSize: 17, color: 'var(--sq-medium-gray)', fontWeight: 600 }}> / 21</span>
              </div>
              <div className="rank-track">
                <div className="rank-marker" style={{ left: seen ? `${(15 / 21) * 100}%` : '0%' }} />
              </div>
              <div className="tile-sub">Below 14 nearby competitors</div>
            </div>
            <div className="tile tile-stadium">
              <div className="tile-label">Nearest 2026 venue</div>
              <div
                className="font-mono"
                style={{ fontWeight: 700, fontSize: 30, color: 'var(--sq-forest-primary)' }}
              >
                7.8
                <span style={{ fontSize: 17, color: 'var(--sq-medium-gray)', fontWeight: 600 }}> km</span>
              </div>
              <div className="tile-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={13} color="var(--sq-sage-medium)" /> Lumen Field, Seattle
              </div>
            </div>
          </div>

          {/* competitor ranking */}
          <div className="report-comp">
            <div className="comp-head">
              <h4>Who matchday tourists see first</h4>
              <span className="font-mono" style={{ fontSize: 12, color: 'var(--sq-medium-gray)' }}>
                "near me" · 2.5 km
              </span>
            </div>
            {COMPETITORS.map((c, i) => (
              <CompRow key={c.name} {...c} maxScore={maxScore} active={seen} delay={i * 110} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
