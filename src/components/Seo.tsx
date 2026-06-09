import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.synquanta.com';
const DEFAULT_OG = '/brand-kit/png/og-image-1200x630.png';

interface SeoProps {
  /** Full <title> for the page. */
  title: string;
  /** Meta description — keep unique per route, ~150–160 chars. */
  description: string;
  /** Route path beginning with "/", e.g. "/services". Drives canonical + og:url. */
  path: string;
  /** OG/Twitter card image (absolute or root-relative). Defaults to the brand card. */
  image?: string;
}

/**
 * Per-route head management. Google renders JS, so it reads these tags for
 * indexing. Non-JS social scrapers (LinkedIn/WhatsApp) fall back to the static
 * homepage card in index.html for sub-pages — accepted SPA trade-off.
 */
export function Seo({ title, description, path, image = DEFAULT_OG }: SeoProps) {
  const url = `${SITE_URL}${path}`;
  const img = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
