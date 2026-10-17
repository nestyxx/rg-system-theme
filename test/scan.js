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

// Balayage de mise en page : texte collé au bord d'une carte / d'un contrôle, champs sans marge intérieure.
//   await rgxLayout(['ticket'], 'light')
(function () {
  const path = (e) => { const o = []; for (let x = e; x && x.tagName && o.length < 3; x = x.parentElement) o.push(x.tagName.toLowerCase() + (x.id ? '#' + x.id : '') + (typeof x.className === 'string' && x.className ? '.' + x.className.trim().split(/\s+/)[0].slice(0, 26) : '')); return o.join(' < '); };
  function scanLayout(doc) {
    const win = doc.defaultView; const out = []; const seen = new Set();
    const isCard = (cs, r) => r.width > 150 && r.height > 24 && parseFloat(cs.borderLeftWidth) > 0 && cs.borderLeftStyle !== 'none' && cs.borderLeftColor !== 'rgba(0, 0, 0, 0)';
    const w = doc.createTreeWalker(doc.querySelector('#root') || doc.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      const el = n.parentElement; if (!el || /^(SCRIPT|STYLE|OPTION)$/.test(el.tagName)) continue;
      const rg = doc.createRange(); rg.selectNodeContents(n); const tr = rg.getBoundingClientRect(); if (tr.width < 2) continue;
      for (let c = el; c && c !== doc.body; c = c.parentElement) {
        const cs = win.getComputedStyle(c), r = c.getBoundingClientRect();
        if (c.tagName !== 'TABLE' && !/^(DIV|SECTION|TD|TH|UL|LI|BUTTON|A|SPAN|INPUT|LABEL)$/.test(c.tagName)) continue;
        if (!isCard(cs, r)) continue;
        const dl = tr.left - r.left, dr = r.right - tr.right;
        if ((dl < 6 || dr < 6) && tr.width < r.width - 2) {
          const key = path(c) + (dl < 6 ? ' L' : ' R'); if (!seen.has(key)) { seen.add(key); out.push({ k: 'texte collé au bord ' + Math.round(Math.min(dl, dr)) + 'px', txt: n.nodeValue.trim().slice(0, 24), at: path(c) }); }
        }
        break;
      }
    }
    doc.querySelectorAll('button, .btn, input:not([type=checkbox]):not([type=radio]):not([type=hidden]), select, textarea').forEach((e) => {
      const cs = win.getComputedStyle(e), r = e.getBoundingClientRect(); if (r.width < 20 || r.height < 12 || cs.visibility === 'hidden' || cs.display === 'none') return;
      const hasText = (e.value || e.textContent || '').trim().length > 0;
      if (hasText && parseFloat(cs.paddingLeft) < 6 && cs.borderLeftStyle !== 'none' && parseFloat(cs.borderLeftWidth) > 0) { const key = 'pad ' + path(e); if (!seen.has(key)) { seen.add(key); out.push({ k: 'contrôle sans marge intérieure (' + cs.paddingLeft + ')', txt: (e.value || e.textContent).trim().slice(0, 20), at: path(e) }); } }
    });
    return out.slice(0, 14);
  }
  window.rgxLayout = async function (names, theme) {
    const res = {};
    for (const name of names) {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:0;top:0;width:1440px;height:900px;border:0;visibility:hidden';
      f.src = '/fixtures/' + name + '.html?theme=' + theme; document.body.appendChild(f);
      await new Promise((ok) => { f.onload = ok; setTimeout(ok, 8000); }); await new Promise((ok) => setTimeout(ok, 900));
      try { res[name] = scanLayout(f.contentDocument); } catch (e) { res[name] = [{ k: 'erreur', txt: String(e), at: '' }]; }
      f.remove();
    }
    return res;
  };
})();

// Balayage d'alignement vertical : icône (svg, glyphicon, image ≤ 28 px) vs texte voisin dans le même parent.
//   await rgxAlign(['ticket'], 'light')
(function () {
  const path = (e) => { const o = []; for (let x = e; x && x.tagName && o.length < 3; x = x.parentElement) o.push(x.tagName.toLowerCase() + (x.id ? '#' + x.id : '') + (typeof x.className === 'string' && x.className ? '.' + x.className.trim().split(/\s+/)[0].slice(0, 26) : '')); return o.join(' < '); };
  function scanAlign(doc) {
    const win = doc.defaultView; const out = []; const seen = new Set();
    doc.querySelectorAll('svg, .glyphicon, i.rgx-i, img, ins.jstree-icon, .caret-menu').forEach((ic) => {
      if (ic.closest('#tree, .jstree')) return;
      const r = ic.getBoundingClientRect(); if (r.width < 6 || r.width > 40 || r.height < 6 || r.height > 40) return;
      const cs = win.getComputedStyle(ic); if (cs.visibility === 'hidden' || cs.display === 'none') return;
      const p = ic.parentElement; if (!p) return;
      let txt = null; for (const n of p.childNodes) { if (n.nodeType === 3 && n.nodeValue.trim()) { txt = n; break; } if (n.nodeType === 1 && n !== ic && !n.querySelector('svg,img') && n.textContent.trim() && n.getBoundingClientRect().height < 40) { txt = n; break; } }
      if (!txt) return;
      const rg = doc.createRange(); rg.selectNodeContents(txt); const tr = rg.getBoundingClientRect(); if (tr.height < 4) return;
      const d = (r.top + r.height / 2) - (tr.top + tr.height / 2);
      if (Math.abs(d) > 3.5) { const key = path(p) + (d > 0 ? ' bas' : ' haut'); if (!seen.has(key)) { seen.add(key); out.push({ k: 'icône ' + (d > 0 ? 'plus bas' : 'plus haut') + ' de ' + Math.abs(Math.round(d)) + 'px', txt: (txt.textContent || '').trim().slice(0, 22), at: path(p) }); } }
    });
    return out.slice(0, 14);
  }
  window.rgxAlign = async function (names, theme) {
    const res = {};
    for (const name of names) {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:0;top:0;width:1440px;height:900px;border:0;visibility:hidden';
      f.src = '/fixtures/' + name + '.html?theme=' + theme; document.body.appendChild(f);
      await new Promise((ok) => { f.onload = ok; setTimeout(ok, 8000); }); await new Promise((ok) => setTimeout(ok, 900));
      try { res[name] = scanAlign(f.contentDocument); } catch (e) { res[name] = [{ k: 'erreur', txt: String(e), at: '' }]; }
      f.remove();
    }
    return res;
  };
})();

