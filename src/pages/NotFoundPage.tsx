import { Seo } from '../components/Seo';
import { Button } from '../components/ui/Button';

/**
 * Real 404 page (noindex) — replaces the old catch-all redirect to "/", which
 * was a soft-404 that wasted crawl budget and confused Search Console.
 */
export const NotFoundPage = () => {
  return (
    <>
      <Seo
        path="/404"
        title="Page not found | SynQuanta Technologies"
        description="The page you're looking for doesn't exist."
        noindex
      />
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-medium">404</p>
        <h1 className="mb-4 text-3xl font-semibold text-neutral-charcoal sm:text-4xl">
          This page wandered off
        </h1>
        <p className="mb-8 max-w-md text-base leading-relaxed text-neutral-medium-gray">
          The link may be broken or the page may have moved. Let's get you back on track.
        </p>
        <Button href="/" variant="primary">
          Back to home
        </Button>
      </section>
    </>
  );
};
