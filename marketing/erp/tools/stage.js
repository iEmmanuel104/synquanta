// ERP explainer stage. Pure function of time: window.setup(timeline) once, then window.seek(t) per frame.
// Everything is drawn into a 1000x700 SVG "stage" that each format lays out differently.
(() => {
  const FD = '#1B4332', FP = '#2D6A4F', SM = '#40916C', SL = '#52B788', MS = '#74C69D', MP = '#95D5B2',
    CG = '#D8F3DC', GR = '#74796E', LG = '#E3E8E4', OW = '#F8FAF9', CO = '#D9826A', COP = '#F6DDD4', WH = '#FFFFFF';

  // ---------------------------------------------------------------- maths
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ez = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const P = (t, a, b) => ez(cl((t - a) / (b - a)));
  const L = (a, b, p) => a + (b - a) * p;
  const pop = (t, a, len = 0.35) => { // overshoot pop 0 -> 1
    const x = cl((t - a) / len); if (x <= 0) return 0;
    const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
  };
  const rng = (seed) => { let s = seed; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; };

  // ---------------------------------------------------------------- svg bits
  const DEFS = `<defs>
    <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="${FD}" flood-opacity=".13"/></filter>
    <filter id="sh2" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${FD}" flood-opacity=".12"/></filter>
    <linearGradient id="gF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${FD}"/><stop offset="1" stop-color="${FP}"/></linearGradient>
  </defs>`;
  const G = (inner, { x = 0, y = 0, s = 1, r = 0, o = 1, cx = 0, cy = 0 } = {}) =>
    o <= 0.001 ? '' : `<g transform="translate(${x} ${y}) rotate(${r} ${cx} ${cy}) scale(${s})" opacity="${cl(o)}">${inner}</g>`;
  const T = (x, y, txt, { size = 24, w = 600, c = FD, a = 'middle', f = 'Inter', o = 1 } = {}) =>
    `<text x="${x}" y="${y}" font-family="${f === 'C' ? "'Clash Display',Inter" : 'Inter'}" font-size="${size}" font-weight="${w}" fill="${c}" text-anchor="${a}" opacity="${o}">${txt}</text>`;
  const R = (x, y, w, h, { r = 18, f = WH, s = 'none', sw = 0, fl = 'sh', o = 1, dash = '' } = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" stroke="${s}" stroke-width="${sw}" ${fl ? `filter="url(#${fl})"` : ''} opacity="${o}" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;

  // Line icons drawn in a 100x100 box (stroke style).
  const IC = {
    cart: '<path d="M14 22h12l10 40h40l9-28H32"/><circle cx="42" cy="76" r="6"/><circle cx="70" cy="76" r="6"/>',
    box: '<path d="M50 14 84 30v40L50 86 16 70V30Z"/><path d="M16 30l34 16 34-16M50 46v40"/>',
    coin: '<ellipse cx="50" cy="30" rx="28" ry="10"/><path d="M22 30v14c0 6 12 10 28 10s28-4 28-10V30"/><path d="M22 44v14c0 6 12 10 28 10s28-4 28-10V44"/><path d="M22 58v12c0 6 12 10 28 10s28-4 28-10V58"/>',
    person: '<circle cx="50" cy="34" r="16"/><path d="M20 84c2-18 14-28 30-28s28 10 30 28"/>',
    chart: '<path d="M16 84h68"/><path d="M28 74V50M46 74V30M64 74V42M82 74V22" stroke-width="10"/>',
    chat: '<path d="M16 22h68v42H44L28 80V64H16Z"/><path d="M34 43h2M50 43h2M66 43h2" stroke-width="9"/>',
    mail: '<rect x="14" y="24" width="72" height="52" rx="6"/><path d="M14 30l36 26 36-26"/>',
    sheet: '<rect x="18" y="14" width="64" height="72" rx="6"/><path d="M18 34h64M18 52h64M18 70h64M40 34v52M62 34v52"/>',
    app: '<rect x="16" y="16" width="30" height="30" rx="7"/><rect x="54" y="16" width="30" height="30" rx="7"/><rect x="16" y="54" width="30" height="30" rx="7"/><rect x="54" y="54" width="30" height="30" rx="7"/>',
    doc: '<path d="M24 12h36l18 18v58H24Z"/><path d="M60 12v18h18M36 48h28M36 62h28M36 76h16"/>',
    receipt: '<path d="M26 12h48v76l-8-6-8 6-8-6-8 6-8-6-8 6Z"/><path d="M36 32h28M36 46h28M36 60h18"/>',
    truck: '<path d="M10 28h50v40H10Z"/><path d="M60 42h18l12 14v12H60"/><circle cx="28" cy="72" r="8"/><circle cx="74" cy="72" r="8"/>',
    building: '<path d="M22 88V18h40v70M62 40h18v48M14 88h74"/><path d="M34 32h4M48 32h4M34 48h4M48 48h4M34 64h4M48 64h4" stroke-width="7"/>',
    brief: '<rect x="12" y="32" width="76" height="50" rx="8"/><path d="M36 32v-8h28v8M12 54h76"/>',
    search: '<circle cx="44" cy="44" r="24"/><path d="M62 62l20 20" stroke-width="10"/>',
    plan: '<rect x="12" y="20" width="26" height="20" rx="4"/><rect x="62" y="20" width="26" height="20" rx="4"/><rect x="37" y="62" width="26" height="20" rx="4"/><path d="M38 30h24M25 40l18 22M75 40 57 62"/>',
    blocks: '<rect x="14" y="56" width="34" height="28" rx="4"/><rect x="52" y="56" width="34" height="28" rx="4"/><rect x="33" y="22" width="34" height="28" rx="4"/>',
    flag: '<path d="M28 88V14"/><path d="M28 18h46l-10 14 10 14H28"/>',
    check: '<path d="M26 52l16 16 32-34" stroke-width="12"/>',
    gear: '<circle cx="50" cy="50" r="14"/><path d="M50 14v12M50 74v12M14 50h12M74 50h12M24 24l9 9M67 67l9 9M76 24l-9 9M33 67l-9 9"/>',
  };
  const icon = (n, x, y, s, c = FP, sw = 7) =>
    `<g transform="translate(${x - 50 * s} ${y - 50 * s}) scale(${s})" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${IC[n]}</g>`;

  // A card with an icon and optional label. (x,y) is centre.
  const tile = (n, x, y, sz, { c = FP, bg = WH, label = '', lc = FD, r = 0, s = 1, o = 1, ring = '' } = {}) =>
    G(R(-sz / 2, -sz / 2, sz, sz, { r: sz * 0.22, f: bg, s: ring || 'none', sw: ring ? 4 : 0 }) + icon(n, 0, 0, sz * 0.0062, c, 8) +
      (label ? T(0, sz / 2 + 34, label, { size: 26, w: 600, c: lc }) : ''), { x, y, s, r, o });

  const person = (x, y, s = 1, c = FP, o = 1) => G(
    `<circle cx="0" cy="-58" r="22" fill="${c}"/><path d="M-42 20c0-34 18-52 42-52s42 18 42 52Z" fill="${c}"/>`, { x, y, s, o });

  const desk = (x, y, s = 1, o = 1) => G(
    `<rect x="-170" y="0" width="340" height="16" rx="8" fill="${FD}"/><rect x="-150" y="16" width="12" height="90" rx="6" fill="${FD}"/><rect x="138" y="16" width="12" height="90" rx="6" fill="${FD}"/>
     <path d="M-62 -2h124l-10 -66h-104Z" fill="${FP}"/><rect x="-46" y="-60" width="92" height="46" rx="4" fill="${MP}" opacity=".55"/>`, { x, y, s, o });

  const hubMark = (x, y, r, o = 1) => G(
    `<circle r="${r}" fill="${WH}" filter="url(#sh)"/><circle r="${r - 8}" fill="none" stroke="${CG}" stroke-width="4"/>
     <svg x="${-r * 0.62}" y="${-r * 0.62}" width="${r * 1.24}" height="${r * 1.24}" viewBox="0 0 96 96">${window.__MARK}</svg>`, { x, y, o });

  // ------------------------------------------------- shared compositions
  const ISL = [['cart', 'Sales'], ['box', 'Stock'], ['coin', 'Money'], ['person', 'Staff'], ['chart', 'Reports']];
  const SCAT = [[150, 150], [850, 140], [880, 520], [140, 540], [520, 600]];
  const ring = (n, cx = 500, cy = 330, rad = 235) =>
    Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]; });

  // Islands travel from `from` to a ring around the hub, then connectors draw and pulses flow.
  function hubAt(lt, d, from, items = ISL, opts = {}) {
    const to = ring(items.length, 500, 330, opts.rad || 235);
    const pm = P(lt, 0.1, Math.min(2.0, d * 0.35));
    const pc = P(lt, Math.min(1.4, d * 0.25), Math.min(2.8, d * 0.5));
    let s = '';
    const hubO = P(lt, 0.3, 1.0);
    to.forEach(([tx, ty], i) => {
      const len = Math.hypot(tx - 500, ty - 330) - 150;
      const ux = (tx - 500) / Math.hypot(tx - 500, ty - 330), uy = (ty - 330) / Math.hypot(tx - 500, ty - 330);
      const x1 = 500 + ux * 80, y1 = 330 + uy * 80, x2 = tx - ux * 70, y2 = ty - uy * 70;
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${SL}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - pc)}"/>`;
      if (pc >= 1) { const ph = ((lt * 0.6 + i * 0.21) % 1); s += `<circle cx="${L(x1, x2, ph)}" cy="${L(y1, y2, ph)}" r="7" fill="${MS}"/>`; }
    });
    s += hubMark(500, 330, 78, hubO);
    items.forEach(([n, lab], i) => {
      const [fx, fy] = from[i % from.length], [tx, ty] = to[i];
      const lit = P(lt, Math.min(1.4, d * 0.25) + 0.15 * i, Math.min(1.4, d * 0.25) + 0.15 * i + 0.4);
      s += tile(n, L(fx, tx, pm), L(fy, ty, pm), 112, { c: lit > 0.5 ? FP : GR, ring: lit > 0.5 ? MP : '', label: lab, o: opts.o ?? 1 });
    });
    return s;
  }

  function messTiles(lt, d, fade = 0) {
    const r = rng(7); let s = '';
    const kinds = ['sheet', 'chat', 'mail', 'app', 'sheet', 'chat', 'doc', 'mail', 'sheet', 'chat', 'app', 'receipt', 'sheet', 'chat'];
    kinds.forEach((k, i) => {
      const x = 80 + r() * 840, y = 60 + r() * 520, rot = (r() - 0.5) * 24, t0 = (i * d * 0.55) / kinds.length;
      const p = pop(lt, t0);
      if (p <= 0) return;
      const jit = Math.sin(lt * 9 + i * 1.7) * 3;
      const tx = L(x, 500, fade), ty = L(y, 330, fade);
      s += tile(k, tx, ty, 74, { c: k === 'chat' ? SM : k === 'receipt' || k === 'doc' ? CO : GR, s: p * (1 - fade * 0.7), r: rot + jit, o: 1 - fade });
    });
    return s;
  }

  // ---------------------------------------------------------------- scenes
  const S = {};
  S.hook = (lt, d) => {
    const p = P(lt, 0, 0.6);
    let s = G(person(500, 392, 1.3) + desk(500, 455), { x: -125, y: L(-75, -105, p), o: p, s: 1.25 });
    s += tile('sheet', 760, 230 + Math.sin(lt * 2) * 8, 96, { c: SM, o: P(lt, 0.4, 1.0), r: -6 });
    const q = P(lt, d - 1.4, d - 0.3);
    s += tile('chat', 230, 200, 80, { c: SM, s: q, r: 8 }) + tile('mail', 260, 380, 74, { c: GR, s: P(lt, d - 1.1, d - 0.2), r: -10 }) +
      tile('app', 770, 420, 74, { c: GR, s: P(lt, d - 0.9, d), r: 6 });
    return s;
  };

  S.mess = (lt, d) => {
    const p = P(lt, 0.3, d);
    let s = '';
    const home = ring(5, 500, 360, 170);
    ISL.forEach(([n, lab], i) => {
      const [hx, hy] = home[i], [sx, sy] = SCAT[i];
      s += tile(n, L(hx, sx, p), L(hy, sy, p), 104, { c: GR, label: lab, lc: GR, r: Math.sin(lt * 5 + i) * 3 * p });
    });
    s += person(500, 470, 1.05) + desk(500, 480, 0.8);
    s += messTiles(lt, d);
    const qp = pop(lt, d * 0.6);
    if (qp > 0) s += G(`<circle r="40" fill="${WH}" filter="url(#sh)"/>` + T(0, 17, '?', { size: 54, w: 700, c: CO, f: 'C' }), { x: 560, y: 300, s: qp });
    const tag = lt > d * 0.42 && lt < d * 0.85 && Math.floor(lt * 2.5) % 2 === 0;
    if (tag) s += G(R(-62, -20, 124, 40, { r: 20, f: CO, fl: '' }) + T(0, 9, 'overdue', { size: 22, w: 700, c: WH }), { x: 300, y: 250, r: -6 });
    return s;
  };

  S.hub = (lt, d) => {
    const fade = P(lt, 0, 1.0);
    return messTiles(99, 1, fade) + hubAt(lt, d, SCAT);
  };

  S.pipeline = (lt, d, seg = {}) => {
    const N = seg.nodes || [['chat', 'Enquiry', 'Sales'], ['cart', 'Sale', 'Sales'], ['truck', 'Delivery', 'Warehouse'], ['doc', 'Invoice', 'Accounts'], ['coin', 'Payment', 'Owner']];
    const xs = N.map((_, i) => 110 + i * 195), y = 360;
    const stat = seg.stat || ['New enquiry', 'Sold', 'Delivered', 'Invoiced', 'Paid ✓'];
    const t0 = seg.t0 || 0.7, span = Math.max(1, d - t0 - 1.3), step = span / 4;
    const k = cl((lt - t0) / step, 0, 4); // continuous node index
    const ki = Math.floor(k + 1e-6), frac = k - ki;
    const cx = ki >= 4 ? xs[4] : L(xs[ki], xs[ki + 1], ez(cl((frac - 0.45) / 0.55)));
    const reached = (i) => lt >= t0 + i * step;
    let s = `<line x1="${xs[0]}" y1="${y}" x2="${xs[4]}" y2="${y}" stroke="${LG}" stroke-width="10" stroke-linecap="round"/>`;
    s += `<line x1="${xs[0]}" y1="${y}" x2="${cx}" y2="${y}" stroke="${SL}" stroke-width="10" stroke-linecap="round" opacity="${P(lt, t0, t0 + 0.3)}"/>`;
    N.forEach(([n, lab, team], i) => {
      const on = reached(i), po = P(lt, 0.05 * i, 0.4 + 0.05 * i);
      s += G(`<circle r="54" fill="${WH}" stroke="${on ? SL : LG}" stroke-width="6" filter="url(#sh)"/>` + icon(n, 0, 0, 0.62, on ? FP : GR, 8) +
        (on ? G(`<circle r="17" fill="${SL}"/>` + icon('check', 0, 0, 0.26, WH, 14), { x: 40, y: -40, s: pop(lt, t0 + i * step) }) : '') +
        T(0, 92, lab, { size: 26, w: 700, c: FD }), { x: xs[i], y, o: po });
      const tp = P(lt, t0 + i * step, t0 + i * step + 0.4);
      s += G(R(-80, -24, 160, 48, { r: 24, f: on ? CG : OW, fl: '' }) + icon('person', -50, 0, 0.3, on ? FP : GR, 12) + T(team.length > 7 ? 16 : 10, 8, team, { size: team.length > 7 ? 19 : 22, w: 600, c: on ? FD : GR }), { x: xs[i], y: y + 150, o: L(0.35, 1, tp) * po });
    });
    const co = P(lt, t0 - 0.4, t0);
    s += G(R(-96, -44, 192, 88, { r: 18, f: WH, s: SL, sw: 4 }) + T(0, -8, seg.card || 'Order #1042', { size: 24, w: 700, c: FD }) + T(0, 24, stat[Math.min(4, ki)], { size: 21, w: 600, c: SM }),
      { x: cx, y: y - 140 + Math.sin(lt * 3) * 3, o: co });
    return s;
  };

  S.template = (lt, d, dissolve = 0, settle = 0) => {
    // rigid grey template vs custom-fit blocks (used by `steps` phase 1 and ad E)
    const blocks = [[150, 70, SL], [90, 70, MP], [200, 70, FP], [120, 70, MS], [170, 70, SM]];
    const slots = [[260, 170], [500, 170], [740, 170], [260, 330], [500, 330]]; // equal 180x110 slots
    let s = G(R(140, 90, 720, 420, { r: 22, f: '#EEF1EF', s: '#C9D0CB', sw: 4, fl: '' }) +
      slots.map(([x, y]) => R(x - 90, y - 55, 180, 110, { r: 12, f: WH, s: '#C9D0CB', sw: 3, fl: '', dash: '10 8' })).join('') +
      T(150, 72, 'Standard software', { size: 22, w: 600, c: GR, a: 'start' }), { o: 1 - dissolve, s: L(1, 1.08, dissolve), cx: 500, cy: 300 });
    // natural flow layout
    let fx = 500 - (blocks.reduce((a, b) => a + b[0], 0) + 4 * 30) / 2;
    const flow = blocks.map(([w]) => { const x = fx + w / 2; fx += w + 30; return x; });
    if (settle > 0) {
      s += R(L(500, 60, settle), L(330, 210, settle), L(0, 880, settle), L(0, 240, settle), { r: 26, f: 'none', s: SL, sw: 5, fl: '', o: settle });
      s += T(80, 195, 'Built for you', { size: 24, w: 700, c: SM, a: 'start', o: settle });
      blocks.forEach((_, i) => { if (i < 4) s += `<path d="M${flow[i] + blocks[i][0] / 2 + 4} 330h22" stroke="${SM}" stroke-width="5" stroke-linecap="round" opacity="${settle}"/>`; });
    }
    blocks.forEach(([w, h, c], i) => {
      const [sx, sy] = slots[i];
      const squeeze = 1 - settle, jit = Math.sin(lt * 8 + i * 2) * 4 * squeeze;
      const x = L(sx, flow[i], settle), y = L(sy, 330, settle);
      const sc = L(Math.min(1, 160 / w), 1, settle);
      s += G(R(-w / 2, -h / 2, w, h, { r: 14, f: c, fl: 'sh2' }), { x, y, s: sc, r: L((i % 2 ? 9 : -8), 0, settle) + jit });
      if (settle > 0.9) s += G(`<circle r="14" fill="${WH}"/>` + icon('check', 0, 0, 0.22, SM, 14), { x: x + w / 2 - 6, y: y - h / 2 + 4, s: pop(lt, lt - (settle - 0.9) * 10) });
    });
    return s;
  };

  S.steps = (lt, d) => {
    const cut = d * 0.42;
    if (lt < cut) return S.template(lt, cut, 0, 0);
    const lt2 = lt - cut;
    let s = G(S.template(lt, cut, 1, 0), { o: 1 - P(lt2, 0, 0.4) });
    const C = [['search', 'Learn', 'How you run'], ['plan', 'Plan', 'The right flow'], ['blocks', 'Build', 'Your system'], ['flag', 'Launch', 'Team ready']];
    const appear = [0.08, 0.3, 0.45, 0.6].map((f) => f * (d - cut));
    C.forEach(([n, t, sub], i) => {
      const x = 135 + i * 243, p = pop(lt2, appear[i], 0.45);
      s += G(R(-108, -150, 216, 300, { r: 26, f: WH }) + `<circle cy="-62" r="50" fill="${CG}"/>` + icon(n, 0, -62, 0.6, FP, 8) +
        T(0, 38, t, { size: 40, w: 600, c: FD, f: 'C' }) + T(0, 80, sub, { size: 21, w: 500, c: GR }) +
        G(`<circle r="18" fill="${FD}"/>` + T(0, 7, String(i + 1), { size: 20, w: 700, c: WH }), { x: -84, y: -126 }), { x, y: 340, s: p, o: cl(p) });
      if (i < 3) s += `<path d="M${x + 116} 340h12" stroke="${SL}" stroke-width="6" stroke-linecap="round" opacity="${P(lt2, appear[i + 1], appear[i + 1] + 0.3)}"/>`;
    });
    return s;
  };

  // Industry vignettes. `ui` places the real EstateOS screenshot (HTML layer).
  const vign = {
    dist: (lt) => {
      let s = G(`<path d="M80 300 230 220 380 300Z" fill="${FP}"/>` + R(95, 300, 270, 200, { r: 6, f: CG, fl: '' }) + R(190, 390, 80, 110, { r: 4, f: FD, fl: '' }), {});
      [[120, 470], [160, 470], [140, 432]].forEach(([x, y], i) => { s += G(R(-20, -20, 40, 38, { r: 5, f: MS, fl: '' }), { x: x + 170, y }); });
      s += G(icon('truck', 0, 0, 1.5, FD, 6), { x: L(-120, 470, P(lt, 0, 1.6)), y: 470 });
      return s;
    },
    serv: (lt) => person(230, 430, 1.1) + desk(230, 440, 0.8) +
      tile('person', 400, 230, 96, { c: SM, s: pop(lt, 0.2) }) + tile('doc', 120, 230, 96, { c: SM, s: pop(lt, 0.4) }),
  };
  const chips = (lt, items) => items.map(([n, lab], i) => {
    const p = pop(lt, 0.3 + i * 0.35);
    return G(R(0, -42, 300, 84, { r: 42 }) + `<circle cx="42" r="30" fill="${CG}"/>` + icon(n, 42, 0, 0.4, FP, 9) + T(90, 10, lab, { size: 28, w: 600, c: FD, a: 'start' }), { x: 600, y: 190 + i * 125, s: p, o: cl(p) });
  }).join('');

  S.industries = (lt, d) => {
    const b = [0, d * 0.34, d * 0.65, d];
    const ph = lt < b[1] ? 0 : lt < b[2] ? 1 : 2, pl = lt - b[ph], pd = b[ph + 1] - b[ph];
    const o = Math.min(P(pl, 0, 0.35), 1 - P(pl, pd - 0.3, pd));
    if (ph === 0) return G(vign.dist(pl) + chips(pl, [['box', 'Stock'], ['cart', 'Purchases'], ['coin', 'Finances']]), { o: ph === 2 ? 1 : o });
    if (ph === 1) return G(vign.serv(pl) + chips(pl, [['person', 'Clients'], ['doc', 'Invoices'], ['chart', 'Reports']]), { o });
    UI = { x: 40, y: 20, w: 920, h: 600, img: pl < pd * 0.5 ? 0 : 1, o: P(pl, 0, 0.35), zoom: L(1.0, 1.06, pl / pd), tag: true };
    return '';
  };

  // --- consideration composites
  S.messHub = (lt, d) => { const c = d * 0.45; return lt < c ? S.mess(lt, c) : S.hub(lt - c, d - c); };
  S.stepsEos = (lt, d) => {
    const c = d * 0.62;
    if (lt < c) { const lt2 = lt; // cards only
      const C = [['search', 'Learn', 'How you run'], ['plan', 'Plan', 'The right flow'], ['blocks', 'Build', 'Your system'], ['flag', 'Launch', 'Team ready']];
      return C.map(([n, t, sub], i) => { const x = 135 + i * 243, p = pop(lt2, 0.15 + i * 0.45, 0.45);
        return G(R(-108, -150, 216, 300, { r: 26 }) + `<circle cy="-62" r="50" fill="${CG}"/>` + icon(n, 0, -62, 0.6, FP, 8) + T(0, 38, t, { size: 40, w: 600, c: FD, f: 'C' }) + T(0, 80, sub, { size: 21, w: 500, c: GR }), { x, y: 340, s: p, o: cl(p) }); }).join('');
    }
    UI = { x: 40, y: 20, w: 920, h: 600, img: 0, o: P(lt - c, 0, 0.35), zoom: L(1, 1.05, (lt - c) / (d - c)), tag: true };
    return '';
  };

  // --- cold ads
  S.memory = (lt, d) => {
    const c = d * 0.55; let s = '';
    if (lt < c + 0.6) {
      const fo = 1 - P(lt, c, c + 0.6);
      const wob = Math.sin(lt * 3.2) * (2 + lt * 0.8);
      let notes = '';
      for (let i = 0; i < 11; i++) { const p = pop(lt, 0.1 + i * 0.12, 0.3); if (p <= 0) continue;
        notes += G(R(-58, -26, 116, 52, { r: 6, f: i % 3 === 0 ? COP : i % 3 === 1 ? CG : '#FFF7E0', fl: 'sh2' }) +
          `<path d="M-36 -4h56M-36 10h36" stroke="${GR}" stroke-width="4" stroke-linecap="round" opacity=".5"/>`, { x: Math.sin(i * 1.9) * 10, y: -i * 50, s: p, r: Math.sin(i * 2.3) * 7 }); }
      s += G(person(500, 640, 1.2) + G(notes, { x: 500, y: 470, r: wob, cx: 0, cy: 60 }), { o: fo });
    }
    if (lt > c) s += hubAt(lt - c, d - c, Array.from({ length: 5 }, (_, i) => [500 + Math.sin(i) * 20, 470 - i * 90]));
    return s;
  };

  S.visibility = (lt, d) => {
    const c = d * 0.48; let s = '';
    const p = P(lt, c, c + 1.2);
    const card = (x, title, ic) => G(R(-140, -150, 280, 300, { r: 24 }) + T(0, -102, title, { size: 30, w: 700, c: FD, f: 'C' }) +
      [0, 1, 2].map((i) => G(icon(ic, 0, 0, 0.55, i === 1 ? CO : GR, 8), { x: (i - 1) * 74, y: 10 + (i % 2) * 20, r: (i - 1) * 8 })).join(''), { x, y: 330, r: Math.sin(lt * 4 + x) * 2 * (1 - p) });
    if (p < 1) s += G(card(L(220, 500, p), 'Invoices', 'doc') + card(L(780, 500, p), 'Expenses', 'receipt'), { o: 1 - P(lt, c + 0.6, c + 1.2) });
    const q = pop(lt, d * 0.22);
    if (lt < c + 0.4) s += G(`<circle r="54" fill="${WH}" filter="url(#sh)"/>` + T(0, 24, '?', { size: 74, w: 700, c: CO, f: 'C' }), { x: 500, y: 330, s: q * (1 - P(lt, c, c + 0.4)) });
    const dp = P(lt, c + 0.6, c + 1.4);
    if (dp > 0) {
      let dash = R(220, 110, 560, 440, { r: 28 }) + T(260, 170, 'Full picture', { size: 32, w: 600, c: FD, f: 'C', a: 'start' });
      [0.45, 0.62, 0.55, 0.78, 0.9].forEach((h, i) => { const bh = 220 * h * P(lt, c + 1.0 + i * 0.12, c + 1.6 + i * 0.12);
        dash += R(290 + i * 82, 470 - bh, 52, bh, { r: 8, f: i === 4 ? SL : MP, fl: '' }); });
      dash += G(R(0, 0, 150, 44, { r: 22, f: CG, fl: '' }) + T(75, 29, 'Invoices', { size: 20, w: 600, c: FD }), { x: 600, y: 140 }) +
        G(R(0, 0, 150, 44, { r: 22, f: COP, fl: '' }) + T(75, 29, 'Expenses', { size: 20, w: 600, c: FD }), { x: 600, y: 192 });
      s += G(dash, { o: dp, s: L(0.92, 1, dp), cx: 500, cy: 330 });
    }
    return s;
  };

  S.imagine = (lt, d) => {
    let s = '';
    const a = d * 0.28, b = d * 0.5;
    const tp = pop(lt, 0.1, 0.5) * (1 - P(lt, a, a + 0.4));
    if (tp > 0) s += G(T(0, 60, 'ERP?', { size: 190, w: 600, c: FD, f: 'C' }), { x: 500, y: 330, s: tp });
    if (lt > a) {
      const items = ISL.slice(0, 4).concat([['chart', 'Reports']]);
      const rp = P(lt, a, b);
      if (lt < b) items.forEach(([n, lab], i) => { const [tx, ty] = ring(5, 500, 330, 235)[i]; s += tile(n, L(500, tx, rp), L(330, ty, rp), 112, { c: FP, label: lab, s: L(0.4, 1, rp) }); });
      else s += hubAt(lt - b + 2.0, d - b + 2.0, ring(5, 500, 330, 235));
    }
    return s;
  };

  S.industries3 = (lt, d) => {
    const c = d * 0.62, seg = c / 3;
    if (lt < c) {
      const i = Math.min(2, Math.floor(lt / seg)), pl = lt - i * seg, o = Math.min(P(pl, 0, 0.2), 1 - P(pl, seg - 0.15, seg));
      if (i === 0) return G(vign.dist(pl + 0.6) + T(700, 340, 'Warehouse', { size: 46, w: 600, c: FD, f: 'C' }), { o });
      if (i === 1) return G(vign.serv(pl + 0.6) + T(700, 340, 'Services', { size: 46, w: 600, c: FD, f: 'C' }), { o });
      UI = { x: 40, y: 20, w: 920, h: 600, img: 0, o, zoom: L(1, 1.04, pl / seg), tag: true };
      return '';
    }
    return hubAt(lt - c, d - c, [[200, 330], [500, 600], [800, 330]], [['box', 'Warehouse'], ['brief', 'Services'], ['building', 'Property']], { rad: 230 });
  };

  S.generic = (lt, d) => {
    const a = d * 0.45, b = d * 0.6;
    return S.template(lt, d, P(lt, a, b), P(lt, b, b + 1.2));
  };


  // --- social batch 1 (organic series, marketing/SOCIAL-AUTOPOST.md)
  const qmark = (x, y, sc) => sc > 0 ? G(`<circle r="46" fill="${WH}" filter="url(#sh)"/>` + T(0, 22, '?', { size: 64, w: 700, c: CO, f: 'C' }), { x, y, s: sc }) : '';
  const okDot = (x, y, sc, r = 16) => sc > 0 ? G(`<circle r="${r}" fill="${SL}"/>` + icon('check', 0, 0, r / 64, WH, 14), { x, y, s: sc }) : '';

  S.sheets = (lt, d) => {
    const c = d * 0.56; let s = '';
    const files = ['Sales.xlsx', 'Stock.xlsx', 'Accounts.xlsx', 'Owner copy.xlsx', 'Final_v2.xlsx'], tot = ['1,240', '1,180', '1,305', '1,262', '1,198'];
    const pos = [[180, 175], [500, 140], [820, 175], [300, 475], [700, 475]];
    const m = P(lt, c, c + 0.9);
    if (m < 1) pos.forEach(([x, y], i) => {
      const p = pop(lt, 0.25 + i * 0.4); if (p <= 0) return;
      const card = R(-125, -110, 250, 220, { r: 22 }) + icon('sheet', 0, -55, 0.5, SM, 7) + T(0, 12, files[i], { size: 23, w: 600, c: GR }) +
        T(0, 76, tot[i], { size: 46, w: 600, c: lt > d * 0.38 ? CO : FD, f: 'C' });
      s += G(card, { x: L(x, 500, m), y: L(y, 330, m), s: p * (1 - m * 0.6), r: (i % 2 ? 5 : -5) * (1 - m) + Math.sin(lt * 4 + i) * 1.5 * (1 - m), o: 1 - m });
    });
    if (lt < c + 0.3) s += qmark(500, 330, pop(lt, d * 0.4) * (1 - P(lt, c, c + 0.3)));
    const o = P(lt, c + 0.5, c + 1.2);
    if (o > 0) {
      let card = R(-280, -250, 560, 500, { r: 30 }) + T(-240, -186, 'One system', { size: 36, w: 600, c: FD, f: 'C', a: 'start' }) +
        T(-240, -146, 'Sold this month', { size: 22, w: 500, c: GR, a: 'start' });
      ['Sales', 'Warehouse', 'Accounts', 'Owner'].forEach((l, i) => {
        const a = c + 1.0 + i * 0.22, rp = P(lt, a, a + 0.35);
        card += G(R(-240, -30, 480, 64, { r: 16, f: i % 2 ? OW : CG, fl: '' }) + icon('person', -205, 2, 0.32, FP, 11) + T(-176, 11, l + ' sees', { size: 26, w: 600, c: FD, a: 'start' }) +
          T(150, 12, '1,240', { size: 30, w: 700, c: FP, a: 'end', f: 'C' }) + okDot(205, 2, pop(lt, a + 0.25)), { y: -70 + i * 82, o: rp });
      });
      s += G(card, { x: 500, y: 345, s: L(0.92, 1, o), o });
    }
    return s;
  };

  S.stock = (lt, d) => {
    const c = d * 0.42, s0 = c + 1.4, step = Math.max(0.6, (d - s0 - 0.6) / 4);
    const sold = cl((lt - s0) / step, 0, 4), soldI = Math.floor(sold + 1e-6);
    const synced = P(lt, c + 0.2, c + 1.0);
    const sysN = lt < c + 0.2 ? 40 : Math.round(L(40, 12, synced)) - (synced >= 1 ? soldI : 0);
    let s = '';
    // the system screen
    s += G(R(-175, -150, 350, 300, { r: 24 }) + R(-175, -150, 350, 60, { r: 24, f: FD, fl: '' }) + R(-175, -114, 350, 24, { r: 0, f: FD, fl: '' }) +
      T(0, -110, 'Stock system', { size: 26, w: 700, c: WH }) + T(0, -30, 'In stock', { size: 26, w: 600, c: GR }) +
      T(0, 72, String(sysN), { size: 120, w: 600, c: lt < c + 0.2 ? CO : FP, f: 'C' }) + okDot(120, -30, synced >= 1 ? pop(lt, c + 1.0) : 0, 20), { x: 230, y: 330, s: pop(lt, 0.1) });
    // the shelf
    let shelf = R(-195, -160, 390, 320, { r: 18, f: CG, fl: '' }) + `<path d="M-195 -40h390M-195 70h390" stroke="${FP}" stroke-width="9" stroke-linecap="round"/>`;
    for (let i = 0; i < 12; i++) {
      const row = Math.floor(i / 6), col = i % 6, go = i >= 8 ? cl(sold - (11 - i), 0, 1) : 0;
      if (go >= 1) continue;
      shelf += G(R(-23, -23, 46, 46, { r: 6, f: i % 3 ? MS : SL, fl: 'sh2' }) + `<path d="M-23 -6h46" stroke="${FP}" stroke-width="3" opacity=".5"/>`,
        { x: -150 + col * 60, y: row ? 44 : -66, o: 1 - go, s: 1 - go * 0.3 });
    }
    shelf += T(0, 128, 'On the shelf', { size: 26, w: 700, c: FD });
    s += G(shelf, { x: 770, y: 330, s: pop(lt, 0.4) });
    // mismatch, then the link
    const ne = pop(lt, 1.0) * (1 - P(lt, c, c + 0.3));
    if (ne > 0) s += G(`<circle r="50" fill="${WH}" filter="url(#sh)"/>` + T(0, 26, '≠', { size: 72, w: 700, c: CO, f: 'C' }), { x: 500, y: 330, s: ne });
    const lk = P(lt, c, c + 0.6);
    if (lk > 0) {
      s += `<line x1="410" y1="330" x2="${L(410, 572, lk)}" y2="330" stroke="${SL}" stroke-width="8" stroke-linecap="round"/>`;
      if (lk >= 1) { const ph = (lt * 0.9) % 1; s += `<circle cx="${L(410, 572, ph)}" cy="330" r="8" fill="${FP}"/>`; }
      s += G(R(-62, -22, 124, 44, { r: 22, f: FD, fl: '' }) + T(0, 8, 'Linked', { size: 22, w: 700, c: WH }), { x: 491, y: 280, s: pop(lt, c + 0.4) });
    }
    if (lt > s0 - 0.3) {
      const k = Math.min(3, Math.floor(Math.max(0, lt - s0 + 0.3) / step)), pl = lt - s0 + 0.3 - k * step;
      s += G(R(-70, -30, 140, 60, { r: 30, f: WH, s: SL, sw: 3 }) + icon('cart', -34, 0, 0.36, FP, 10) + T(18, 9, 'Sale', { size: 24, w: 700, c: FD }),
        { x: 491, y: 450, s: pop(pl, 0, 0.3) * (1 - P(pl, step - 0.2, step)) });
    }
    return s;
  };

  S.next = (lt, d) => {
    const C = [['doc', 'We read it', 'A real person', 'on our team'], ['mail', 'We reply', 'By email, within', 'one working day'], ['plan', 'We plan it', 'Together, in a session']];
    const ap = [d * 0.24, d * 0.47, d * 0.7], xs = [180, 500, 820]; let s = '';
    s += G(R(-150, -36, 300, 72, { r: 36, f: FD, fl: '' }) + icon('check', -108, 0, 0.36, MP, 13) + T(16, 9, 'Answers sent', { size: 26, w: 700, c: WH }),
      { x: 500, y: 70, s: pop(lt, 0.3), o: 1 - P(lt, ap[0] - 0.4, ap[0]) * 0.5 });
    C.forEach(([n, t, ...sub], i) => {
      const p = pop(lt, ap[i], 0.45);
      if (i > 0) { const dp = P(lt, ap[i] - 0.5, ap[i]); if (dp > 0) s += `<path d="M${xs[i - 1] + 140} 360h${L(0, 40, dp)}" stroke="${SL}" stroke-width="7" stroke-linecap="round"/>`; }
      if (p <= 0) return;
      s += G(R(-140, -175, 280, 350, { r: 28 }) + `<circle cy="-72" r="58" fill="${CG}"/>` + icon(n, 0, -72, 0.68, FP, 8) +
        T(0, 34, t, { size: 38, w: 600, c: FD, f: 'C' }) + sub.map((l, j) => T(0, 80 + j * 32, l, { size: 24, w: 500, c: GR })).join('') +
        G(`<circle r="20" fill="${FD}"/>` + T(0, 8, String(i + 1), { size: 22, w: 700, c: WH }), { x: -108, y: -148 }), { x: xs[i], y: 360, s: p, o: cl(p) });
    });
    const tr = P(lt, ap[1] - 0.6, ap[1]);
    if (tr > 0 && tr < 1) s += G(icon('mail', 0, 0, 0.42, FP, 9), { x: L(xs[0], xs[1], tr), y: 360 - Math.sin(tr * Math.PI) * 120 });
    return s;
  };

  S.signs = (lt, d, seg) => {
    const items = [['person', 'Two people, two different numbers'], ['chart', 'Reports take hours'], ['brief', 'Only one person knows how it all works'], ['sheet', 'The same order gets typed twice'], ['coin', 'You can’t easily see who owes you']];
    const lead = seg.voStart - seg.start, txt = seg.text;
    const at = ['One:', 'Two:', 'Three:', 'Four:', 'Five:'].map((k) => lead + (seg.voDur * txt.indexOf(k)) / txt.length);
    const fam = lead + (seg.voDur * txt.indexOf('Sound')) / txt.length;
    let s = '';
    items.forEach(([n, t], i) => {
      const p = P(lt, at[i] - 0.2, at[i] + 0.25), y = 70 + i * 118; if (p <= 0) return;
      const now = lt >= at[i] && (i === 4 ? lt < fam : lt < at[i + 1]);
      s += G(R(70, -48, 860, 96, { r: 22, f: now ? WH : OW, s: now ? SL : 'none', sw: now ? 4 : 0 }) +
        G(`<circle r="28" fill="${now ? FD : CG}"/>` + T(0, 10, String(i + 1), { size: 28, w: 700, c: now ? WH : FD, f: 'C' }), { x: 130 }) +
        icon(n, 205, 0, 0.42, now ? CO : GR, 9) + T(250, 10, t, { size: 30, w: 600, c: FD, a: 'start' }) + okDot(880, 0, lt > fam ? pop(lt, fam + i * 0.12) : 0, 20),
        { x: L(40, 0, p), y, o: p });
    });
    return s;
  };

  S.keyperson = (lt, d) => {
    const c = d * 0.52; let s = '';
    const ppl = [[160, 230], [840, 230], [840, 520], [160, 520], [500, 610]];
    if (lt < c + 0.6) {
      let g = desk(500, 400, 1) + G(R(-66, -24, 132, 48, { r: 24, f: CO, fl: '' }) + T(0, 9, 'Away', { size: 26, w: 700, c: WH }), { x: 500, y: 250, s: pop(lt, 0.3) });
      for (let i = 0; i < 6; i++) { const p = pop(lt, 2.2 + i * 0.35, 0.3); if (p > 0) g += G(R(-50, -22, 100, 44, { r: 6, f: i % 2 ? COP : '#FFF7E0', fl: 'sh2' }), { x: 380 + (i % 3) * 120, y: 380 - Math.floor(i / 3) * 34, s: p, r: (i % 2 ? 7 : -6) }); }
      ppl.forEach(([x, y], i) => {
        const p = pop(lt, 0.6 + i * 0.25); if (p <= 0) return;
        g += person(x, y + 50, 0.75, GR, cl(p));
        const b = pop(lt, 1.0 + i * 0.3); if (b > 0) g += G(R(-34, -30, 68, 56, { r: 16, f: WH }) + T(0, 12, '?', { size: 36, w: 700, c: CO, f: 'C' }), { x: x + (x < 500 ? 56 : -56), y: y - 46, s: b, r: Math.sin(lt * 5 + i) * 4 });
      });
      s += G(g, { o: 1 - P(lt, c, c + 0.6) });
    }
    if (lt > c) s += hubAt(lt - c, d - c, ppl);
    return s;
  };

  // ---------------------------------------------------------------- frame
  let TL = null, UI = null, VB = [0, 0, 1000, 700];
  const $ = (id) => document.getElementById(id);

  function chunks(text) {
    // clause-first packing: break at punctuation, pack clauses up to ~58 chars (two caption lines)
    const clauses = text.replace(/\.\.\./g, '…').match(/[^.,?!:;…]+[.,?!:;…]*/g).map((c) => c.trim()).filter(Boolean);
    const out = []; let cur = '';
    const push = (c) => { if (c.length <= 58) { out.push(c); return; } const w = c.split(' '); const h = Math.ceil(w.length / 2); out.push(w.slice(0, h).join(' ')); out.push(w.slice(h).join(' ')); };
    for (const c of clauses) { if (!cur) cur = c; else if (!/[.?!…]$/.test(cur) && (cur + ' ' + c).length <= 58) cur += ' ' + c; else { push(cur); cur = c; } }
    if (cur) push(cur);
    return out;
  }
  const pick = (arr, f) => { let v = ''; (arr || []).forEach(([ff, t]) => { if (f >= ff) v = t; }); return v; };

  window.setup = (tl) => {
    TL = tl; document.body.className = 'f' + tl.fmt;
    VB = tl.fmt === '169' ? [0, 0, 1000, 700] : [30, 10, 940, 680]; $('stage').setAttribute('viewBox', VB.join(' '));
    TL.segs.forEach((s) => { if (s.text) { s.ch = chunks(s.text); s.chl = s.ch.map((c) => c.length); s.cht = s.chl.reduce((a, b) => a + b, 0); } });
  };

  window.seek = (t) => {
    const seg = TL.segs.find((s) => t >= s.start && t < s.start + s.dur) || TL.segs[TL.segs.length - 1];
    const lt = t - seg.start, d = seg.dur, f = lt / d;
    UI = null;
    const isEnd = seg.scene === 'end';
    const eo = isEnd ? P(lt, 0, 0.6) : 0;
    $('end').style.opacity = eo; $('safe').style.opacity = 1 - eo;
    if (isEnd) {
      $('ehl').innerHTML = (seg.endHl || '').replace(/\n/g, '<br>');
      $('ein').style.transform = `translateY(${L(24, 0, P(lt, 0.1, 0.9))}px)`;
      $('ecta').style.opacity = P(lt, 0.5, 1.1);
    }
    if (!isEnd || eo < 1) {
      $('stage').innerHTML = DEFS + (S[seg.scene] ? S[seg.scene](lt, d, seg) : '');
      const hl = typeof seg.hl === 'string' ? seg.hl : pick(seg.hl, f), sub = typeof seg.sub === 'string' ? seg.sub : pick(seg.sub, f);
      const ho = Math.min(P(lt, 0, 0.45), 1 - P(lt, d - 0.25, d));
      $('hl').innerHTML = (hl || '').replace(/\n/g, '<br>'); $('hl').className = (hl || '').length > 48 ? 'long' : ''; $('sub').textContent = sub || '';
      $('head').style.opacity = ho; $('head').style.transform = `translateY(${L(14, 0, P(lt, 0, 0.45))}px)`;
    }
    // captions follow the voice, chunk by chunk, weighted by length
    let cap = '';
    if (seg.ch && !isEnd) {
      const vt = t - seg.voStart;
      if (vt >= 0 && vt <= seg.voDur + 0.35) { let acc = 0; const x = cl(vt / seg.voDur) * seg.cht;
        for (let i = 0; i < seg.ch.length; i++) { acc += seg.chl[i]; if (x <= acc || i === seg.ch.length - 1) { cap = seg.ch[i]; break; } } }
    }
    $('cap').style.opacity = cap ? 1 : 0; $('capt').textContent = cap;
    // real-UI layer (EstateOS screenshots) mapped from stage coords to pixels
    const ui = $('ui');
    if (UI && UI.o > 0) {
      const r = $('stage').getBoundingClientRect(), k = Math.min(r.width / VB[2], r.height / VB[3]);
      const ox = r.left + (r.width - VB[2] * k) / 2 - VB[0] * k, oy = r.top + (r.height - VB[3] * k) / 2 - VB[1] * k;
      Object.assign(ui.style, { display: 'block', left: ox + UI.x * k + 'px', top: oy + UI.y * k + 'px', width: UI.w * k + 'px', height: UI.h * k + 'px', opacity: UI.o * (1 - eo) });
      ui.querySelectorAll('img').forEach((im, i) => { im.style.opacity = i === UI.img ? 1 : 0; im.style.transform = `scale(${UI.zoom})`; });
      $('uitag').style.display = UI.tag ? 'block' : 'none';
    } else ui.style.display = 'none';
  };
})();
