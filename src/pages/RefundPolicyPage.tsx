import { PageHero, LegalDoc } from '../components/ui';
import { Seo } from '../components/Seo';
import { breadcrumb } from '../lib/structuredData';

/**
 * Refund & Cancellation Policy.
 *
 * Deliberately modest: the 14-day free trial is the "try before you pay"
 * mechanism, so this page does NOT promise a blanket money-back guarantee we
 * would not honour. It states exactly what is refundable, what is not, and — the
 * part reviewers check — that refunds are issued by Paddle as merchant of
 * record, with the route to request one.
 */
export const RefundPolicyPage = () => {
  return (
    <>
      <Seo
        path="/refund-policy"
        title="Refund & Cancellation Policy | SynQuanta Technologies"
        description="How cancellation and refunds work for the SynQuanta AI Receptionist: a 14-day free trial before any charge, cancel anytime effective at the end of the current billing period, and refunds issued through Paddle as merchant of record."
        jsonLd={[
          breadcrumb([
            { name: 'Home', path: '/' },
            { name: 'Refund & Cancellation Policy', path: '/refund-policy' },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Legal"
        title="Refund & Cancellation Policy"
        subtitle="How to cancel, what happens when you do, and when we refund."
        image="/images/faq-texture.jpg"
      />

      <LegalDoc
        lastUpdated="28 July 2026"
        lastUpdatedIso="2026-07-28"
        summary="You get 14 days free before you are charged anything, which is how we would rather you decide. After that it is $299 per month. You can cancel any time in two clicks; the service runs until the end of the month you have already paid for and you are not billed again. We do not routinely refund a month that has already started. But if something on our side went wrong, or you were charged in error, we will make it right. Refunds are issued by Paddle, our merchant of record."
      >
        <section>
          <h2>1. The trial comes first</h2>
          <p>
            Every new customer gets a <strong>14-day free trial</strong> with the full service: a
            live number, live call answering, real recordings and transcripts.{' '}
            <strong>You are not charged during the trial.</strong>
          </p>
          <p>
            Cancel at any point in those 14 days and no payment is ever taken, so there is nothing to
            refund. This is the right way to find out whether the service works for your business,
            and we would much rather you use it than pay for a month you did not want.
          </p>
        </section>

        <section>
          <h2>2. What you pay</h2>
          <p>
            After the trial, the subscription is <strong>$299 USD per month</strong>, billed monthly
            in advance and including <strong>500 answered minutes</strong> per billing period. There
            is no setup fee, no contract and no minimum term. The subscription renews automatically
            each month until you cancel.
          </p>
        </section>

        <section>
          <h2>3. How to cancel</h2>
          <p>You can cancel at any time, without giving a reason and without a notice period:</p>
          <ul>
            <li>
              open your <strong>account dashboard → Billing → Cancel subscription</strong>; or
            </li>
            <li>
              email <a href="mailto:info@synquanta.com">info@synquanta.com</a> from the address on
              the account and we will process it for you.
            </li>
          </ul>
          <p>
            We do not put a retention call, a phone tree or a "reason required" form in front of
            cancelling.
          </p>
        </section>

        <section>
          <h2>4. What happens when you cancel</h2>
          <ul>
            <li>
              <strong>The service keeps running until the end of the billing period you have already
              paid for.</strong> You do not lose the days you paid for.
            </li>
            <li>No further payment is taken after that date.</li>
            <li>
              On that date your dedicated number is released and stops answering.{' '}
              <strong>Point your business line back to wherever you want it before then</strong>, or
              forwarded calls will go unanswered.
            </li>
            <li>
              Your call recordings, transcripts and lead details stay available in the dashboard
              until the account closes. Export what you want to keep. Account data is deleted 90 days
              after closure. See the <a href="/privacy">Privacy Policy</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Refunds</h2>
          <h3>What is not routinely refunded</h3>
          <p>
            Because the subscription is billed monthly in advance and the trial gives you a full,
            free evaluation first, <strong>we do not routinely refund or pro-rate a billing period
            that has already begun.</strong> Cancelling stops the next payment; it does not reverse
            the current one.
          </p>
          <p>
            We would rather state that plainly than advertise a guarantee we would argue about
            later.
          </p>

          <h3>What we do refund</h3>
          <p>We will refund, in full or in part, where:</p>
          <ul>
            <li>
              <strong>you were charged in error</strong>: for example billed after cancelling, or
              charged twice for the same period;
            </li>
            <li>
              <strong>the service was substantially unavailable</strong> for a material part of the
              billing period because of a fault on our side, and calls went unanswered as a result;
            </li>
            <li>
              <strong>a first payment was taken when you had cancelled during the trial</strong> and
              the cancellation did not register;
            </li>
            <li>
              <strong>we withdraw the service or close your account without cause</strong>: we
              refund the unused portion of any period paid in advance;
            </li>
            <li>
              a refund is required by consumer or statutory law that applies to your purchase.
            </li>
          </ul>
          <p>
            Outside those cases we will still look at what happened. If you were billed for a month
            in which the service genuinely did not do its job, write to us and explain. We would
            rather resolve it than have you dispute the charge with your bank.
          </p>
          <p>
            We do not refund on the basis of low usage. A month in which few calls came in is a month
            the service was standing by, and the price does not vary with volume.
          </p>
        </section>

        <section>
          <h2>6. How to request a refund</h2>
          <p>
            Our order process is conducted by our online reseller <strong>Paddle.com</strong>.{' '}
            <strong>Paddle.com is the merchant of record and the seller of record</strong> for all of
            our orders, and provides all customer service enquiries relating to payment and returns.
            Charges appear on your statement as Paddle, not as SynQuanta.
          </p>
          <p>That gives you two routes, and either works:</p>
          <ul>
            <li>
              <strong>Through Paddle directly</strong>: go to{' '}
              <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
                paddle.net
              </a>
              , enter the email address you paid with and the last four digits of the card. You can
              find the transaction, download the invoice, and raise a refund or billing query with
              Paddle's buyer support.
            </li>
            <li>
              <strong>Through us</strong>: email{' '}
              <a href="mailto:info@synquanta.com">info@synquanta.com</a> with the email address on
              the account and the date and amount of the charge. Where a refund is due we authorise
              it with Paddle, who then issue it.
            </li>
          </ul>
          <p>
            Please raise a refund request <strong>within 30 days</strong> of the charge, so the
            transaction is still within the window in which it can be reversed cleanly.
          </p>
        </section>

        <section>
          <h2>7. How long a refund takes</h2>
          <p>
            We respond to refund requests within <strong>5 business days</strong>. Once approved,
            Paddle issues the refund to the original payment method, typically within{' '}
            <strong>5 to 10 business days</strong>, depending on your bank or card issuer. The exact
            timing is set by your bank, not by us or by Paddle.
          </p>
          <p>Refunds are issued in the original currency, to the original payment method only.</p>
        </section>

        <section>
          <h2>8. Chargebacks</h2>
          <p>
            If you do not recognise a charge, please check for <strong>Paddle</strong> on your
            statement before disputing it. That is the merchant of record for this service, and it
            is the most common reason a legitimate charge looks unfamiliar.
          </p>
          <p>
            Talk to us before raising a chargeback. A dispute takes weeks and locks the amount up
            with the card networks; an email to us is usually resolved the same week. Accounts with
            an unresolved chargeback may be suspended until it is settled.
          </p>
        </section>

        <section>
          <h2>9. Changes to this policy</h2>
          <p>
            We may update this policy. The version that applies to a charge is the one published when
            that charge was taken. Material changes are emailed to the account address before they
            take effect, and the "Last updated" date at the top of this page always reflects the
            current version.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            SynQuanta Technologies Ltd
            <br />
            Email: <a href="mailto:info@synquanta.com">info@synquanta.com</a>
            <br />
            Payments, invoices and refunds:{' '}
            <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">
              paddle.net
            </a>{' '}
            (Paddle, merchant of record)
          </p>
          <p>
            This policy sits alongside our <a href="/terms">Terms &amp; Conditions</a> and{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </section>
      </LegalDoc>
    </>
  );
};
