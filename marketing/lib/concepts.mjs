/**
 * The campaign concepts.
 *
 * FOCUS: what SynQuanta does, and how it does it. Not who its clients are —
 * an ad is the wrong surface for a client list, and naming other companies'
 * brands in paid media is a permission question we do not need to open. The
 * portfolio lives on the site, one click away, for anyone who wants it.
 *
 * COPY RULE: every line is lifted from approved production strings (the live
 * site, src/constants/*.ts) or written in the same voice. Nothing is invented.
 *
 * NO TIMELINE CLAIMS. Do not put a duration on research, design or delivery in
 * an ad — "a week of research" reads as a fixed process, gets quoted back at
 * you in a sales call, and is wrong for most projects. Scope drives the
 * schedule and the schedule is agreed per project, in writing.
 *
 * DESIGN RULE: the 9:16 Status frame is the hardest constraint and is designed
 * first — a viewer gives it two or three seconds, sound off, one thumb away
 * from skipping. Each concept carries ONE idea and ONE logo; every other
 * placement is that idea re-flowed rather than a new design.
 */
import { C, GRADIENT, PLACEMENTS, logoWhite, markWhite, clearSpace, photo } from './brand.mjs';

const px = (n) => `${Math.round(n)}px`;

function metrics(placement) {
  const p = PLACEMENTS[placement];
  const wide = p.w > p.h;
  const tall = p.h / p.w >= 1.5;
  return {
    p,
    wide,
    tall,
    h1: px(wide ? p.w * 0.058 : tall ? p.w * 0.099 : p.w * 0.079),
    body: px(wide ? p.w * 0.0225 : p.w * 0.0295),
    small: px(p.w * 0.021),
    logoW: wide ? 200 : 290,
    markSz: wide ? 64 : 92,
  };
}

/* ---------------------------------------------------------------- chrome */

/**
 * Background: a royalty-free photograph occupying a defined BAND, fading into
 * the brand colour, plus the orbit ring and an oversized watermark mark.
 *
 * The band matters. The first version washed the photo across the whole canvas
 * at 28% opacity under a near-opaque gradient — which kept the copy legible but
 * made the photograph invisible, so it was paying page weight for nothing. Now
 * the image owns the top third (or the right side on the landscape canvas) at
 * full strength and fades to solid, and every word of copy sits on solid brand
 * colour. The photo is actually seen; the type never fights it for contrast.
 *
 * Photographs and their licences are recorded in public/images/CREDITS.md.
 * House rules there: no recognisable faces, no readable brand logos.
 */
function backdrop(m, image) {
  const ringD = m.p.w * (m.wide ? 0.78 : 0.92);
  const src = image ? photo(image) : '';
  // Where the photo lives, and which way it fades into the brand colour.
  const band = m.wide
    ? { pos: 'top:0;bottom:0;right:0;width:52%', fade: '270deg' }
    : { pos: 'top:0;left:0;right:0;height:44%', fade: '180deg' };
  // MASK the photo rather than covering it with an opaque gradient. An opaque
  // fade has to end on one flat colour, but the body sits on a two-stop
  // gradient, so the two never matched and left a hard horizontal seam where
  // the band stopped. Masking dissolves the photo into whatever is behind it.
  const mask = `linear-gradient(${band.fade}, #000 0%, #000 34%, rgba(0,0,0,.55) 68%, transparent 100%)`;
  return `
  <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">
    ${
      src
        ? `<div style="position:absolute;${band.pos};
             background-image:url('${src}');
             background-size:cover;background-position:center;
             filter:saturate(.55) contrast(1.05) brightness(.72);
             -webkit-mask-image:${mask};mask-image:${mask}"></div>
           <div style="position:absolute;${band.pos};
             background:linear-gradient(${band.fade},
               rgba(18,47,34,.55) 0%,
               rgba(18,47,34,.78) 55%,
               rgba(18,47,34,.35) 100%);
             -webkit-mask-image:${mask};mask-image:${mask}"></div>`
        : ''
    }
    <div style="
      position:absolute;width:${px(m.p.w * 1.1)};height:${px(m.p.w * 1.1)};
      left:${px(-m.p.w * 0.35)};bottom:${px(-m.p.w * 0.42)};
      background:radial-gradient(circle,rgba(82,183,136,.18) 0%,transparent 62%)"></div>
    <div class="ring" style="
      width:${px(ringD)};height:${px(ringD)};
      top:${px(-ringD * 0.3)};right:${px(-ringD * 0.34)}"></div>
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
      padding-top:${px(clearSpace(m.markSz))};border-top:1px solid rgba(255,255,255,.12)">
    <div>${logoWhite(m.logoW)}</div>
    <div style="text-align:right">
      <div class="mono" style="font-size:${px(m.p.w * 0.0255)};color:${C.mintPale};letter-spacing:.01em">${cta.url}</div>
      ${cta.note ? `<div style="font-size:${m.small};color:rgba(255,255,255,.6);margin-top:${px(7)}">${cta.note}</div>` : ''}
    </div>
  </div>`;
}

/** Numbered list, used for both the what-we-build and how-we-work asides. */
function numbered(m, items) {
  return `<div style="display:flex;flex-direction:column;gap:${px(m.p.h * 0.016)}">
    ${items
      .map(
        (s, i) => `<div style="display:flex;align-items:center;gap:${px(16)}">
      <span class="mono" style="font-size:${px(m.p.w * 0.021)};color:${C.sageLight};width:${px(m.p.w * 0.05)};flex-shrink:0">0${i + 1}</span>
      <span style="font-size:${px(m.p.w * 0.029)};color:rgba(255,255,255,.92)">${s}</span>
      ${i < items.length - 1 ? `<span style="flex:1;height:1px;background:rgba(255,255,255,.12)"></span>` : ''}
    </div>`,
      )
      .join('')}
  </div>`;
}

/** Ticked list, for promises rather than sequence. */
function ticked(m, items) {
  return `<div style="display:flex;flex-direction:column;gap:${px(m.p.h * 0.018)}">
    ${items
      .map(
        (s) => `<div style="display:flex;align-items:flex-start;gap:${px(14)}">
      <span style="flex-shrink:0;width:${px(m.p.w * 0.032)};height:${px(m.p.w * 0.032)};margin-top:${px(m.p.w * 0.004)};
        border-radius:99px;background:${GRADIENT.accent};
        display:flex;align-items:center;justify-content:center">
        <svg width="${Math.round(m.p.w * 0.017)}" height="${Math.round(m.p.w * 0.017)}" viewBox="0 0 24 24" fill="none"
          stroke="#0F2A1E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </span>
      <span style="font-size:${px(m.p.w * 0.029)};color:rgba(255,255,255,.92);line-height:1.35">${s}</span>
    </div>`,
      )
      .join('')}
  </div>`;
}

/** Shared skeleton so every concept keeps one rhythm across all five canvases. */
function frame(m, { eyebrow, headline, body, aside, cta, image }) {
  const mainDir = m.wide ? 'row' : 'column';
  return `${backdrop(m, image)}
