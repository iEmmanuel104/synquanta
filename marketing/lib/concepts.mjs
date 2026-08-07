/**
 * The campaign concepts.
 *
 * COPY RULE: every line is lifted from approved production strings (the live
 * site, src/constants/*.ts) or written in the same voice. Nothing is invented.
 *
 * DESIGN RULE: the 9:16 Status frame is the hardest constraint and is designed
 * first — a viewer gives it two or three seconds, sound off, one thumb away
 * from skipping. So each concept carries ONE idea, ONE proof element and ONE
 * logo, and every other placement is that same idea re-flowed rather than a
 * new design.
 *
 * LAYOUT: three zones — header, main (grows and centres), footer. The canvas
 * is `space-between`, so a tall frame distributes instead of top-loading. The
 * first pass stacked everything at the top and left the bottom 40% empty.
 */
import { C, GRADIENT, PLACEMENTS, logoWhite, markWhite, clearSpace } from './brand.mjs';

const px = (n) => `${Math.round(n)}px`;

function metrics(placement) {
  const p = PLACEMENTS[placement];
  const wide = p.w > p.h; // 1200x628 link ad
  const tall = p.h / p.w >= 1.5; // 1080x1920 status / story
  return {
    p,
    wide,
    tall,
    // Display size is driven by width, damped hard on the wide format where
    // vertical room is scarce.
    h1: px(wide ? p.w * 0.058 : tall ? p.w * 0.099 : p.w * 0.079),
    body: px(wide ? p.w * 0.0225 : p.w * 0.0295),
    small: px(p.w * 0.021),
    stat: px(wide ? p.w * 0.1 : tall ? p.w * 0.185 : p.w * 0.15),
    logoW: wide ? 200 : 290,
    markSz: wide ? 64 : 92,
    padX: Math.round(p.w * 0.075),
  };
}

/* ---------------------------------------------------------------- chrome */

/** Background: soft brand glow + the orbit ring + an oversized watermark mark. */
function backdrop(m) {
  const ringD = m.p.w * (m.wide ? 0.78 : 0.92);
  return `
  <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">
    <div style="
      position:absolute;width:${px(m.p.w * 1.1)};height:${px(m.p.w * 1.1)};
      left:${px(-m.p.w * 0.35)};bottom:${px(-m.p.w * 0.42)};
      background:radial-gradient(circle,rgba(82,183,136,.20) 0%,transparent 62%)"></div>
    <div class="ring" style="
      width:${px(ringD)};height:${px(ringD)};
      top:${px(-ringD * 0.3)};right:${px(-ringD * 0.34)}"></div>
    <div class="ring" style="
      width:${px(ringD * 0.62)};height:${px(ringD * 0.62)};
      top:${px(-ringD * 0.12)};right:${px(-ringD * 0.15)};
      border-color:rgba(149,213,178,.09)"></div>
    <div style="
      position:absolute;right:${px(-m.p.w * 0.1)};bottom:${px(m.p.h * (m.wide ? 0.04 : 0.12))};
      opacity:.05">${markWhite(Math.round(m.p.w * 0.52))}</div>
  </div>`;
}

function header(m, eyebrow) {
  return `<div>
    <div class="eyebrow">${eyebrow}</div>
    <div style="width:${px(m.p.w * 0.075)};height:3px;border-radius:99px;background:${GRADIENT.accent};margin-top:${px(m.p.h * 0.014)}"></div>
  </div>`;
}

function footer(m, cta) {
  return `<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:${px(24)};
      padding-top:${px(clearSpace(m.markSz))};border-top:1px solid rgba(255,255,255,.09)">
    <div>${logoWhite(m.logoW)}</div>
    <div style="text-align:right">
      <div class="mono" style="font-size:${px(m.p.w * 0.0255)};color:${C.mintPale};letter-spacing:.01em">${cta.url}</div>
      ${cta.note ? `<div style="font-size:${m.small};color:rgba(255,255,255,.55);margin-top:${px(7)}">${cta.note}</div>` : ''}
    </div>
  </div>`;
}

/** The single proof element. Anchored with a gradient bar so it never floats. */
function proof(m, { value, label }) {
  return `<div style="display:flex;align-items:center;gap:${px(m.p.w * 0.03)}">
    <div style="width:4px;align-self:stretch;border-radius:99px;background:${GRADIENT.accent}"></div>
    <div>
      <div class="mono display" style="font-size:${m.stat};line-height:.95;color:${C.white}">${value}</div>
      <div style="font-size:${m.small};color:rgba(255,255,255,.6);margin-top:${px(10)};max-width:26ch">${label}</div>
    </div>
  </div>`;
}

