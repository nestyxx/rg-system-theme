// ==UserScript==
// @name         RG System – thème Arobase
// @namespace    https://arobase.alsace/
// @version      __VERSION__
// @description  Habillage moderne (clair/sombre) de RG System Suite, côté navigateur uniquement.
// @author       Arobase
// @match        https://dashboard.rg-supervision.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

/*
 * Ce fichier est GÉNÉRÉ par `npm run build` (voir build.mjs) à partir de
 * src/userscript.template.js + src/theme.css (Tailwind compilé) + polices locales.
 * Ne pas l'éditer à la main : modifier src/ puis recompiler.
 *
 * Aucun @noframes : le thème s'applique aussi aux iframes de même origine.
 * Les iframes d'authentification Microsoft (login.microsoftonline.com) ne sont
 * pas concernées car hors @match.
 */
(function () {
  'use strict';
  // Toute erreur est journalisée dans la console (F12) au lieu de faire échouer le script en silence.
  try { main(); } catch (e) { console.error('[RG thème Arobase] erreur au démarrage :', e); }

  function main() {
  console.info('[RG thème Arobase] v__VERSION__ démarré sur', location.href);

  // ---------------------------------------------------------------------------
  // 1. SÉLECTEURS RG SYSTEM – à ajuster ici si une mise à jour de RG casse le thème
  // ---------------------------------------------------------------------------
  const SEL = {
    sidebar: '#block-menu-left',   // barre latérale (menu principal)
    header:  '#header',            // barre du haut (React/MUI)
    tree:    '#tree-block',        // arborescence des clients (jsTree)
  };

  // ---------------------------------------------------------------------------
  // 2. RÉGLAGES (persistés par Tampermonkey)
  // ---------------------------------------------------------------------------
  const KEY_ENABLED = 'rgx.enabled';   // true/false : interrupteur général
  const KEY_THEME   = 'rgx.theme';     // 'auto' | 'light' | 'dark'
  const KEY_DENSITY = 'rgx.density';   // 'comfortable' | 'compact'
  const enabled = GM_getValue(KEY_ENABLED, true);
  let   mode    = GM_getValue(KEY_THEME, 'auto');
  let   density = GM_getValue(KEY_DENSITY, 'comfortable');

  const root = document.documentElement;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  // Menu Tampermonkey : toujours disponible, même thème désactivé
  GM_registerMenuCommand(enabled ? '⏻ Désactiver le thème Arobase' : '⏻ Activer le thème Arobase', () => {
    GM_setValue(KEY_ENABLED, !enabled);
    location.reload();
  });
  if (!enabled) return;   // thème désactivé : on ne touche à rien

  GM_registerMenuCommand('◐ Thème : automatique', () => setMode('auto'));
  GM_registerMenuCommand('☀ Thème : clair',       () => setMode('light'));
  GM_registerMenuCommand('☾ Thème : sombre',      () => setMode('dark'));
  GM_registerMenuCommand('↕ Densité : confortable / compacte (Alt+Maj+D)', () => toggleDensity());

  // ---------------------------------------------------------------------------
  // 3. CSS embarqué (Tailwind compilé + polices en data-URI : aucune requête externe)
  // ---------------------------------------------------------------------------
  const CSS_FONTS = /*__CSS_FONTS__*/'';
  const CSS_THEME = /*__CSS_THEME__*/'';
  GM_addStyle(CSS_FONTS + CSS_THEME);

  // ---------------------------------------------------------------------------
  // 4. Application du thème clair / sombre (immédiat, avant le premier rendu)
  // ---------------------------------------------------------------------------
  function effective() {
    return mode === 'auto' ? (mq.matches ? 'dark' : 'light') : mode;
  }
  function apply() {
    root.setAttribute('data-rgx', '');
    root.setAttribute('data-rgx-theme', effective());
    root.setAttribute('data-rgx-density', density);
    updateToggle();
  }
  function setMode(m) {
    mode = m;
    GM_setValue(KEY_THEME, m);
    apply();
  }
  function toggleDensity() {
    density = density === 'compact' ? 'comfortable' : 'compact';
    GM_setValue(KEY_DENSITY, density);
    apply();
  }
  mq.addEventListener('change', () => { if (mode === 'auto') apply(); });
  apply();
  console.info('[RG thème Arobase] thème appliqué :', effective(), '| densité :', density);

  // Filet de sécurité : si la page retire nos attributs de <html>, on les remet.
  new MutationObserver(() => {
    if (!root.hasAttribute('data-rgx') || root.getAttribute('data-rgx-theme') !== effective()) apply();
  }).observe(root, { attributes: true, attributeFilter: ['data-rgx', 'data-rgx-theme', 'data-rgx-density'] });

  // Raccourcis clavier (Alt+Maj+T : thème, Alt+Maj+D : densité) — évitent les combinaisons de RG System
  document.addEventListener('keydown', (e) => {
    if (!e.altKey || !e.shiftKey || e.ctrlKey || e.metaKey) return;
    if (e.code === 'KeyT') { e.preventDefault(); setMode(effective() === 'dark' ? 'light' : 'dark'); }
    if (e.code === 'KeyD') { e.preventDefault(); toggleDensity(); }
  });

  // ---------------------------------------------------------------------------
  // 5. Bouton de bascule (dans la barre latérale, zone non gérée par React)
  // ---------------------------------------------------------------------------
  const ICON_SUN  = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const ICON_MOON = '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function updateToggle() {
    const b = document.getElementById('rgx-theme-toggle');
    if (!b) return;
    const dark = effective() === 'dark';
    b.innerHTML = (dark ? ICON_SUN : ICON_MOON) + '<span>' + (dark ? 'Thème clair' : 'Thème sombre') + '</span>';
    b.title = 'Basculer entre thème clair et sombre (Alt+Maj+T)';
  }
  function ensureToggle() {
    if (document.getElementById('rgx-theme-toggle')) return;
    const host = document.querySelector(SEL.sidebar);
    if (!host) return;
    const b = document.createElement('button');
    b.id = 'rgx-theme-toggle';
    b.type = 'button';
    b.addEventListener('click', () => setMode(effective() === 'dark' ? 'light' : 'dark'));
    host.appendChild(b);
    updateToggle();
  }

  // ---------------------------------------------------------------------------
  // 6. Éléments chargés dynamiquement : un seul observer, très léger
  //    (le bouton est recréé si RG System reconstruit la barre latérale)
  // ---------------------------------------------------------------------------
  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; ensureToggle(); });
  }
  new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', schedule);
  }
})();