// Balayage de débordements : (1) texte qui dépasse de la carte / du panneau qui le contient,
// (2) textes qui se chevauchent, (3) boutons dont le libellé est rogné.
//   await rgxOverflow(['ticket'], 'light')
(function () {
  const path = (e) => { const o = []; for (let x = e; x && x.tagName && o.length < 3; x = x.parentElement) o.push(x.tagName.toLowerCase() + (x.id ? '#' + x.id : '') + (typeof x.className === 'string' && x.className ? '.' + x.className.trim().split(/\s+/)[0].slice(0, 26) : '')); return o.join(' < '); };
  function scanOverflow(doc) {
    const win = doc.defaultView; const out = []; const seen = new Set();
    const root = doc.querySelector('#root') || doc.body;
    const rects = [];
    const w = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      const t = n.nodeValue.trim(); if (!t) continue; const el = n.parentElement;
      if (!el || /^(SCRIPT|STYLE|OPTION|TEXTAREA)$/.test(el.tagName)) continue;
      const cs = win.getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const rg = doc.createRange(); rg.selectNodeContents(n); const r = rg.getBoundingClientRect(); if (r.width < 3 || r.height < 3) continue;
      // (1) débord d'un conteneur « carte » (bordure + rayon) sans défilement
      for (let c = el.parentElement; c && c !== doc.body; c = c.parentElement) {
        const cc = win.getComputedStyle(c);
        if (/(auto|scroll|hidden|clip)/.test(cc.overflowX)) break;
        const cr = c.getBoundingClientRect();
        if (cr.width > 120 && parseFloat(cc.borderLeftWidth) > 0 && cc.borderLeftStyle !== 'none' && parseFloat(cc.borderTopLeftRadius) > 0) {
          if (r.right > cr.right + 2 && r.left < cr.right) { const key = 'ov ' + path(c); if (!seen.has(key)) { seen.add(key); out.push({ k: 'texte qui déborde de sa carte (' + Math.round(r.right - cr.right) + 'px)', txt: t.slice(0, 24), at: path(c) }); } }
          break;
        }
      }
      rects.push({ r, t, el });
    }
    // (2) chevauchements entre textes d'éléments différents
    for (let i = 0; i < rects.length && out.length < 14; i++) {
      for (let j = i + 1; j < Math.min(rects.length, i + 12); j++) {
        const a = rects[i], b = rects[j]; if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (ix > 4 && iy > 5) { const key = 'ol ' + path(a.el) + path(b.el); if (!seen.has(key)) { seen.add(key); out.push({ k: 'textes qui se chevauchent (' + Math.round(ix) + 'x' + Math.round(iy) + ')', txt: a.t.slice(0, 14) + ' / ' + b.t.slice(0, 14), at: path(a.el) }); } }
      }
    }
    // (3) libellés rognés dans les boutons
    doc.querySelectorAll('button, .btn').forEach((b) => { if (b.scrollWidth > b.clientWidth + 2 && b.clientWidth > 0 && (b.textContent || '').trim()) { const key = 'bt ' + path(b); if (!seen.has(key)) { seen.add(key); out.push({ k: 'bouton rogné', txt: b.textContent.trim().slice(0, 20), at: path(b) }); } } });
    return out.slice(0, 14);
  }
  window.rgxOverflow = async function (names, theme) {
    const res = {};
    for (const name of names) {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:0;top:0;width:1440px;height:900px;border:0;visibility:hidden';
      f.src = '/fixtures/' + name + '.html?theme=' + theme; document.body.appendChild(f);
      await new Promise((ok) => { f.onload = ok; setTimeout(ok, 8000); }); await new Promise((ok) => setTimeout(ok, 900));
      try { res[name] = scanOverflow(f.contentDocument); } catch (e) { res[name] = [{ k: 'erreur', txt: String(e), at: '' }]; }
      f.remove();
    }
    return res;
  };
})();
