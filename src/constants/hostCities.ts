// Globe markers. The 16 FIFA World Cup 2026 host cities (USA · Canada · Mexico)
// are the bright focus; a worldwide set of dim markers conveys global reach.
export interface GlobeCity {
  c: string;
  lat: number;
  lng: number;
  tier: 'key' | 'host' | 'global';
}

// Host cities — the focus (USA, Canada, Mexico). `key` = flagship metros (brighter/larger).
export const HOST_CITIES_GLOBE: GlobeCity[] = [
  { c: 'Seattle', lat: 47.61, lng: -122.33, tier: 'key' },
  { c: 'San Francisco', lat: 37.34, lng: -121.99, tier: 'host' },
  { c: 'Los Angeles', lat: 34.05, lng: -118.24, tier: 'key' },
  { c: 'Vancouver', lat: 49.28, lng: -123.12, tier: 'host' },
  { c: 'Kansas City', lat: 39.05, lng: -94.48, tier: 'host' },
  { c: 'Dallas', lat: 32.76, lng: -97.09, tier: 'host' },
  { c: 'Houston', lat: 29.68, lng: -95.41, tier: 'host' },
  { c: 'Atlanta', lat: 33.75, lng: -84.39, tier: 'key' },
  { c: 'Miami', lat: 25.96, lng: -80.24, tier: 'host' },
  { c: 'Philadelphia', lat: 39.95, lng: -75.17, tier: 'host' },
  { c: 'New York / NJ', lat: 40.81, lng: -74.07, tier: 'key' },
  { c: 'Boston', lat: 42.09, lng: -71.36, tier: 'host' },
  { c: 'Toronto', lat: 43.66, lng: -79.4, tier: 'key' },
  { c: 'Guadalajara', lat: 20.63, lng: -103.51, tier: 'host' },
  { c: 'Mexico City', lat: 19.3, lng: -99.15, tier: 'host' },
  { c: 'Monterrey', lat: 25.65, lng: -100.32, tier: 'host' },
];

// Worldwide reach — dim secondary markers across every continent.
export const GLOBAL_CITIES: GlobeCity[] = [
  { c: 'London', lat: 51.51, lng: -0.13, tier: 'global' },
  { c: 'Paris', lat: 48.86, lng: 2.35, tier: 'global' },
  { c: 'Berlin', lat: 52.52, lng: 13.4, tier: 'global' },
  { c: 'Madrid', lat: 40.42, lng: -3.7, tier: 'global' },
  { c: 'Lagos', lat: 6.52, lng: 3.38, tier: 'global' },
  { c: 'Nairobi', lat: -1.29, lng: 36.82, tier: 'global' },
  { c: 'Johannesburg', lat: -26.2, lng: 28.05, tier: 'global' },
  { c: 'Dubai', lat: 25.2, lng: 55.27, tier: 'global' },
  { c: 'Riyadh', lat: 24.71, lng: 46.68, tier: 'global' },
  { c: 'Mumbai', lat: 19.08, lng: 72.88, tier: 'global' },
  { c: 'Singapore', lat: 1.35, lng: 103.82, tier: 'global' },
  { c: 'Hong Kong', lat: 22.32, lng: 114.17, tier: 'global' },
  { c: 'Tokyo', lat: 35.68, lng: 139.69, tier: 'global' },
  { c: 'Sydney', lat: -33.87, lng: 151.21, tier: 'global' },
  { c: 'São Paulo', lat: -23.55, lng: -46.63, tier: 'global' },
  { c: 'Buenos Aires', lat: -34.6, lng: -58.38, tier: 'global' },
];

export const GLOBE_CITIES: GlobeCity[] = [...HOST_CITIES_GLOBE, ...GLOBAL_CITIES];
