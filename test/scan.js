// Balayage automatique d'une fixture (à coller dans la console du banc de test) :
//   await rgxScan(['ticket','jobs'], 'dark')  ->  anomalies par page
// Détecte : texte à contraste < 3:1 sur son fond effectif, et grandes surfaces claires en thème sombre.
(function () {
  const lum = (c) => {
    const m = c.match(/[\d.]+/g);
    if (!m) return null;
    const [r, g, b, a] = m.map(Number);
    if (a === 0) return null;
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return { L: 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b), a: a === undefined ? 1 : a };
  };
  const bgOf = (el) => {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = e.ownerDocument.defaultView.getComputedStyle(e);
      if (cs.backgroundImage !== 'none' && !/^url\(.*(png|svg|gif|jpg)/.test(cs.backgroundImage) ) return { L: 0.5, img: true };
      const l = lum(cs.backgroundColor);
      if (l && l.a > 0.5) return l;
    }
    return { L: 1 };
  };
  const path = (e) => { const o = []; for (let x = e; x && x.tagName && o.length < 4; x = x.parentElement) o.push(x.tagName.toLowerCase() + (x.id ? '#' + x.id : '') + (typeof x.className === 'string' && x.className ? '.' + x.className.trim().split(/\s+/)[0].slice(0, 28) : '')); return o.join(' < '); };

  function scanDoc(doc, theme) {
    const win = doc.defaultView;
    const out = [];
    const seen = new Set();
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const t = n.nodeValue.trim();
      if (!t) continue;
      const el = n.parentElement;
      if (!el || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const cs = win.getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const fg = lum(cs.color); const bg = bgOf(el);
      if (!fg || bg.img) continue;
      const hi = Math.max(fg.L, bg.L); const lo = Math.min(fg.L, bg.L);
      const cr = (hi + 0.05) / (lo + 0.05);
      if (cr < 3) {
        const key = path(el);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ k: 'contraste ' + cr.toFixed(1), txt: t.slice(0, 30), at: key });
      }
    }
    if (theme === 'dark') {
      doc.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width * r.height < 3000) return;
        if (/^(CANVAS|IMG|SVG|svg|VIDEO|IFRAME)$/.test(el.tagName)) return;
        const cs = win.getComputedStyle(el);
        const l = lum(cs.backgroundColor);
        if (l && l.a > 0.5 && l.L > 0.6) {
          const key = path(el);
          if (!seen.has(key)) { seen.add(key); out.push({ k: 'fond clair (' + Math.round(r.width) + 'x' + Math.round(r.height) + ')', txt: '', at: key }); }
        }
      });
    }
    return out.slice(0, 12);
  }

  window.rgxScan = async function (names, theme) {
    const res = {};
    for (const name of names) {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:0;top:0;width:1440px;height:900px;border:0;visibility:hidden';
      f.src = '/fixtures/' + name + '.html?theme=' + theme;
      document.body.appendChild(f);
      await new Promise((ok) => { f.onload = ok; setTimeout(ok, 8000); });
      await new Promise((ok) => setTimeout(ok, 900));
      try { res[name] = scanDoc(f.contentDocument, theme); } catch (e) { res[name] = [{ k: 'erreur', txt: String(e), at: '' }]; }
      f.remove();
    }
    return res;
  };
})();
