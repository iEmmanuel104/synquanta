import { ArrowUpRight } from 'lucide-react';

interface VisitLinkProps {
  url: string;
  name: string;
  className?: string;
}

/** Link out to a client's live product. Always a new tab, never passes our window. */
export const VisitLink = ({ url, name, className = '' }: VisitLinkProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Visit ${name} (opens in a new tab)`}
    className={`group/visit inline-flex items-center gap-1.5 text-sm font-semibold text-forest-primary transition-colors hover:text-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2 ${className}`}
  >
    Visit live site
    <ArrowUpRight
      size={16}
      className="transition-transform duration-200 group-hover/visit:-translate-y-0.5 group-hover/visit:translate-x-0.5"
    />
  </a>
);
