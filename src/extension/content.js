// RG System – thème Arobase (version extension).
// Le CSS (fonts.css + theme.css) est injecté par le navigateur AVANT le premier rendu via
// manifest.json ("content_scripts.css") : aucun flash de l'ancien style. Ce script ne fait que :
//  - poser les attributs sur <html> (thème clair/sombre, densité) — le CSS est scopé sous html[data-rgx] ;
//  - ajouter le bouton de bascule dans la barre latérale ;
//  - gérer les raccourcis Alt+Maj+T (thème) et Alt+Maj+D (densité).
// Réglages dans le localStorage du site (lecture synchrone, donc pas de clignotement) :
//   rgx.enabled ('0' = thème désactivé), rgx.theme ('auto'|'light'|'dark'), rgx.density ('comfortable'|'compact').
(function () {
  'use strict';
  try { main(); } catch (e) { console.error('[RG thème Arobase] erreur au démarrage :', e); }

  function main() {
    const SEL = { sidebar: '#block-menu-left' };          // à ajuster si RG change sa structure
    const K = { enabled: 'rgx.enabled', theme: 'rgx.theme', density: 'rgx.density' };
    const get = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
    const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } };

    const root = document.documentElement;
    console.info('[RG thème Arobase] extension démarrée sur', location.href);
    if (get(K.enabled, '1') === '0') {
      console.info('[RG thème Arobase] thème désactivé (clic sur l\'icône de l\'extension pour le réactiver)');
      return;
    }

    let mode = get(K.theme, 'auto');
    let density = get(K.density, 'comfortable');
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const effective = () => (mode === 'auto' ? (mq.matches ? 'dark' : 'light') : mode);

    function apply() {
      root.setAttribute('data-rgx', '');
      root.setAttribute('data-rgx-theme', effective());
      root.setAttribute('data-rgx-density', density);
      updateToggle();
    }
    function setMode(m) { mode = m; set(K.theme, m); apply(); }
    function toggleDensity() { density = density === 'compact' ? 'comfortable' : 'compact'; set(K.density, density); apply(); }

    mq.addEventListener('change', () => { if (mode === 'auto') apply(); });
    apply();
    console.info('[RG thème Arobase] thème appliqué :', effective(), '| densité :', density);

    // Filet de sécurité : si la page retire nos attributs, on les remet.
    new MutationObserver(() => {
      if (!root.hasAttribute('data-rgx') || root.getAttribute('data-rgx-theme') !== effective()) apply();
    }).observe(root, { attributes: true, attributeFilter: ['data-rgx', 'data-rgx-theme', 'data-rgx-density'] });

    document.addEventListener('keydown', (e) => {
      if (!e.altKey || !e.shiftKey || e.ctrlKey || e.metaKey) return;
      if (e.code === 'KeyT') { e.preventDefault(); setMode(effective() === 'dark' ? 'light' : 'dark'); }
      if (e.code === 'KeyD') { e.preventDefault(); toggleDensity(); }
    });

    // Bouton de bascule (zone de la barre latérale non gérée par React)
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
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; ensureToggle(); });
    };
    new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', schedule);

    window.addEventListener('load', () => {
      const side = document.querySelector(SEL.sidebar);
      if (side) {
        const bg = getComputedStyle(side).backgroundColor;
        const ok = bg === 'rgb(22, 35, 63)' || bg === 'rgb(10, 16, 29)';
        console.info('[RG thème Arobase] contrôle visuel : fond de la barre latérale =', bg, ok ? '(thème actif)' : '(THÈME NON APPLIQUÉ : écrasé par la page ?)');
      }
    });
  }
})();
