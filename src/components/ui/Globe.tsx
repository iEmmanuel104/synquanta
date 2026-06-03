import { useEffect, useMemo, useRef } from 'react';
import createGlobe, { type Marker } from 'cobe';
import { GLOBE_CITIES, type GlobeCity } from '../../constants/hostCities';
import { useInView } from '../../hooks';

// Brand colours as cobe's [r,g,b] 0–1 triples.
const FOREST_DEEP: [number, number, number] = [0.105, 0.263, 0.196]; // #1B4332
const SAGE: [number, number, number] = [0.34, 0.78, 0.57]; // glow tint
const MAJOR: [number, number, number] = [0.46, 0.94, 0.67]; // brighter green
const WORLD: [number, number, number] = [0.3, 0.6, 0.47]; // dimmer green
const BASE_SIZE = 0.042;

interface PulseMarker {
  location: [number, number];
  color: [number, number, number];
  phase: number;
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasWebGL = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
};

interface GlobeProps {
  className?: string;
  /** Marker set to plot — defaults to the full city list. */
  cities?: GlobeCity[];
  ariaLabel?: string;
}

export const Globe = ({
  className,
  cities = GLOBE_CITIES,
  ariaLabel = 'Interactive spinning globe of the places we build for',
}: GlobeProps) => {
  const [containerRef, seen] = useInView(0.12);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phi = useRef(0);
  const drag = useRef(0); // accumulated drag rotation (radians)
  const pointerStart = useRef<number | null>(null);
  const dragBase = useRef(0);

  const baseMarkers = useMemo<PulseMarker[]>(
    () =>
      cities.map((c, i) => ({
        location: [c.lat, c.lng],
        color: c.tier === 'global' ? WORLD : MAJOR,
        phase: (i % 8) * 0.85, // de-sync so the dots twinkle rather than blink together
      })),
    [cities],
  );

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!seen || !container || !canvas) return;

    const reduce = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = container.offsetWidth || 480;
    let raf = 0;

    const initialMarkers: Marker[] = baseMarkers.map((m) => ({
      location: m.location,
      size: BASE_SIZE,
      color: m.color,
    }));

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: w * dpr,
      height: w * dpr,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: FOREST_DEEP,
      markerColor: MAJOR,
      glowColor: SAGE,
      markers: initialMarkers,
    });

    const ro = new ResizeObserver(() => {
      w = container.offsetWidth || w;
      globe.update({ width: w * dpr, height: w * dpr });
    });
    ro.observe(container);

    const start = performance.now();
    const tick = () => {
      if (!reduce && pointerStart.current === null) phi.current += 0.0035;
      const t = (performance.now() - start) / 1000;
      const pulsed: Marker[] = baseMarkers.map((m) => ({
        location: m.location,
        color: m.color,
        size: reduce ? BASE_SIZE : BASE_SIZE * (1 + 0.5 * Math.sin(t * 2.4 + m.phase)),
      }));
      globe.update({ phi: phi.current + drag.current, markers: pulsed });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      globe.destroy();
    };
  }, [seen, containerRef, baseMarkers]);

  const onDown = (e: React.PointerEvent) => {
    pointerStart.current = e.clientX;
    dragBase.current = drag.current;
    (e.target as HTMLElement).style.cursor = 'grabbing';
  };
  const onUp = (e: React.PointerEvent) => {
    pointerStart.current = null;
    (e.target as HTMLElement).style.cursor = 'grab';
  };
  const onMove = (e: React.PointerEvent) => {
    if (pointerStart.current !== null) {
      drag.current = dragBase.current + (e.clientX - pointerStart.current) / 180;
    }
  };

  return (
    <div ref={containerRef} className={className} style={{ aspectRatio: '1 / 1', width: '100%' }}>
      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerOut={onUp}
        onPointerMove={onMove}
        aria-label={ariaLabel}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          touchAction: 'pan-y',
          contain: 'layout paint size',
          opacity: seen ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      />
    </div>
  );
};
