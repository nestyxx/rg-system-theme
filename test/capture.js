// Capture d'une page RG System pour le banc de test hors ligne (lecture seule : aucun clic, aucune requête d'écriture).
//
// Utilisation (console du navigateur, connecté à RG System) :
//   1. Facultatif — règles d'anonymisation supplémentaires (noms de personnes, domaines…), au format [regex, remplacement] :
//        localStorage.__rgxAnon = JSON.stringify([['Prénom\\s+NOM', 'UTILISATEUR 1'], ['societe\\.fr', 'example.test']])
//      Les noms de nœuds de l'arborescence (clients) sont TOUJOURS remplacés par « CLIENT 01… » ; le nœud racine devient « MSP DEMO ».
//   2. Coller ce fichier, puis :   const cap = await rgxCapture('#/node/root/page/views/sum/servers');
//   3. Enregistrer `cap` (chaîne JSON) dans un fichier et le convertir :  node test/fixtures-build.mjs <fichier>
//
// Rien de ce qui est capturé ne doit être versionné : test/fixtures/ est dans .gitignore.
async function rgxCapture(route) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  if (route) { location.hash = route; await sleep(1200); }
  // Attendre que la page se stabilise (loader Pace terminé, contenu inchangé)
  const t0 = Date.now(); let stable = 0, last = -1;
  while (Date.now() - t0 < 26000) {
    const busy = document.body.classList.contains('pace-running') || document.querySelector('.pace-active');
    const host = document.querySelector('#content') || document.querySelector('#react_root') || document.body;
    const len = host.innerText.length;
    if (!busy && len > 40 && len === last) { if (++stable >= 3) break; } else stable = 0;
    last = len; await sleep(600);
  }

  // Anonymisation
  const ANON = JSON.parse(localStorage.__rgxAnon || '[]');
  const treeNames = [...new Set([...document.querySelectorAll('#tree a')].map((a) => a.textContent.trim()).filter((n) => n && n !== '_Poubelle'))].sort((a, b) => b.length - a.length);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const map = {}; let i = 0;
  const rootName = (document.querySelector('#tree a') || {}).textContent?.trim(); // le premier lien de l'arbre est la racine
  treeNames.forEach((n) => { map[n] = n === rootName ? 'MSP DEMO' : 'CLIENT ' + String(++i).padStart(2, '0'); });
  const rules = [[treeNames.length ? '(' + treeNames.map(esc).join('|') + ')' : '$^', null], ...ANON];
  const anon = (s) => {
    if (!s) return s;
    for (const [re, rep] of rules) s = s.replace(new RegExp(re, 'gi'), (m) => (rep === null ? map[m] || map[Object.keys(map).find((k) => k.toLowerCase() === m.toLowerCase())] || 'CLIENT' : rep));
    return s;
  };

  // 1) CSS effectif (feuilles externes, <style>, styled-components, JSS), hors styles du thème
  const css = [];
  for (const sh of document.styleSheets) {
    if (/^rgx/.test((sh.ownerNode && sh.ownerNode.id) || '')) continue;
    try { css.push('/* ' + (sh.href || 'inline') + ' */\n' + [...sh.cssRules].map((r) => r.cssText).join('\n')); } catch (e) { css.push('/* illisible : ' + sh.href + ' */'); }
  }
  const cssText = css.join('\n');

  // 2) DOM : copie du <body> sans scripts, textes anonymisés, canvas (courbes) convertis en images
  document.getElementById('rgx-theme-toggle')?.remove();
  const body = document.body.cloneNode(true);
  const orig = [...document.querySelectorAll('canvas')];
  [...body.querySelectorAll('canvas')].forEach((cv, k) => {
    try {
      const o = orig[k]; const img = document.createElement('img');
      img.src = o.toDataURL('image/png'); img.className = cv.className; img.setAttribute('style', cv.getAttribute('style') || '');
      img.style.width = o.style.width || o.clientWidth + 'px'; img.style.height = o.style.height || o.clientHeight + 'px';
      cv.replaceWith(img);
    } catch (e) { /* canvas non exportable */ }
  });
  body.querySelectorAll('script,noscript,iframe,#rgx-theme-toggle,#mimibrain,.jimo-widget iframe').forEach((e) => e.remove());
  const w = document.createTreeWalker(body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) n.nodeValue = anon(n.nodeValue);
  body.querySelectorAll('*').forEach((e) => { for (const a of ['title', 'data-original-title', 'data-name', 'alt', 'placeholder', 'aria-label', 'value']) if (e.hasAttribute(a)) e.setAttribute(a, anon(e.getAttribute(a))); });
  body.querySelectorAll('input,textarea,select').forEach((e) => {
    if (e.tagName === 'INPUT' && e.type !== 'checkbox' && e.type !== 'radio') e.setAttribute('value', anon(e.value));
    if (e.tagName === 'INPUT' && (e.type === 'checkbox' || e.type === 'radio')) e.checked ? e.setAttribute('checked', '') : e.removeAttribute('checked');
    if (e.tagName === 'TEXTAREA') e.textContent = anon(e.value);
  });

  // 3) Ressources : sprites SVG, images, polices référencées par le CSS ou le DOM
  const abs = (u) => { try { return new URL(u, location.href).href; } catch (e) { return null; } };
  const urls = new Set();
  for (const m of cssText.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) if (!/^data:/.test(m[1])) { const a = abs(m[1]); if (a) urls.add(a.split('#')[0]); }
  body.querySelectorAll('use').forEach((u) => { const h = u.getAttribute('href') || u.getAttribute('xlink:href'); if (h) { const a = abs(h); if (a) urls.add(a.split('#')[0]); } });
  body.querySelectorAll('img[src]').forEach((im) => { const a = abs(im.getAttribute('src')); if (a && !/^data:/.test(a)) urls.add(a); });
  const assets = {};
  await Promise.all([...urls].filter((u) => u.startsWith(location.origin)).map(async (u) => {
    try {
      const r = await fetch(u, { credentials: 'same-origin' }); if (!r.ok) return;
      const buf = new Uint8Array(await r.arrayBuffer()); let s = '';
      for (let k = 0; k < buf.length; k += 32768) s += String.fromCharCode.apply(null, buf.subarray(k, k + 32768));
      assets[u] = { ct: r.headers.get('content-type') || '', b64: btoa(s) };
    } catch (e) { /* ressource indisponible */ }
  }));

  return JSON.stringify({ route: location.hash, title: document.title, htmlClass: document.documentElement.className, bodyId: document.body.id, bodyClass: document.body.className, vw: innerWidth, vh: innerHeight, body: body.innerHTML, css: cssText, assets, origin: location.origin });
}
