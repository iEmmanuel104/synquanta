// In-page helpers shared by prep.js and dom-counts.js. Injected first; exposes window.__d2f.
// Plain browser JS — no modules, no bundler.
(function () {
  if (window.__d2f) return;
  var HOST = '.sc-host-x';
  var FRAME_MIN = 280; // px — anything smaller than this in both axes is a control, not a screen

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function frame() { return new Promise(function (r) { requestAnimationFrame(function () { r(); }); }); }

  function hosts() { return Array.prototype.slice.call(document.querySelectorAll(HOST)); }
  // A lazy host is "empty" until the screen component mounts (placeholder = 1 div).
  function isEmptyHost(h) { return h.querySelectorAll('*').length < 5; }
  function emptyHosts() { return hosts().filter(isEmptyHost); }

  // Hosts are display:contents, so measure/scroll their first child (or the parent) instead.
  function boxTarget(el) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
    return el.firstElementChild || el.parentElement;
  }
  function rectOf(el) {
    var t = boxTarget(el);
    return t ? t.getBoundingClientRect() : { width: 0, height: 0 };
  }

  function text(el) { return (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim(); }

  function isMonospace(el) {
    var ff = getComputedStyle(el).fontFamily || '';
    return /monospace|menlo|courier|consolas/i.test(ff);
  }

  // ---- sections -------------------------------------------------------------
  function discoverSections() {
    var root = document.querySelector('#dc-root') || document.body;
    var cands = Array.prototype.slice.call(root.querySelectorAll('section[id], [id^="flow-"], [id^="section"]'));
    cands = cands.filter(function (el) { return !cands.some(function (o) { return o !== el && o.contains(el); }); });
    if (!cands.length) {
      // No semantic sections: take the element children of the deepest common ancestor of all screen hosts.
      var hs = hosts();
      var anc = hs[0] ? hs[0].parentElement : null;
      while (anc && !hs.every(function (h) { return anc.contains(h); })) anc = anc.parentElement;
      cands = anc ? Array.prototype.slice.call(anc.children).filter(function (c) { return c.querySelector(HOST); }) : [];
    }
    return cands.map(function (el, i) {
      if (!el.id) el.id = 'd2f-section-' + (i + 1);
      el.setAttribute('data-d2f-section', el.id);
      var label = el.getAttribute('data-screen-label') || el.getAttribute('aria-label') || headingText(el) || el.id;
      var hs = Array.prototype.slice.call(el.querySelectorAll(HOST));
      var r = el.getBoundingClientRect();
      return {
        id: el.id,
        label: label,
        selector: '#' + (window.CSS && CSS.escape ? CSS.escape(el.id) : el.id),
        hosts: hs.length,
        emptyHosts: hs.filter(isEmptyHost).length,
        screens: discoverScreens(el).length,
        width: Math.round(r.width),
        height: Math.round(r.height)
      };
    });
  }

  function headingText(el) {
    var h = el.querySelector('h1,h2,h3,header,[role="heading"]');
    var t = h ? text(h) : '';
    return t ? t.slice(0, 80) : '';
  }

  // ---- screens --------------------------------------------------------------
  // A "screen" is an outermost clipped box of at least FRAME_MIN×FRAME_MIN inside the section
  // (the 402×874 phone frames, the web console panels) or a lazy screen host.
  function isFrame(el) {
    if (el.matches(HOST)) return true;
    var r = el.getBoundingClientRect();
    if (r.width < FRAME_MIN || r.height < FRAME_MIN) return false;
    var cs = getComputedStyle(el);
    return cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.overflowY === 'hidden';
  }
  function discoverScreens(section) {
    var all = Array.prototype.slice.call(section.querySelectorAll('*'));
    var c = all.filter(isFrame);
    c = c.filter(function (el) { return !c.some(function (o) { return o !== el && o.contains(el); }); });
    if (!c.length) {
      // Sections without clipped frames (e.g. web panels): direct grandchildren that are big enough.
      c = all.filter(function (el) {
        var r = el.getBoundingClientRect();
        return el.parentElement && el.parentElement.parentElement === section && r.width >= FRAME_MIN && r.height >= FRAME_MIN;
      });
    }
    return c.map(function (el, i) {
      var r = rectOf(el);
      return { index: i, id: el.id || null, label: labelFor(el, section), width: Math.round(r.width), height: Math.round(r.height), el: el };
    });
  }

  // The badge/title row that precedes a frame ("G-240 · Welcome carousel", "FIGMA · Sign in").
  // Prefer a preceding sibling that carries a monospace badge; else the first preceding text.
  function labelFor(el, section) {
    var cur = el, firstText = '';
    while (cur && cur !== section) {
      var prev = cur.previousElementSibling;
      while (prev) {
        if (!isFrame(prev) && !prev.querySelector(HOST)) {
          var t = text(prev);
          if (t) {
            var badge = Array.prototype.slice.call(prev.querySelectorAll('span,code')).concat([prev]).some(isMonospace);
            if (badge) return t.slice(0, 80);
            if (!firstText) firstText = t.slice(0, 80);
          }
        }
        prev = prev.previousElementSibling;
      }
      cur = cur.parentElement;
    }
    return firstText || el.id || '';
  }

  // ---- counts ---------------------------------------------------------------
  // texts   = elements that own at least one non-empty text node (≈ Figma TEXT nodes)
  // images  = <img> with a src, elements with a background-image url(), <canvas>, <video>
  // svgs    = <svg> roots; vectors = shape elements inside svgs (≈ Figma VECTOR nodes, modulo flattening)
  var SHAPES = { path: 1, circle: 1, rect: 1, ellipse: 1, polygon: 1, polyline: 1, line: 1 };
  function countNode(root) {
    var c = { texts: 0, images: 0, svgs: 0, vectors: 0, elements: 0 };
    walk(root, c, false);
    return c;
  }
  function walk(el, c, inSvg) {
    if (el.nodeType !== 1) return;
    var tag = el.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'template' || tag === 'noscript') return;
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    c.elements++;
    if (inSvg) {
      if (SHAPES[tag]) c.vectors++;
    } else {
      if (tag === 'svg') { c.svgs++; inSvg = true; }
      else if (tag === 'img') { if (el.getAttribute('src')) c.images++; }
      else if (tag === 'canvas' || tag === 'video') c.images++;
      else if (cs.backgroundImage && cs.backgroundImage.indexOf('url(') !== -1) c.images++;
      if (tag !== 'svg') {
        var own = false;
        for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.textContent.trim()) { own = true; break; }
        if (own) c.texts++;
        else if ((tag === 'input' || tag === 'textarea') && (el.value || el.placeholder)) c.texts++;
      }
    }
    for (var k = el.firstElementChild; k; k = k.nextElementSibling) walk(k, c, inSvg);
  }

  window.__d2f = {
    HOST: HOST, sleep: sleep, frame: frame, hosts: hosts, emptyHosts: emptyHosts, isEmptyHost: isEmptyHost,
    boxTarget: boxTarget, discoverSections: discoverSections, discoverScreens: discoverScreens, countNode: countNode
  };
})();
