import { PageHero, LegalDoc } from '../components/ui';
import { Seo } from '../components/Seo';
import { breadcrumb } from '../lib/structuredData';

/**
 * Privacy Policy.
 *
 * The important structural point, and the one Paddle's reviewers look for on a
 * product that records phone calls: the contractor is the data CONTROLLER for
 * their own customers' data and SynQuanta is the PROCESSOR. That split runs
 * through the whole document rather than being asserted once.
 */
export const HvacPrivacyPage = () => {
  return (
    <>
      <Seo
        path="/hvac/privacy"
        title="Privacy Policy | SynQuanta Technologies"
        description="How SynQuanta Technologies handles personal data: contractor account data, plus the call recordings, transcripts and caller details processed on behalf of contractors who use the AI Receptionist. Retention periods, sub-processors and how to request deletion."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Privacy Policy', path: '/hvac/privacy' },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="What data we hold, why we hold it, how long we keep it, and how to get it deleted."
        image="/images/contact-texture.jpg"
      />

      <LegalDoc
        lastUpdated="28 July 2026"
        lastUpdatedIso="2026-07-28"
        summary="We hold two different kinds of data, and our role is different for each. Your account details are ours to look after as the controller. The recordings, transcripts and caller details produced when the AI answers your customers' calls belong to you. You are the controller there, and we only process them on your instructions. We keep call data for 12 months, we do not sell it, and we do not use it to train AI models. Email info@synquanta.com to get any of it deleted."
      >
        <section>
          <h2>1. Who we are</h2>
          <p>
            <strong>SynQuanta Technologies Ltd</strong> ("SynQuanta", "we", "us") operates the
            SynQuanta AI Receptionist and the website at www.synquanta.com.
          </p>
          <p>
            Contact us about anything in this policy, including a deletion request, at{' '}
            <a href="mailto:info@synquanta.com">info@synquanta.com</a>.
          </p>
        </section>

        <section>
          <h2>2. The two roles we play</h2>
          <p>This is the most important thing to understand about how the service handles data.</p>
          <h3>We are the controller for contractor account data</h3>
          <p>
            When you sign up, we decide what we need and why. That makes us the{' '}
            <strong>data controller</strong> for your business's account information.
          </p>
          <h3>You are the controller for your customers' data</h3>
          <p>
            When a homeowner calls your number and the AI answers, the recording, the transcript and
            the caller's details are <strong>your business's</strong> data about{' '}
            <strong>your business's</strong> customer. You decide why it is collected and what
            happens to it. You are the <strong>data controller</strong>; SynQuanta is your{' '}
            <strong>data processor</strong> and acts only on your instructions and as described in
            this policy and the <a href="/hvac/terms">Terms &amp; Conditions</a>.
          </p>
          <p>
            Practically, that means: your own privacy notice has to cover the fact that calls to
            your business are answered and recorded by an AI service; you decide how long you want
            that data kept and when it should be deleted; and if one of your customers asks you to
            delete their information, you can tell us and we will action it.
          </p>
        </section>

        <section>
          <h2>3. What we collect</h2>
          <h3>Contractor account data (we are the controller)</h3>
          <ul>
            <li>business name, contact name, email address and business phone number;</li>
            <li>the number you forward from and the dedicated number we allocate to you;</li>
            <li>
              your service configuration: service area, hours, the questions the agent should ask,
              your booking availability;
            </li>
            <li>
              account and login records, including authentication events and IP address, kept for
              security;
            </li>
            <li>
              subscription status and billing history. <strong>We never see or store your card
              details</strong>: payment is taken by Paddle as merchant of record, and only the
              subscription status flows back to us.
            </li>
          </ul>

          <h3>Call data (you are the controller, we process it)</h3>
          <ul>
            <li>the caller's telephone number and the time, duration and outcome of the call;</li>
            <li>an audio recording of the call;</li>
            <li>a written transcript of the call;</li>
            <li>
              the details the agent captured, typically the caller's name, a callback number, the
              service address or area, the problem they described and how urgent it is;
            </li>
            <li>any appointment booked as a result.</li>
          </ul>
          <p>
            The agent is designed to collect what an HVAC service call needs and nothing more. It
            does not ask for payment card numbers, Social Security numbers or health information,
            and the service must not be configured to collect them.
          </p>

          <h3>Website data</h3>
          <p>
            This website uses <strong>PostHog analytics in cookieless mode</strong>: no cookies and
            no browser storage, so there is no consent banner. We see aggregate page views,
            approximate country, referring source and in-session behaviour. We cannot join a visit
            today to a visit tomorrow, and we do not build advertising profiles. If you submit the
            contact form, we receive what you typed into it.
          </p>
        </section>

        <section>
          <h2>4. Why we process it, and our lawful basis</h2>
          <ul>
            <li>
              <strong>To provide the service</strong>: answering calls, transcribing them,
              extracting the lead, booking the job, notifying you. Basis: performance of our contract
              with you.
            </li>
            <li>
              <strong>To bill you</strong>: through Paddle. Basis: performance of our contract, and
              legal obligation for tax records.
            </li>
            <li>
              <strong>To support you</strong>: investigating a call that went wrong, which may mean
              a member of our team listening to a specific recording. Basis: legitimate interests in
              running and fixing the service.
            </li>
            <li>
              <strong>To keep the service secure and working</strong>: abuse prevention, fraud
              prevention, diagnostics, aggregate quality measurement. Basis: legitimate interests.
            </li>
            <li>
              <strong>To send you service messages</strong>: call notifications, billing notices,
              material changes to these policies. Basis: performance of our contract.
            </li>
          </ul>
          <p>
            We process your customers' call data only on your instructions as controller. We do not
            decide, independently of you, to do anything else with it.
          </p>
        </section>

        <section>
          <h2>5. What we do not do</h2>
          <ul>
            <li>
              <strong>We do not sell personal data</strong>, and we do not share it for
              cross-context behavioural advertising.
            </li>
            <li>
              <strong>We do not use your call recordings or transcripts to train our own AI
              models.</strong> We do not build models, and we do not sell or licence your call data to
              anyone who does.
            </li>
            <li>
              <strong>On our providers, we will only tell you what we can stand behind.</strong> The
              language models we use (OpenAI, Anthropic) do not train on data submitted through their
              APIs under their standard commercial terms. Our speech-recognition provider (Deepgram)
              operates a model-improvement programme that its standard pricing assumes participation
              in; where we have not purchased an exclusion, audio sent for transcription may be used to
              improve their models. We would rather say this plainly than make a blanket promise we
              have not paid for. If your business needs a contractual exclusion across every provider,
              contact us at <a href="mailto:info@synquanta.com">info@synquanta.com</a> and we will
              arrange it.
            </li>
            <li>We do not share your call data with other customers, or with your competitors.</li>
            <li>
              We do not listen to calls for curiosity. Access to recordings is limited to the people
              who need it to run or support the service, and is logged.
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Who we share it with (sub-processors)</h2>
          <p>
            Running a phone service means using specialist providers. Each is engaged under a
            contract that limits them to processing data on our instructions:
          </p>
          <ul>
            <li>
              <strong>Telephony and conversational voice AI</strong>: <strong>Vapi</strong> provides
              the phone numbers, carries the calls, runs the real-time voice agent, and produces the
              recording and transcript. It processes call audio and metadata.
            </li>
            <li>
              <strong>Speech recognition</strong>: <strong>Deepgram</strong> transcribes the caller's
              speech in real time.
            </li>
            <li>
              <strong>Language models</strong>: <strong>OpenAI</strong> powers the assistant's
              in-call conversation, and <strong>Anthropic</strong> is used after the call to summarise
              it and extract the job details.
            </li>
            <li>
              <strong>Hosting and database</strong>: our application, queues and database (Railway).
            </li>
            <li>
              <strong>Authentication</strong>: sign-in and account security (Clerk).
            </li>
            <li>
              <strong>Payments</strong>: <strong>Paddle</strong>, our merchant of record. Paddle is
              an independent controller for the payment data it collects from you; see{' '}
              <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer">
                Paddle's privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Email and messaging</strong>: sending your call notifications and account
              email (Resend).
            </li>
            <li>
              <strong>Website analytics</strong>: PostHog, cookieless, website only. It is not used
              on call data.
            </li>
          </ul>
          <p>
            We will also disclose data where the law requires it, or to establish or defend legal
            claims. If we are ever involved in a merger or acquisition, data may transfer to the
            acquiring entity under the same protections, and we will tell you.
          </p>
          <p>
            An up-to-date list of sub-processors is available on request at{' '}
            <a href="mailto:info@synquanta.com">info@synquanta.com</a>. We will give you reasonable
            notice before adding a new sub-processor that handles call content.
          </p>
        </section>

        <section>
          <h2>7. International transfers</h2>
          <p>
            The service is operated for customers in the United States, and call data is processed
            primarily on infrastructure in the United States. SynQuanta Technologies Ltd is
            established outside the United States, so data may be accessed by our team from another
            country. Where a transfer involves personal data protected by UK or EU data protection
            law, we rely on the appropriate safeguards for that transfer, including Standard
            Contractual Clauses with our providers.
          </p>
        </section>

        <section>
          <h2>8. How long we keep it</h2>
          <ul>
            <li>
              <strong>Call recordings and transcripts: 12 months</strong> from the date of the call,
              then deleted.
            </li>
            <li>
              <strong>Lead and appointment details</strong>: for as long as your account is open,
              since they are your customer records; deleted 90 days after the account closes.
            </li>
            <li>
              <strong>Account and configuration data</strong>: while the account is open, then{' '}
              <strong>90 days</strong> after cancellation, then deleted. The 90 days exist so you can
              come back without losing your setup.
            </li>
            <li>
              <strong>Security and access logs</strong>: 12 months.
            </li>
            <li>
              <strong>Invoices and tax records</strong>: kept for as long as tax law requires,
              typically 6 to 7 years. Most of these sit with Paddle as merchant of record.
            </li>
            <li>
              <strong>Website analytics</strong>: aggregate, cookieless, retained per PostHog's
              standard retention.
            </li>
          </ul>
          <p>
            If you tell us to delete call data sooner, we will. If you ask us to keep it longer, we
            will discuss it with you first. We do not extend retention silently.
          </p>
        </section>

        <section>
          <h2>9. Deleting your data</h2>
          <p>
            <strong>Email <a href="mailto:info@synquanta.com">info@synquanta.com</a> from the
            address on the account</strong>, and tell us what you want removed:
          </p>
          <ul>
            <li>a single call recording and transcript;</li>
            <li>everything relating to one caller, if that caller has asked you to erase them;</li>
            <li>all call data, keeping the account open;</li>
            <li>the account and everything in it.</li>
          </ul>
          <p>
            We acknowledge requests within 5 business days and complete them within{' '}
            <strong>30 days</strong>, including instructing our sub-processors. Backups roll off on
            their own cycle and are fully purged within a further 30 days. We will keep only what we
            are legally required to keep, such as invoice records.
          </p>
          <p>
            Deletion is permanent. If you delete call data while your subscription is live, the
            recordings, transcripts and lead details go with it.
          </p>
        </section>

        <section>
          <h2>10. Your rights</h2>
          <p>
            Depending on where you are, you may have the right to access the personal data we hold
            about you, to correct it, to have it deleted, to restrict or object to how we use it, to
            receive it in a portable format, and to withdraw consent where we relied on it. You also
            have the right to complain to your data protection authority. In the UK, that is the
            Information Commissioner's Office.
          </p>
          <p>
            <strong>If you are a caller, not a contractor:</strong> if you rang an HVAC business and
            an AI answered, the business you called is the controller of that recording, not us.
            Contact them first. If you contact us instead, we will pass your request to them and
            support them in actioning it. We cannot delete their business records on our own
            initiative.
          </p>
          <p>
            We do not charge for handling a request, and we will not treat you differently for making
            one. We may need to verify who you are before we act.
          </p>
        </section>

        <section>
          <h2>11. Security</h2>
          <p>
            Data is encrypted in transit and at rest. Access to production systems and to call
            recordings is restricted to the people who need it, protected by multi-factor
            authentication, and logged. We keep audit records of compliance-relevant events,
            including AI disclosure and recording announcements on calls.
          </p>
          <p>
            No system is perfectly secure. If a breach affects your data and is likely to present a
            risk, we will notify you without undue delay and give you what you need to meet your own
            notification obligations as controller.
          </p>
        </section>

        <section>
          <h2>12. Children</h2>
          <p>
            The service is sold to businesses and is not directed at children. We do not knowingly
            collect data from anyone under 16. If a child's details reach us incidentally through a
            recorded call, tell us and we will delete them.
          </p>
        </section>

        <section>
          <h2>13. Changes to this policy</h2>
          <p>
            We will update this page when our practices change, and change the "Last updated" date at
            the top. If a change materially affects how we handle your data, we will email the
            account address before it takes effect.
          </p>
        </section>

        <section>
          <h2>14. Contact</h2>
          <p>
            SynQuanta Technologies Ltd
            <br />
            Email: <a href="mailto:info@synquanta.com">info@synquanta.com</a>
            <br />
            Web: <a href="https://www.synquanta.com">www.synquanta.com</a>
          </p>
          <p>
            Payment and invoice data is held by <strong>Paddle</strong> as merchant of record, so
            contact them at{' '}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
              paddle.net
            </a>{' '}
            for anything relating to a charge.
          </p>
        </section>
      </LegalDoc>
    </>
  );
};
