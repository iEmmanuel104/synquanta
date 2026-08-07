import { ReactNode } from 'react';
import { Section } from '../layout/Section';

interface LegalDocProps {
  /** One plain-English sentence summarising the document, shown above it. */
  summary: string;
  /** Human-readable date, e.g. "28 July 2026". */
  lastUpdated: string;
  /** ISO date for the <time datetime> attribute, e.g. "2026-07-28". */
  lastUpdatedIso: string;
  children: ReactNode;
}

/**
 * Shared shell for the three policy documents (/terms, /privacy,
 * /refund-policy). Gives each one the same measure, the same visible
 * "Last updated" stamp and the same plain-English summary block, so they read as
 * a coherent set. Prose styling lives in the `.legal-prose` rules in
 * styles/index.css — the pages themselves stay readable as documents.
 */
export const LegalDoc = ({ summary, lastUpdated, lastUpdatedIso, children }: LegalDocProps) => {
  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-sq-xl border border-cream-green bg-white p-5 shadow-sq sm:p-6">
          <p className="sq-eyebrow mb-2">In plain English</p>
          <p className="text-[15.5px] leading-relaxed text-neutral-dark-gray">{summary}</p>
        </div>
        <p className="mb-10 text-sm text-neutral-light-gray">
          Last updated: <time dateTime={lastUpdatedIso}>{lastUpdated}</time>
        </p>
        <div className="legal-prose">{children}</div>
      </div>
    </Section>
  );
};
