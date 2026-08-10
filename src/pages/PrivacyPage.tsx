import { PageHero, LegalDoc } from '../components/ui';
import { Seo } from '../components/Seo';
import { breadcrumb } from '../lib/structuredData';

/**
 * Privacy policy for THIS WEBSITE ONLY — www.synquanta.com.
 *
 * Scope matters here. The AI Receptionist product has its own, separate policy
 * in HvacPrivacyPage.tsx (call recordings, voice sub-processors, 12-month
 * retention). That document is about a paid service; this one is about a
 * marketing site with a contact form, cookieless analytics and an advertising
 * pixel. Do not merge them — a visitor reading this should not be told about
 * call recording, and a paying customer should not have to infer their rights
 * from a website notice.
 *
 * Everything stated below is checked against what the site actually does:
 *   - the form fields in components/sections/Contact.tsx
 *   - the request path in api/contact.ts (platform API first, Resend fallback)
 *   - the analytics setup in lib/posthog.ts (cookieless, no autocapture of PII)
 *   - the Meta Pixel in lib/facebook-pixel.ts, which DOES set cookies and is
 *     the reason this page can no longer claim the site sets none
 * If any of those change, change this page in the same commit.
 *
 * NOTE: no governing-law or jurisdiction clause. Deliberate, pending
 * confirmation of the operating entity — see the note in HvacTermsPage.tsx.
 */
