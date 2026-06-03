import { Menu, Zap, Clock } from 'lucide-react';
import { useInView } from '../../hooks';

/**
 * Generated phone mock — a "rebuilt" fast restaurant site with live
 * PageSpeed / load badges. Animates in on scroll via useInView.
 * Ported from the design kit's Graphics.jsx PhoneMock.
 */
export const PhoneMock = () => {
  const [ref, seen] = useInView(0.3);

  return (
    <div ref={ref} className="phone-stage" data-seen={seen} aria-hidden="true">
      <div className="phone sq-floaty">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="ps-top">
            <span className="ps-dot" />
            <span className="ps-brand">Northwind</span>
            <span className="ps-menu">
              <Menu size={14} />
            </span>
          </div>
          <div className="ps-hero">
            <span className="ps-tag">Live · v2.0</span>
            <div className="ps-h1">Everything your team needs, in one place</div>
            <div className="ps-cta">Get started</div>
          </div>
          <div className="ps-row">
            <div className="ps-card" />
            <div className="ps-card" />
            <div className="ps-card" />
          </div>
          <div className="ps-reviews">
            <span className="ps-stars">★★★★★</span>
            <span className="sq-mono" style={{ fontSize: 11, color: 'var(--sq-medium-gray)' }}>
              4.9 · 1,280
            </span>
          </div>
        </div>
      </div>
      <div className="ps-badge ps-badge-speed">
        <Zap size={15} /> <b className="ps-badge-num">92</b> PageSpeed
      </div>
      <div className="ps-badge ps-badge-load">
        <Clock size={14} /> <b className="ps-badge-num">1.4s</b> load
      </div>
    </div>
  );
};
