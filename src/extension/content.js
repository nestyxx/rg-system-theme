// RG System – thème Arobase (version extension).
// Le CSS (fonts.css + theme.css) est injecté par le navigateur AVANT le premier rendu via
// manifest.json ("content_scripts.css") : aucun flash de l'ancien style. Ce script ne fait que :
//  - poser les attributs sur <html> (thème clair/sombre, densité) — le CSS est scopé sous html[data-rgx] ;
//  - ajouter le bouton de bascule clair/sombre dans l'en-tête (à droite des icônes) ;
//  - gérer les raccourcis Alt+Maj+T (thème) et Alt+Maj+D (densité).
// Réglages dans le localStorage du site (lecture synchrone, donc pas de clignotement) :
//   rgx.enabled ('0' = thème désactivé), rgx.theme ('auto'|'light'|'dark'), rgx.density ('comfortable'|'compact').
(function () {
  'use strict';
  try { main(); } catch (e) { console.error('[RG thème Arobase] erreur au démarrage :', e); }

  function main() {
    const SEL = { sidebar: '#block-menu-left', headerIcons: '#header .icons', logo: '#brand-logo-menu' };   // à ajuster si RG change sa structure
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

    // Bouton de bascule dans l'en-tête. L'en-tête est rendu par React : l'observer ci-dessous
    // remet le bouton s'il disparaît lors d'un nouveau rendu.
    function updateToggle() {
      const b = document.getElementById('rgx-theme-toggle');
      if (!b) return;
      const dark = effective() === 'dark';
      b.innerHTML = '<i class="rgx-i rgx-i-' + (dark ? 'sun' : 'moon') + '"></i>';
      b.title = (dark ? 'Passer en thème clair' : 'Passer en thème sombre') + ' (Alt+Maj+T)';
    }
    function ensureToggle() {
      if (document.getElementById('rgx-theme-toggle')) return;
      const host = document.querySelector(SEL.headerIcons);
      if (!host) return;
      const b = document.createElement('button');
      b.id = 'rgx-theme-toggle';
      b.type = 'button';
      b.addEventListener('click', () => setMode(effective() === 'dark' ? 'light' : 'dark'));
      host.insertBefore(b, host.lastElementChild);   // avant l'avatar du profil
      updateToggle();
    }
    // Logo du thème (pastille « RG » + nom + étiquette « suite ») dans le bloc du logo d'origine.
    // Tant que ce balisage est absent, le CSS laisse le logo image de RG System.
    function ensureLogo() {
      const host = document.querySelector(SEL.logo);
      if (!host || host.querySelector('.rgx-logo')) return;
      host.innerHTML = '<span class="rgx-logo" role="img" aria-label="RG system suite"><b>RG</b><span class="rgx-logo-name">RG system</span><small>suite</small></span>';
    }
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; ensureToggle(); ensureLogo(); });
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