/** Shared skeleton so all concepts share one rhythm. */
function frame(m, { eyebrow, headline, body, aside, cta }) {
  const mainDir = m.wide ? 'row' : 'column';
  return `${backdrop(m)}
<div class="canvas" style="justify-content:space-between">
  ${header(m, eyebrow)}
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:${px(m.p.h * 0.03)} 0">
    <div style="display:flex;flex-direction:${mainDir};gap:${px(m.wide ? m.p.w * 0.05 : m.p.h * 0.045)};${m.wide ? 'align-items:center' : ''}">
      <div style="${m.wide ? 'flex:1.35' : ''}">
        <h1 style="font-size:${m.h1};max-width:${m.wide ? '18ch' : '15ch'}">${headline}</h1>
        <p style="font-size:${m.body};line-height:1.5;color:rgba(255,255,255,.72);margin-top:${px(m.p.h * 0.026)};max-width:31ch">${body}</p>
      </div>
      <div style="${m.wide ? 'flex:.85' : ''}">${aside}</div>
    </div>
  </div>
  ${footer(m, cta)}
</div>`;
}

/* -------------------------------------------------------------- concepts */

// 1 — Positioning. Why us, stated as a stake rather than a capability list.
function researchFirst(placement) {
  const m = metrics(placement);
  const steps = ['Research', 'Design', 'Build', 'Launch'];
  return frame(m, {
    eyebrow: 'SynQuanta Technologies',
    headline: `Most software fails because <span class="grad">someone guessed</span>`,
    body: 'We read your market and talk to your users before we open an editor. What we find usually changes the brief.',
    aside: `<div style="display:flex;flex-direction:column;gap:${px(m.p.h * 0.016)}">
      ${steps
        .map(
          (s, i) => `<div style="display:flex;align-items:center;gap:${px(16)}">
        <span class="mono" style="font-size:${px(m.p.w * 0.021)};color:${C.sageLight};width:${px(m.p.w * 0.05)}">0${i + 1}</span>
        <span style="font-size:${px(m.p.w * 0.03)};color:rgba(255,255,255,.92)">${s}</span>
        ${i < steps.length - 1 ? `<span style="flex:1;height:1px;background:rgba(255,255,255,.1)"></span>` : ''}
      </div>`,
        )
        .join('')}
    </div>`,
    cta: { url: 'synquanta.com', note: 'Web & mobile product studio' },
  });
}

// 2 — Proof. Five shipped products, named.
function shipped(placement) {
  const m = metrics(placement);
  const projects = ['Funded Forge', 'GritGateway', 'BlackAt', 'Busy2Shop', 'Nevelline'];
  return frame(m, {
    eyebrow: 'Recent work',
    headline: `Five products. <span class="grad">Real users.</span>`,
    body: 'Fintech, education, community, marketplaces and fashion. Each one started as a conversation much like the one you are about to have.',
    aside: `<div style="display:flex;flex-wrap:wrap;gap:${px(12)}">
      ${projects
        .map(
          (n) => `<span style="
        font-size:${px(m.p.w * 0.0265)};font-weight:500;
        padding:${px(m.p.w * 0.015)} ${px(m.p.w * 0.028)};
        border:1px solid rgba(149,213,178,.32);border-radius:999px;
        background:rgba(255,255,255,.05);color:${C.creamGreen};white-space:nowrap">${n}</span>`,
        )
        .join('')}
    </div>`,
    cta: { url: 'synquanta.com/portfolio', note: 'See the full portfolio' },
  });
}

// 3 — Direct response. The live site CTA, which is the strongest ask we own.
function hardPart(placement) {
  const m = metrics(placement);
  return frame(m, {
    eyebrow: "Let's talk",
    headline: `Bring us the <span class="grad">hard part</span>`,
    body: 'A half-formed idea, or a product that has stopped scaling. Either way you get back a written plan and a price before anyone starts work.',
    aside: proof(m, {
      value: '1 week',
      label: 'of finding out who your users actually are, before a line of code gets written.',
    }),
    cta: { url: 'synquanta.com/contact', note: 'A real person reads it' },
  });
}

// ---------------------------------------------------------------------------
// HIDDEN 2026-08-07 — the AI Receptionist concept. Kept, not deleted: restore
// it to CONCEPTS below when the product is finished end to end and /hvac goes
// public again. Its price line must be re-checked against src/constants/hvac.ts
// at that point, because verify.mjs only guards concepts that are active.
//
// function missedCall(placement) {
//   const m = metrics(placement);
//   return frame(m, {
//     eyebrow: 'For HVAC contractors',
//     headline: `The job goes to <span class="grad">whoever picks up first</span>`,
//     body: 'A homeowner with no cold air does not leave a message. Our AI receptionist answers the calls you miss and books the job.',
//     aside: proof(m, { value: '24/7', label: 'answered, on the number you already advertise' }),
//     cta: { url: 'synquanta.com/hvac', note: '14 days free, then $299/month' },
//   });
// }
// ---------------------------------------------------------------------------

export const CONCEPTS = {
  'research-first': {
    title: 'Most software fails because someone guessed',
    role: 'positioning',
    render: researchFirst,
  },
  shipped: {
    title: 'Five products. Real users.',
    role: 'proof',
    render: shipped,
  },
  'hard-part': {
    title: 'Bring us the hard part',
    role: 'direct response',
    render: hardPart,
  },
};
