import { PageHero, LegalDoc } from '../components/ui';
import { Seo } from '../components/Seo';
import { breadcrumb } from '../lib/structuredData';

/**
 * Terms of use for THIS WEBSITE ONLY — www.synquanta.com.
 *
 * This is a website notice, not a contract for services. Client work is governed
 * by the individual proposal and agreement signed for that project, and the AI
 * Receptionist product has its own separate subscription terms in
 * HvacTermsPage.tsx. Keep all three apart: this page must not imply a visitor
 * has agreed to a commercial arrangement simply by reading it.
 *
 * NOTE: no governing-law or jurisdiction clause, deliberately. The product terms
 * currently state England and Wales, which has never been confirmed against the
 * actual operating entity. Rather than propagate an unverified jurisdiction onto
 * a second document, this page omits it. Add it once the entity is confirmed.
 */
export const TermsPage = () => {
  return (
    <>
      <Seo
        path="/terms"
        title="Terms of Use | SynQuanta Technologies"
        description="The terms for using the www.synquanta.com website: what the content is, what it is not, and how our work is actually contracted."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Terms of Use', path: '/terms' },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        image="/images/services-workspace.jpg"
        subtitle="The terms for using this website. Project work is contracted separately."
      />

      <LegalDoc
        summary="These terms cover the website itself. Nothing here is a quote, an offer or a contract: if we work together, that is set out in a proposal we both agree. The words and designs on this site are ours, the client work shown belongs to those clients, and we make no promise that everything on the site is complete or current."
        lastUpdated="7 August 2026"
        lastUpdatedIso="2026-08-07"
      >
        <section>
          <h2>1. What this covers</h2>
          <p>
            These terms apply to your use of <strong>www.synquanta.com</strong>, the
            SynQuanta Technologies website. By using the site you accept them.
          </p>
          <p>They do not cover, and say nothing about:</p>
          <ul>
            <li>
              <strong>Project work.</strong> If we build something for you, the terms are
              in the proposal and agreement for that project. Those documents take
              precedence over anything on this site.
            </li>
            <li>
              <strong>The AI Receptionist product.</strong> That subscription has its own
              terms, provided when a customer signs up.
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Nothing here is an offer</h2>
          <p>
            Descriptions of what we do, the work in our portfolio and any figures mentioned
            on this site are provided for information. They are{' '}
            <strong>not a quote and not a binding offer</strong>. Every project is scoped
            and priced individually, in writing, before any work begins.
          </p>
          <p>
            Nothing on this site is legal, financial or professional advice for your
            situation.
          </p>
        </section>

        <section>
          <h2>3. Who owns what</h2>
          <p>
            The SynQuanta name, the logo, the site design, the text and the code are owned
            by us. You may read, link to and share the pages. You may not copy the site or
            substantial parts of it, present our writing as your own, or use our name or
            logo to suggest a relationship or endorsement that does not exist.
          </p>
          <p>
            <strong>The client work shown in our portfolio belongs to those clients.</strong>{' '}
            Their names, brands and product screenshots are their property and appear here
            to identify work we did. Nothing on this site transfers any right in them, and
            their inclusion does not make them a party to these terms.
          </p>
        </section>

        <section>
          <h2>4. Accuracy</h2>
          <p>
            We keep this site current, but we do not guarantee that every page is complete,
            accurate or up to date at the moment you read it. Pricing, availability and the
            services we offer change. If a decision of yours depends on something you read
            here, ask us to confirm it.
          </p>
        </section>

        <section>
          <h2>5. Using the contact form</h2>
          <p>
            The contact form is for genuine enquiries. Do not use it to send unlawful,
            abusive or deliberately misleading content, to send bulk or automated
            submissions, or to send anyone else&rsquo;s personal data without a reason to.
          </p>
          <p>
            What happens to what you send is described in our{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </section>

        <section>
          <h2>6. Links to other sites</h2>
          <p>
            Where we link out, we do not control those sites and are not responsible for
            their content or their handling of your data.
          </p>
        </section>

        <section>
          <h2>7. Availability and liability</h2>
          <p>
            This site is provided as it is. We do not promise it will always be available
            or error free, and we may change or remove any part of it without notice.
          </p>
          <p>
            To the extent the law allows, we are not liable for loss arising from your use
            of, or inability to use, this website. Nothing here limits liability that
            cannot lawfully be limited, including for death or personal injury caused by
            negligence, or for fraud.
          </p>
          <p>
            This clause is about the website. Liability for work we do for you is dealt
            with in that project&rsquo;s agreement.
          </p>
        </section>

        <section>
          <h2>8. Changes</h2>
          <p>
            We may update these terms. The version on this page, with the date at the top,
            is the one that applies.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            Questions about these terms:{' '}
            <a href="mailto:info@synquanta.com">info@synquanta.com</a>.
          </p>
        </section>
      </LegalDoc>
    </>
  );
};
