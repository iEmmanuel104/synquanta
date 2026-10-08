// In-page prep: wait for the board's lazy screen hosts to appear and mount, wait for images,
// discover sections, then expose window.__sqReady = { hosts, empty, sections, passes, ms }.
// Requires lib/inpage.js to be injected first. Configure via window.__d2fPrepOpts.
(async function () {
  var d = window.__d2f;
  var opts = Object.assign({ stableMs: 2000, maxWaitMs: 120000, zeroGiveUpMs: 30000, passes: 6, imageTimeoutMs: 30000 }, window.__d2fPrepOpts || {});
  var t0 = Date.now();
  window.__sqReady = null;
  window.__sqProgress = { phase: 'waiting-hosts', hosts: 0, empty: 0, pass: 0 };

  // 1. wait for the runtime root, then until the host count has been STABLE for stableMs.
  //    (No hardcoded count: the number of screens changes with every export.)
  while (!document.querySelector('#dc-root') && Date.now() - t0 < opts.maxWaitMs) await d.sleep(100);
  var last = -1, stableSince = Date.now();
  for (;;) {
    var n = d.hosts().length;
    if (n !== last) { last = n; stableSince = Date.now(); window.__sqProgress.hosts = n; }
    else if (n > 0 && Date.now() - stableSince >= opts.stableMs) break;
    if (Date.now() - t0 > opts.maxWaitMs) break;
    if (n === 0 && Date.now() - t0 > opts.zeroGiveUpMs) break;
    await d.sleep(200);
  }

  // 2. scroll every empty host into view so its IntersectionObserver fires and the screen mounts.
  var pass = 0;
  for (; pass < opts.passes && d.emptyHosts().length; pass++) {
    window.__sqProgress.phase = 'mounting'; window.__sqProgress.pass = pass + 1;
    var todo = d.emptyHosts();
    for (var i = 0; i < todo.length; i++) {
      var t = d.boxTarget(todo[i]);
      if (t) t.scrollIntoView({ block: 'center', inline: 'center' });
      await d.frame();
      await d.sleep(pass ? 250 : 60);
      window.__sqProgress.empty = d.emptyHosts().length;
    }
    await d.sleep(1000);
  }

  // 3. images + fonts
  window.__sqProgress.phase = 'images';
  var pending = Array.prototype.slice.call(document.images).filter(function (i) { return !i.complete; });
  await Promise.race([
    Promise.all(pending.map(function (i) { return new Promise(function (r) { i.onload = i.onerror = r; }); })),
    d.sleep(opts.imageTimeoutMs)
  ]);
  try { await Promise.race([document.fonts.ready, d.sleep(5000)]); } catch (e) {}

  // 4. sections
  window.__sqProgress.phase = 'sections';
  var sections = d.discoverSections();
  window.scrollTo(0, 0);
  var empty = d.emptyHosts().length;
  window.__sqProgress.phase = 'ready';
  window.__sqReady = {
    hosts: d.hosts().length,
    empty: empty,
    unloadedImages: Array.prototype.slice.call(document.images).filter(function (i) { return !i.complete || i.naturalWidth === 0; }).length,
    sections: sections,
    passes: pass,
    ms: Date.now() - t0
  };
})();