<div class="canvas" style="justify-content:space-between">
  ${header(m, eyebrow)}
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:${px(m.p.h * 0.03)} 0">
    <div style="display:flex;flex-direction:${mainDir};gap:${px(m.wide ? m.p.w * 0.05 : m.p.h * 0.045)};${m.wide ? 'align-items:center' : ''}">
      <div style="${m.wide ? 'flex:1.35' : ''}">
        <h1 style="font-size:${m.h1};max-width:${m.wide ? '18ch' : '15ch'}">${headline}</h1>
        <p style="font-size:${m.body};line-height:1.5;color:rgba(255,255,255,.78);margin-top:${px(m.p.h * 0.026)};max-width:31ch">${body}</p>
      </div>
      <div style="${m.wide ? 'flex:.85' : ''}">${aside}</div>
    </div>
  </div>
  ${footer(m, cta)}
</div>`;
}

/* -------------------------------------------------------------- concepts */

// 1 — WHAT we build.
function whatWeBuild(placement) {
  const m = metrics(placement);
  return frame(m, {
    image: 'building.jpg',
    eyebrow: 'What we build',
    headline: `The software your business <span class="grad">actually runs on</span>`,
    body: 'Web platforms, mobile apps, and the internal tools that do not come off a shelf. Designed and engineered by one team, start to finish.',
    aside: numbered(m, ['Web apps & platforms', 'iOS and Android', 'Custom software', 'AI where it earns its keep']),
    cta: { url: 'synquanta.com', note: 'Web & mobile product studio' },
  });
}

// 2 — HOW we work. The differentiator is visibility, not speed.
function howWeWork(placement) {
  const m = metrics(placement);
  return frame(m, {
    image: 'planning.jpg',
    eyebrow: 'How we work',
    headline: `You see it every week. <span class="grad">No black box.</span>`,
    body: 'We find out who your users are before we build for them, settle the expensive decisions on paper, then engineer it. You get something to click through while there is still time to change your mind.',
    aside: numbered(m, ['Research', 'Design', 'Build', 'Launch and stay on it']),
    cta: { url: 'synquanta.com', note: 'Research first, then we build' },
  });
}

// 3 — The ask. Direct response, no timeline promise.
function hardPart(placement) {
  const m = metrics(placement);
  return frame(m, {
    image: 'workspace.jpg',
    eyebrow: "Let's talk",
    headline: `Bring us the <span class="grad">hard part</span>`,
    body: 'A half-formed idea, or a product that has stopped scaling. Tell us where you are and a real person will read it.',
    aside: ticked(m, [
      'A written plan, in plain English',
      'A price, before anyone starts work',
      'One team from first sketch to launch',
    ]),
    cta: { url: 'synquanta.com/contact', note: 'No pressure, no script' },
  });
}

// ---------------------------------------------------------------------------
// RETIRED CONCEPTS — kept for reference, deliberately not exported.
//
// `shipped` ("Five products. Real users.") named the five portfolio clients on
// the creative. Pulled 2026-08-07: an ad is the wrong surface for a client
// list, and putting other companies' brands in paid media raises a permission
// question we have no reason to open. The portfolio is one click away.
//
// `missedCall` sold the AI Receptionist. Hidden along with the product until it
// is finished end to end. Restore it alongside /hvac, and re-check its price
// line against src/constants/hvac.ts at that point — verify.mjs only guards
// concepts that are actually exported.
// ---------------------------------------------------------------------------

export const CONCEPTS = {
  'what-we-build': {
    title: 'The software your business actually runs on',
    role: 'what',
    render: whatWeBuild,
  },
  'how-we-work': {
    title: 'You see it every week. No black box.',
    role: 'how',
    render: howWeWork,
  },
  'hard-part': {
    title: 'Bring us the hard part',
    role: 'direct response',
    render: hardPart,
  },
};
