import { Menu, Zap, Clock } from 'lucide-react';
import { useInView } from '../../hooks';

/**
 * Decorative phone mock for a made-up brand ("Northwind"), used to illustrate
 * the kind of thing we build. Animates in on scroll via useInView. Ported from
 * the design kit's Graphics.jsx PhoneMock.
 *
 * It is labelled "Example project" and carries no star rating on purpose: it is
 * aria-hidden, but a sighted visitor still reads any number in here as one of
 * OUR statistics. Do not put a review count, a client name or a real metric in
 * this component — if we ever want to publish real numbers, they belong in copy
 * where they can be sourced.
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
            <span className="ps-tag">Example project</span>
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
