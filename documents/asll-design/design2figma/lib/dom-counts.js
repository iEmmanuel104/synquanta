// In-page: per-section and per-screen DOM counts → window.__sqExpected.
// Requires lib/inpage.js. Run after prep.js (all hosts mounted) or the counts are meaningless.
(function () {
  var d = window.__d2f;
  var sections = d.discoverSections().map(function (s) {
    var el = document.getElementById(s.id);
    var screens = d.discoverScreens(el).map(function (sc) {
      var c = d.countNode(sc.el);
      return { index: sc.index, id: sc.id, label: sc.label, width: sc.width, height: sc.height,
               texts: c.texts, images: c.images, svgs: c.svgs, vectors: c.vectors, elements: c.elements };
    });
    var tot = d.countNode(el);
    return { id: s.id, label: s.label, selector: s.selector, hosts: s.hosts, emptyHosts: s.emptyHosts,
             width: s.width, height: s.height,
             texts: tot.texts, images: tot.images, svgs: tot.svgs, vectors: tot.vectors, elements: tot.elements,
             screens: screens };
  });
  var totals = sections.reduce(function (a, s) {
    a.sections++; a.screens += s.screens.length; a.texts += s.texts; a.images += s.images; a.svgs += s.svgs; a.vectors += s.vectors; a.elements += s.elements; return a;
  }, { sections: 0, screens: 0, texts: 0, images: 0, svgs: 0, vectors: 0, elements: 0 });
  window.__sqExpected = { sections: sections, totals: totals };
})();
