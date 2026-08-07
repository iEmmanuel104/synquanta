/**
 * The single HVAC plan, in one place.
 *
 * ⚠️ These figures must match the Paddle catalog EXACTLY — Paddle's verification
 * cross-checks the prices published on this site against the prices configured
 * on the product. They are also written out in prose on /terms and
 * /refund-policy: if you change anything here, change those two pages too.
 */
export const hvacPlan = {
  name: 'AI Receptionist for HVAC',
  priceUsd: 299,
  priceDisplay: '$299',
  interval: 'month',
  intervalDisplay: '/month',
  trialDays: 14,
  includedMinutes: 500,
  currency: 'USD',
} as const;

/** Bullet list rendered inside the pricing card. */
export const hvacPlanIncludes = [
  'A dedicated local number, live in minutes',
  '500 answered minutes included each month',
  'Answers 24/7. After hours, weekends, and while you are on a roof',
  'Every call captures name, number, the problem and how urgent it is',
  'Job booked straight into your calendar',
  'Instant text and email the moment a call ends',
  'Full recording and written transcript of every call',
  'Cancel anytime, with no contract and no setup fee',
] as const;
