import { PageHero, LegalDoc } from '../components/ui';
import { Seo } from '../components/Seo';
import { breadcrumb } from '../lib/structuredData';

/**
 * Terms & Conditions for the SynQuanta AI Receptionist subscription.
 *
 * Written for the actual product: a $299/month AI phone receptionist for US HVAC
 * contractors, sold through Paddle as merchant of record. Paddle's verification
 * reviewers read this page, so the merchant-of-record disclosure, the billing
 * mechanics and the call-recording responsibilities are stated explicitly rather
 * than left to a generic template.
 */
export const HvacTermsPage = () => {
  return (
    <>
      <Seo
        path="/hvac/terms"
        title="Terms & Conditions | SynQuanta Technologies"
        description="The terms governing the SynQuanta AI Receptionist subscription: the service, the 14-day free trial, $299/month billing through Paddle as merchant of record, cancellation, call recording and acceptable use."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Terms & Conditions', path: '/hvac/terms' },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="The agreement between your business and SynQuanta Technologies Ltd for the AI Receptionist service."
        image="/images/services-workspace.jpg"
      />

      <LegalDoc
        lastUpdated="28 July 2026"
        lastUpdatedIso="2026-07-28"
        summary="You subscribe to an AI receptionist that answers the calls your business misses. It costs $299 per month after a 14-day free trial, and it is billed by Paddle, not by us. You can cancel at any time and keep the service until the end of the period you have already paid for. The calls belong to you and your customers. You decide what happens to that data, and you are responsible for telling your customers that calls are recorded where the law requires it."
      >
        <section>
          <h2>1. Who we are and what this covers</h2>
          <p>
            This service is operated by <strong>SynQuanta Technologies Ltd</strong> ("SynQuanta",
            "we", "us"). These Terms &amp; Conditions form the agreement between SynQuanta and the
            business that subscribes to the SynQuanta AI Receptionist ("you", "your business", "the
            Customer").
          </p>
          <p>
            By starting a free trial, creating an account, or using the service, you confirm that
            you have read and accepted these terms and that you are authorised to accept them on
            behalf of your business. If you do not accept them, do not use the service.
          </p>
          <p>
            The service is sold to businesses. It is not intended for consumers, and it is not
            intended for personal or household use.
          </p>
        </section>

        <section>
          <h2>2. The service</h2>
          <p>
            The SynQuanta AI Receptionist is a subscription software service that answers inbound
            telephone calls on your behalf. In normal use it:
          </p>
          <ul>
            <li>
              provides you with a dedicated telephone number to which you forward calls from your
              existing business line;
            </li>
            <li>
              answers calls that reach that number using an automated conversational AI voice
              agent;
            </li>
            <li>
              captures the caller's name, callback number, the problem they are describing and how
              urgent it is;
            </li>
            <li>books an appointment where your configured availability allows it;</li>
            <li>
              notifies you by text message and email after the call, with a recording and a written
              transcript.
            </li>
          </ul>
          <p>
            The AI agent identifies itself as an AI assistant at the start of every call. We do not
            offer, and will not build, a configuration in which the agent claims or implies that it
            is a human being.
          </p>
          <p>
            We may improve, change or replace parts of the service over time. We will not remove a
            capability that is material to the service without giving you reasonable notice by
            email.
          </p>
        </section>

        <section>
          <h2>3. Your account</h2>
          <p>
            You must give accurate business details when you sign up and keep them current. You are
            responsible for everything that happens under your account, including keeping your login
            credentials confidential. Tell us promptly at{' '}
            <a href="mailto:info@synquanta.com">info@synquanta.com</a> if you believe your account
            has been accessed by someone who should not have access to it.
          </p>
          <p>
            An account covers one business. If you operate multiple businesses or brands that need
            separate numbers and separate call handling, each needs its own subscription.
          </p>
        </section>

        <section>
          <h2>4. Free trial</h2>
          <p>
            New customers get a <strong>14-day free trial</strong>. The trial gives you the full
            service: a live number, live call answering and full call records.
          </p>
          <p>
            We ask for a payment method when you start the trial so that the service continues
            without an interruption if you decide to keep it. You are not charged during the trial.
            If you cancel before the trial ends, you are not charged at all.
          </p>
          <p>
            At the end of the 14 days the subscription begins automatically and the first monthly
            charge is taken, unless you have cancelled. The trial is offered once per business.
          </p>
        </section>

        <section>
          <h2>5. Price, billing and Paddle as merchant of record</h2>
          <p>
            The subscription costs <strong>$299 USD per month</strong>, billed monthly in advance,
            starting at the end of the 14-day free trial. The price includes{' '}
            <strong>500 answered minutes</strong> per billing period.
          </p>

          <h3>Paddle is the merchant of record</h3>
          <p>
            Our order process is conducted by our online reseller{' '}
            <a href="https://www.paddle.com/" target="_blank" rel="noopener noreferrer">
              Paddle.com
            </a>
            . <strong>Paddle.com is the merchant of record and the seller of record</strong> for all
            of our orders. Paddle provides all customer service enquiries relating to payment and
            handles returns.
          </p>
          <p>
            This means Paddle, not SynQuanta, takes the payment, issues the invoice or receipt,
            and is responsible for calculating, collecting and remitting sales tax and VAT where
            those apply. <strong>The charge on your card or bank statement will show Paddle</strong>{' '}
            (typically as "Paddle.net" or a similar Paddle descriptor), not SynQuanta. If you do not
            recognise a charge, look for Paddle before reporting it as fraudulent.
          </p>
          <p>
            Your use of the service is also subject to Paddle's own terms as the seller. Nothing in
            these terms limits any right you have against Paddle as the merchant of record.
          </p>

          <h3>Renewal and price changes</h3>
          <p>
            The subscription renews automatically each month on the anniversary of the date your
            paid subscription started, until you cancel it. Prices are in US dollars and exclude any
            tax that Paddle is required to add.
          </p>
          <p>
            If we change the price of the plan, we will give you at least 30 days' notice by email
            before the change applies to your subscription. The new price applies from your next
            renewal after that notice, and you may cancel before then if you do not want to continue
            at the new price.
          </p>

          <h3>Included minutes</h3>
          <p>
            "Answered minutes" means the connected talk time of calls handled by the AI agent,
            rounded up to the nearest minute per call. Unused minutes do not roll over to the next
            billing period.
          </p>
          <p>
            <strong>We do not automatically bill you for going over 500 minutes.</strong> If your
            usage consistently exceeds the included minutes, we will contact you to agree an
            arrangement before any additional charge is ever made. We may temporarily throttle or
            pause AI answering on an account whose usage is far beyond the included allowance, and we
            will tell you before we do so.
          </p>

          <h3>Failed payments</h3>
          <p>
            If a payment fails, Paddle will retry it and contact you. If it remains unpaid, we may
            suspend AI answering on your number until the account is brought up to date, and may
            close the account after continued non-payment. Calls forwarded to a suspended number are
            not answered, so keep your payment method current.
          </p>
        </section>

        <section>
          <h2>6. Cancellation</h2>
          <p>
            You can cancel at any time, for any reason, without giving a notice period and without
            speaking to anyone. Cancel from the billing section of your account dashboard, or email{' '}
            <a href="mailto:info@synquanta.com">info@synquanta.com</a> and we will process it.
          </p>
          <p>
            <strong>Cancellation takes effect at the end of the billing period you have already
            paid for.</strong> The service keeps running until that date; you are not billed again
            after it. We do not pro-rate or refund the unused part of a period that has already
            started. See the{' '}
            <a href="/hvac/refund-policy">Refund &amp; Cancellation Policy</a> for the full detail and for
            the circumstances in which we do refund.
          </p>
          <p>
            When the subscription ends, the dedicated number we allocated to you is released and
            stops answering. Forward your business line back to wherever you want it{' '}
            <strong>before</strong> that date. Export any call recordings or transcripts you want to
            keep before the account closes. Section 12 sets out how long we hold them.
          </p>
        </section>

        <section>
          <h2>7. Your telephone number and your phone service</h2>
          <p>
            The service works by call forwarding. You keep your existing business number, your
            existing carrier and your existing phone bill, and you set your line to forward to us on
            busy or no answer. We do not port your number, we do not become your telephone carrier,
            and we do not replace your phone service.
          </p>
          <p>You are responsible for:</p>
          <ul>
            <li>configuring forwarding correctly on your own line, and for any charges your own carrier makes for it;</li>
            <li>
              making sure you are entitled to forward calls made to that number and to have them
              answered on your behalf;
            </li>
            <li>keeping your own number and account with your carrier in good standing.</li>
          </ul>
          <p>
            <strong>The service is not an emergency service.</strong> It cannot dial 911 or any
            other emergency number, and it must not be relied on where a failure to reach a person
            could cause injury, loss of life or serious property damage. If you handle genuine
            life-safety emergencies, keep a human on-call route in place.
          </p>
        </section>

        <section>
          <h2>8. Call recording, AI disclosure and your legal responsibilities</h2>
          <p>
            Calls handled by the service are recorded and transcribed. That is how you get the call
            record, the lead details and the transcript.
          </p>
          <p>What we do:</p>
          <ul>
            <li>the AI agent states plainly at the start of each call that it is an AI assistant;</li>
            <li>
              it announces that the call is recorded where an announcement is required, including in
              two-party (all-party) consent states;
            </li>
            <li>it fails closed. If a required disclosure cannot be made, the call is not handled.</li>
          </ul>
          <p>What you are responsible for:</p>
          <ul>
            <li>
              <strong>You are the data controller</strong> for your customers' personal data. We
              process it on your instructions, as your processor. The{' '}
              <a href="/hvac/privacy">Privacy Policy</a> sets out exactly what that means.
            </li>
            <li>
              Confirming that recording calls in the states and provinces you operate in is lawful
              for your business, and that our announcements meet your obligations. Call-recording
              consent rules vary by state and we cannot give you legal advice about your own
              compliance.
            </li>
            <li>
              Your own privacy notices, your own consumer disclosures, and the lawful basis on which
              you hold and use the leads the service captures.
            </li>
          </ul>
          <p>
            You must not use the service to make or receive calls that break telemarketing,
            robocall, do-not-call or call-recording law. The service answers inbound calls; it is
            not a cold-calling or outbound dialling tool and must not be repurposed as one.
          </p>
        </section>

        <section>
          <h2>9. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>use the service for anything unlawful, fraudulent, harassing or deceptive;</li>
            <li>
              configure the agent to misrepresent who it is, to impersonate another business, or to
              deny that it is an AI;
            </li>
            <li>
              resell, sublicense or white-label the service, or run other businesses' calls through
              your account, without our written agreement;
            </li>
            <li>
              attempt to reverse engineer, scrape, overload, probe or interfere with the service or
              the systems it runs on;
            </li>
            <li>
              use the service to capture payment card numbers, Social Security numbers, health
              records or other sensitive categories of data. The service is designed for HVAC
              service enquiries and is not built or certified for PCI-DSS or HIPAA workloads.
            </li>
          </ul>
          <p>
            We may suspend an account immediately, without notice, where we reasonably believe it is
            being used in a way that breaks the law or that puts our systems, our carriers or other
            customers at risk. We will tell you why as soon as we reasonably can.
          </p>
        </section>

        <section>
          <h2>10. Availability and the limits of an AI agent</h2>
          <p>
            We aim to keep the service available around the clock, and we monitor it. We do not
            offer a contractual uptime guarantee or service credits on this plan. The service
            depends on third parties (telephony carriers, AI model providers and cloud hosting)
            and on your own phone line and internet connection.
          </p>
          <p>
            An AI agent is not a person. It will sometimes mishear a name, misjudge a request, or be
            unable to answer a question that a member of your team could answer. Where it cannot
            help, it is designed to take a message and hand the caller back to you rather than
            guess. <strong>Anything the agent says is not a quote, a price commitment, or advice
            from your business.</strong> You should review the call records and follow up on the
            leads it captures. We are not responsible for business you lose because a caller was not
            satisfied by an automated conversation.
          </p>
          <p>
            We may take the service down for maintenance. Where the work is planned, we will give
            notice by email.
          </p>
        </section>

        <section>
          <h2>11. Intellectual property</h2>
          <p>
            The service, the software behind it, and everything on this website belong to SynQuanta
            or our licensors. We grant you a non-exclusive, non-transferable right to use the
            service for your own business for as long as your subscription is active. Nothing more
            is transferred to you.
          </p>
          <p>
            Your business data, meaning your account details, your configuration, your call
            recordings and transcripts, and the leads captured from them, remains yours. You grant us only the
            permission we need to run the service for you: to store, process and transmit that data
            for the purposes described in these terms and in the Privacy Policy.
          </p>
          <p>
            <strong>We do not use your call recordings or transcripts to train our own AI
            models</strong>, and we do not sell them. What our third-party providers may do with data
            we send them is set out honestly in section 5 of the{' '}
            <a href="/hvac/privacy">Privacy Policy</a>. Please read it, because it is not a blanket
            guarantee.
          </p>
        </section>

        <section>
          <h2>12. Data, retention and deletion</h2>
          <p>
            Call recordings and transcripts are retained for <strong>12 months</strong> from the date
            of the call, then deleted. Account and configuration data is retained while your account
            is open and for <strong>90 days</strong> after it closes, then deleted. Records that
            Paddle or we are required by law to keep, invoices and tax records in particular, are
            kept for as long as the law requires.
          </p>
          <p>
            You can ask us to delete your data at any time by emailing{' '}
            <a href="mailto:info@synquanta.com">info@synquanta.com</a> from the address on the
            account. We action deletion requests within 30 days. Deleting your call data while your
            subscription is running will remove call records you may still need, and it cannot be
            undone. Full detail is in the <a href="/hvac/privacy">Privacy Policy</a>.
          </p>
        </section>

        <section>
          <h2>13. Suspension and termination by us</h2>
          <p>
            We may suspend or close an account if you break these terms, if payment fails and stays
            unpaid, or if we are required to by law or by one of our providers. Where the situation
            allows it, we will contact you first and give you a chance to put it right.
          </p>
          <p>
            We may also decide to withdraw the service as a whole. If we do, we will give you at
            least 30 days' notice by email and refund the unused portion of any period you have paid
            for in advance.
          </p>
        </section>

        <section>
          <h2>14. Disclaimers</h2>
          <p>
            To the fullest extent the law allows, the service is provided "as is" and "as available".
            We do not warrant that it will be uninterrupted, error-free, or that the AI agent will
            correctly capture every detail of every call. We exclude all implied warranties,
            including those of merchantability, fitness for a particular purpose and
            non-infringement, to the extent they can lawfully be excluded.
          </p>
          <p>
            Nothing in these terms excludes or limits liability that cannot lawfully be excluded or
            limited. That includes liability for death or personal injury caused by negligence, and for
            fraud.
          </p>
        </section>

        <section>
          <h2>15. Limitation of liability</h2>
          <p>
            Subject to the paragraph above, our total liability to you arising out of or in
            connection with the service, in any twelve-month period, is limited to{' '}
            <strong>the total amount you paid for the subscription in that period</strong>.
          </p>
          <p>
            We are not liable for indirect or consequential loss, or for lost profits, lost revenue,
            lost business, lost goodwill, or the value of a job you did not win, including where
            those losses arise from a missed call, a call the AI agent handled poorly, a
            notification that did not arrive, or a period of downtime.
          </p>
          <p>
            You will indemnify us against claims brought by your customers or by a regulator that
            arise from your use of the service in breach of these terms, in particular claims
            about call recording, consent or the way you use the personal data the service captures
            for you.
          </p>
        </section>

        <section>
          <h2>16. Changes to these terms</h2>
          <p>
            We may update these terms. When we make a change that materially affects your rights or
            what you pay, we will email the account address at least 30 days before it takes effect,
            and update the "Last updated" date at the top of this page. Continuing to use the service
            after a change takes effect means you accept the updated terms; if you do not, cancel
            before then.
          </p>
        </section>

        <section>
          <h2>17. General</h2>
          <p>
            If any part of these terms is found to be unenforceable, the rest continues to apply. Our
            not enforcing a term on one occasion does not waive it. You may not transfer your rights
            under these terms without our consent; we may transfer ours to a company that takes over
            our business, on notice to you.
          </p>
          <p>
            These terms, and any dispute arising from them, are governed by the laws of England and
            Wales, and the courts of England and Wales have exclusive jurisdiction. Nothing here
            removes a mandatory protection available to you under the law of the place your business
            is established.
          </p>
        </section>

        <section>
          <h2>18. Contact</h2>
          <p>
            SynQuanta Technologies Ltd
            <br />
            Email: <a href="mailto:info@synquanta.com">info@synquanta.com</a>
            <br />
            Web: <a href="https://www.synquanta.com">www.synquanta.com</a>
          </p>
          <p>
            For questions about a <strong>payment, invoice, receipt or refund</strong>, contact
            Paddle as the merchant of record at{' '}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
              paddle.net
            </a>
            , or email us and we will help you reach them.
          </p>
        </section>
      </LegalDoc>
    </>
  );
};