export const PrivacyPage = () => {
  return (
    <>
      <Seo
        path="/privacy"
        title="Privacy Policy | SynQuanta Technologies"
        description="What personal data www.synquanta.com collects, why, how long it is kept and how to have it deleted. Covers the contact form, our cookieless analytics and the Meta advertising pixel."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/privacy' },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        image="/images/services-workspace.jpg"
        subtitle="What this website collects, why we collect it, and how to get it removed."
      />

      <LegalDoc
        summary="This covers the SynQuanta website only. We collect what you type into the contact form, plus anonymous page statistics. Because we advertise on Facebook and Instagram, this site also runs the Meta Pixel, which sets cookies and tells Meta which pages you opened — never your name, email or message. We do not sell anything to anyone, and we do not use what you send us to train AI models. Email info@synquanta.com and we will delete your details."
        lastUpdated="10 August 2026"
        lastUpdatedIso="2026-08-10"
      >
        <section>
          <h2>1. Who this covers</h2>
          <p>
            This policy applies to <strong>www.synquanta.com</strong>, the SynQuanta
            Technologies website. It explains what happens to personal data you give us
            through this site.
          </p>
          <p>
            It does <strong>not</strong> cover our AI Receptionist product, which processes
            phone calls on behalf of the businesses that subscribe to it. That service has
            its own separate privacy policy, provided to customers when they sign up, and
            nothing in this document describes it.
          </p>
          <p>
            Contact us about anything here, including a request to delete your data, at{' '}
            <a href="mailto:info@synquanta.com">info@synquanta.com</a>.
          </p>
        </section>

        <section>
          <h2>2. What we collect</h2>
          <h3>The contact form</h3>
          <p>
            When you submit the form on our contact page we receive what you typed:
            your <strong>name</strong> and <strong>email address</strong> (both required),
            your <strong>message</strong>, and optionally your{' '}
            <strong>company name</strong>, <strong>phone number</strong> and the type of
            work you are enquiring about. We also record the page you submitted from.
          </p>
          <p>
            That is the whole list. There is no hidden field and no profile built about
            you beyond what you chose to send.
          </p>

          <h3>Analytics</h3>
          <p>
            We use <strong>PostHog in cookieless mode</strong> to count page views and see
            which pages people read. It sets <strong>no cookies</strong>. What it records
            is aggregate and not tied to a name or an email address.
          </p>

          <h3>Advertising — the Meta Pixel</h3>
          <p>
            We advertise on Facebook, Instagram and WhatsApp, so this site runs the{' '}
            <strong>Meta Pixel</strong>. Unlike our analytics, it{' '}
            <strong>does set cookies</strong> — <code>_fbp</code> on any visit, and{' '}
            <code>_fbc</code> if you arrive by clicking one of our ads. It tells Meta which
            pages you opened and whether you sent the contact form, so we can see which ads
            actually work and stop paying for the ones that do not.
          </p>
          <p>
            It is <strong>not</strong> given your name, email address, phone number or
            anything you typed into the form. When you submit an enquiry, Meta is told that
            an enquiry happened and which of the six categories you picked, nothing more.
          </p>
          <p>
            You can switch this off. Browser tracking protection, an ad blocker, or the ad
            settings in your own Facebook or Instagram account will all stop it, and none of
            that affects the rest of the site.
          </p>

          <h3>Server logs</h3>
          <p>
            Our hosting providers keep standard technical logs (IP address, browser type,
            timestamp) for security and to keep the site running. We do not use these to
            identify individual visitors.
          </p>
        </section>

        <section>
          <h2>3. Why we hold it, and on what basis</h2>
          <ul>
            <li>
              <strong>To reply to you</strong>: if you send an enquiry we use your details
              to answer it and to discuss the work. Basis: your request, and our legitimate
              interest in responding to people who contact us.
            </li>
            <li>
              <strong>To keep a record of enquiries</strong>: so a conversation is not lost
              if it spans weeks. Basis: our legitimate interest in running the business.
            </li>
            <li>
              <strong>To understand what the site is doing</strong>: aggregate, cookieless
              statistics. Basis: our legitimate interest, balanced by the fact that the
              data is not personally identifying.
            </li>
            <li>
              <strong>To measure our advertising</strong>: the Meta Pixel, so we know which
              ads bring people who actually get in touch. Basis: our legitimate interest in
              not wasting money on advertising that does not work. This is the one thing on
              this list you may not want, so the section above explains how to stop it.
            </li>
          </ul>
          <p>
            We do <strong>not</strong> use your enquiry to add you to a marketing list. If
            we ever want to email you about something other than your enquiry, we will ask
            first.
          </p>
        </section>

        <section>
          <h2>4. Who else sees it</h2>
          <p>
            A contact form submission passes through a small number of service providers,
            each doing one job:
          </p>
          <ul>
            <li>
              <strong>Vercel</strong>: hosts this website and runs the function that
              receives the form.
            </li>
            <li>
              <strong>Railway</strong>: hosts the application and database where the
              enquiry is stored.
            </li>
            <li>
              <strong>Resend</strong>: delivers the notification email to our inbox.
            </li>
            <li>
              <strong>PostHog</strong>: the cookieless analytics described above. It is not
              given your contact details.
            </li>
            <li>
              <strong>Meta</strong> (Facebook, Instagram): the advertising pixel described
              above. It is told which pages you opened and whether you sent an enquiry. It
              is not given your name, email address, phone number or your message.
            </li>
          </ul>
          <p>
            We do not sell personal data, we do not share it for anyone else&rsquo;s
            marketing, and we do not use it to train AI models. We will disclose data if
            the law requires it.
          </p>
        </section>

        <section>
          <h2>5. How long we keep it</h2>
          <ul>
            <li>
              <strong>Enquiries</strong>: kept while the conversation is live and for a
              reasonable period afterwards, so we have context if you come back. Ask us to
              delete it sooner and we will.
            </li>
            <li>
              <strong>Notification emails</strong>: retained in our inbox under the same
              approach.
            </li>
            <li>
              <strong>Analytics</strong>: aggregate and cookieless, retained per our
              analytics provider&rsquo;s own schedule.
            </li>
            <li>
              <strong>Advertising cookies</strong>: the Meta Pixel&rsquo;s{' '}
              <code>_fbp</code> and <code>_fbc</code> cookies last up to 90 days from your
              last visit. Clear your browser cookies and they are gone.
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Your rights</h2>
          <p>
            You can ask us to show you what we hold about you, correct it, delete it, or
            stop using it. Email{' '}
            <a href="mailto:info@synquanta.com">info@synquanta.com</a> and we will action
            it. We will not charge you for this and we will not make it difficult.
          </p>
          <p>
            If you are unhappy with how we have handled your data, you can also complain to
            the data protection authority responsible for your country.
          </p>
        </section>

        <section>
          <h2>7. Children</h2>
          <p>
            This is a business website. It is not directed at children and we do not
            knowingly collect data from them.
          </p>
        </section>

        <section>
          <h2>8. Changes</h2>
          <p>
            If we change how this site handles personal data, we will update this page and
            move the date at the top. There is no version of this policy that applies
            retroactively without you being able to see it here.
          </p>
        </section>
      </LegalDoc>
    </>
  );
};
