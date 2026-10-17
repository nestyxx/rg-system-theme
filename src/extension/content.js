// RG System – thème Arobase (version extension).
// Le CSS (fonts.css + theme.css) est injecté par le navigateur AVANT le premier rendu via
// manifest.json ("content_scripts.css") : aucun flash de l'ancien style. Ce script ne fait que :
//  - poser les attributs sur <html> (thème clair/sombre, densité) — le CSS est scopé sous html[data-rgx] ;
//  - ajouter le bouton de bascule clair/sombre dans l'en-tête (à droite des icônes) ;
//  - gérer les raccourcis Alt+Maj+T (thème) et Alt+Maj+D (densité) ;
//  - rendre la largeur de l'arborescence réglable (poignée #dragbar, sans minimum) ;
//  - recharger la liste des tickets quand « Actualisation auto » est activé (le widget d'origine ne le fait pas).
// Réglages dans le localStorage du site (lecture synchrone, donc pas de clignotement) :
//   rgx.enabled ('0' = thème désactivé), rgx.theme ('auto'|'light'|'dark'), rgx.density ('comfortable'|'compact'),
//   rgx.treeWidth (px), rgx.autoReload ('0' = pas de rechargement automatique des tickets).
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
    // Logo du thème (pastille « RG » + nom) dans le bloc du logo d'origine.
    // Tant que ce balisage est absent, le CSS laisse le logo image de RG System.
    function ensureLogo() {
      const host = document.querySelector(SEL.logo);
      if (!host || host.querySelector('.rgx-logo')) return;
      host.innerHTML = '<span class="rgx-logo" role="img" aria-label="RG system suite"><b>RG</b><span class="rgx-logo-name">RG system</span></span>';
    }
    // Page de connexion : même logo que la barre latérale (pastille « RG » + nom), à la place de l'image d'origine.
    function ensureLoginLogo() {
      const host = document.querySelector('.form-public-page #brand-logo');
      if (!host || host.querySelector('.rgx-logo')) return;
      host.innerHTML = '<span class="rgx-logo" role="img" aria-label="RG system suite"><b>RG</b><span class="rgx-logo-name">RG system</span></span>';
    }
    // Avatar du profil : initiales (tirées de l'attribut alt du Gravatar, « Gravatar for prenom.nom@domaine » -> « PN ») sur un disque de marque,
    // au lieu de l'identicône générée. Posé sur le bouton du profil et sur l'en-tête de son menu ; l'image reste dans le DOM.
    function initialsOf(alt) {
      const m = /for\s+([^@\s]+)/i.exec(alt || '');
      if (!m) return '';
      const parts = m[1].split(/[._+-]+/).filter(Boolean);
      const out = parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] || '').slice(0, 2);
      return out.toUpperCase();
    }
    function ensureAvatars() {
      document.querySelectorAll('#profile-menu-toggler, [class*="Profile__MenuHeader"]').forEach((host) => {
        if (host.hasAttribute('data-rgx-initials')) return;
        const img = host.querySelector('img[alt^="Gravatar"]');
        const ini = img && initialsOf(img.getAttribute('alt'));
        if (ini) host.setAttribute('data-rgx-initials', ini);
      });
    }
    // Infobulles : une action en simple icône (sans texte, sans title ni aria-label) reçoit un libellé tiré de son pictogramme,
    // pour que toutes les actions iconiques de la plateforme s'annoncent au survol et au lecteur d'écran de la même façon.
    // Les libellés déjà posés par RG ne sont jamais écrasés.
    const ICON_LABELS = {
      'glyphicon-trash': 'Supprimer', 'glyphicon-remove': 'Supprimer', 'glyphicon-edit': 'Modifier', 'glyphicon-pencil': 'Modifier',
      'glyphicon-plus': 'Ajouter', 'glyphicon-refresh': 'Actualiser', 'glyphicon-search': 'Rechercher', 'glyphicon-filter': 'Filtrer',
      'glyphicon-ok': 'Valider', 'glyphicon-info-sign': 'Informations', 'glyphicon-question-sign': 'Aide', 'glyphicon-share': 'Exporter',
      'glyphicon-download-alt': 'Télécharger', 'glyphicon-thumbs-up': 'Promouvoir', 'glyphicon-off': 'Redémarrer', 'glyphicon-cog': 'Réglages',
      'glyphicon-play': 'Démarrer', 'glyphicon-stop': 'Arrêter', 'glyphicon-calendar': 'Calendrier', 'glyphicon-time': 'Heure',
      'glyphicon-option-vertical': 'Plus d\'actions', 'glyphicon-forward': 'Dernière page', 'glyphicon-backward': 'Première page',
      'glyphicon-chevron-left': 'Précédent', 'glyphicon-chevron-right': 'Suivant', 'glyphicon-retweet': 'Réinitialiser', 'glyphicon-book': 'Documentation',
    };
    // Menu latéral : infobulle « Nom — à quoi sert la section » (indispensable quand le menu est réduit en icônes, utile
    // pour les intitulés peu explicites comme « Pedigree »). Les éléments qui ont déjà un title ne sont pas touchés.
    const MENU_HELP = {
      'rechercher': 'trouver un agent (nom, adresse IP, utilisateur, système…)',
      'vues': 'synthèses et statistiques du nœud',
      'tickets': 'alertes en cours et historique des tickets',
      'pedigree': 'fiche et inventaire des agents du nœud',
      'données': 'graphiques et mesures (processeur, disques, réseau, services…)',
      'réseau': 'voisinage réseau détecté par les agents',
      'actions': 'actions à distance : Assist, commande, Windows Update, scripts…',
      'configuration': 'plugins, alertes, communication, modèles, rapports',
      'backup': 'sauvegardes, restaurations et statistiques',
      'cybersecurity': 'vulnérabilités détectées sur les machines',
      'gestion': 'utilisateurs, quotas, connexion IA, profil',
      'téléchargements': 'agents et kit de déploiement',
    };
    function ensureMenuTitles() {
      document.querySelectorAll('#menu-details li.menu-lvl-0:not([data-rgx-m]) > a').forEach((a) => {
        const name = a.querySelector('.name-menu') || a.querySelector('.menu-line-word');
        if (!name || !name.textContent.trim()) return;
        a.parentElement.setAttribute('data-rgx-m', '');
        if (a.hasAttribute('title')) return;
        const label = name.textContent.trim();
        const help = MENU_HELP[label.toLowerCase()];
        a.setAttribute('title', help ? label + ' — ' + help : label);
      });
    }
    function ensureLabels() {
      ensureMenuTitles();
      document.querySelectorAll('#root button:not([title]):not([aria-label]):not([data-rgx-l]), #root a.btn:not([title]):not([aria-label]):not([data-rgx-l])').forEach((el) => {
        el.setAttribute('data-rgx-l', '');
        if (el.textContent.trim()) return;
        for (const g of el.querySelectorAll('.glyphicon')) {
          const k = [...g.classList].find((c) => ICON_LABELS[c]);
          if (k) { el.setAttribute('title', ICON_LABELS[k]); el.setAttribute('aria-label', ICON_LABELS[k]); return; }
        }
      });
    }
    // Boutons d'icônes de l'en-tête. Les icônes d'origine (fusée, Assist, notes de version, et tout autre bouton ajouté
    // par RG) sont des éléments hétérogènes (div, svg, lien) qu'on ne peut ni aligner ni survoler de façon homogène.
    // On les masque (ils restent dans le DOM, au même endroit) et on affiche à leur place des boutons identiques
    // qui leur transmettent le clic. Tout bouton inconnu est repris automatiquement (icône « message » par défaut).
    const HDR_KNOWN = [
      { sel: '.jimo-widget', icon: 'rocket', title: 'Nouveautés' },
      { sel: '#btnAssistAgentlessTechnician', icon: 'headset', title: 'Assist' },
      { sel: 'a[data-testid="notification-link"]', icon: 'fileText', title: 'Notes de version' },
      { sel: '[data-testid="chat-toggler"]', icon: 'messageSquare', title: 'Messagerie' },
    ];
    const HDR_SKIP = 'button.brain, [class*="BrainButton"], #profile-menu-toggler, [class*="Profile__"], #rgx-theme-toggle, .rgx-hdr';
    function hdrIconFor(el) {
      const t = [el.id, typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '', el.getAttribute('data-testid'), el.getAttribute('aria-label'), el.getAttribute('title')].join(' ').toLowerCase();
      if (/bell|notif|alert/.test(t)) return 'bell';
      if (/help|aide|question/.test(t)) return 'help';
      return 'messageSquare';
    }
    function ensureHeaderButtons() {
      const host = document.querySelector(SEL.headerIcons);
      if (!host) return;
      const sources = [];
      for (const k of HDR_KNOWN) { const el = host.querySelector(':scope > ' + k.sel); if (el) sources.push({ el, icon: k.icon, title: k.title }); }
      for (const el of host.children) {
        if (el.matches(HDR_SKIP) || sources.some((s) => s.el === el)) continue;
        if (!el.hasAttribute('data-rgx-src') && el.offsetWidth === 0 && el.offsetHeight === 0) continue;   // élément vide / invisible
        sources.push({ el, icon: hdrIconFor(el), title: el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('data-testid') || '' });
      }
      let group = host.querySelector(':scope > .rgx-hdr');
      const sig = sources.map((s) => s.icon + ':' + (s.el.id || s.el.className)).join('|');
      if (group && group.getAttribute('data-sig') === sig && sources.every((s) => s.el.hasAttribute('data-rgx-src'))) return;
      if (group) group.remove();
      group = document.createElement('div');
      group.className = 'rgx-hdr';
      group.setAttribute('data-sig', sig);
      for (const s of sources) {
        s.el.setAttribute('data-rgx-src', '');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'rgx-hbtn';
        b.title = s.title;
        if (s.title) b.setAttribute('aria-label', s.title);
        b.innerHTML = '<i class="rgx-i rgx-i-' + s.icon + '"></i>';
        b.addEventListener('click', (ev) => {
          ev.preventDefault();
          if (s.el.tagName === 'A' && s.el.href) { window.open(s.el.href, s.el.target || '_blank', 'noopener'); return; }
          s.el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        });
        group.appendChild(b);
      }
      const anchor = document.getElementById('rgx-theme-toggle') || host.querySelector('#profile-menu-toggler') || null;
      host.insertBefore(group, anchor);
    }
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; ensureHeaderButtons(); ensureToggle(); ensureBurger(); ensureLogo(); ensureLoginLogo(); ensureAvatars(); ensureLabels(); });
    };
    new MutationObserver(schedule).observe(root, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', schedule);

    // ------------------------------------------------------------------------------------------------
    // Largeur de l'arborescence : poignée #dragbar. Le script de RG impose une largeur minimale ; on
    // prend le relais (phase de capture) pour permettre une arborescence beaucoup plus étroite.
    // La largeur choisie est mémorisée (rgx.treeWidth) ; double-clic sur la poignée = largeur d'origine.
    // Le CSS (60-layout / 70-menu-sum) lit la variable --rgx-tree-w UNIQUEMENT si html[data-rgx-tree] est posé.
    // ------------------------------------------------------------------------------------------------
    const TREE = { min: 120, max: 640, key: 'rgx.treeWidth' };
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    function applyTreeWidth(w) {
      if (w) { root.style.setProperty('--rgx-tree-w', w + 'px'); root.setAttribute('data-rgx-tree', ''); }
      else { root.style.removeProperty('--rgx-tree-w'); root.removeAttribute('data-rgx-tree'); }
    }
    const saved = parseInt(get(TREE.key, ''), 10);
    if (saved) applyTreeWidth(clamp(saved, TREE.min, TREE.max));
    document.addEventListener('mousedown', (e) => {
      const bar = e.target && e.target.closest ? e.target.closest('#dragbar') : null;
      if (!bar || e.button !== 0) return;
      e.preventDefault();
      e.stopImmediatePropagation();   // le gestionnaire d'origine de RG ne démarre pas
      const menu = document.querySelector(SEL.sidebar);
      const menuW = menu ? menu.getBoundingClientRect().width : 200;
      const shield = document.createElement('div');   // capte la souris au-dessus des cadres / graphiques pendant le glissement
      shield.style.cssText = 'position:fixed;inset:0;z-index:2147483646;cursor:col-resize';
      document.body.appendChild(shield);
      let last = 0, raf = 0;
      const move = (ev) => {
        last = clamp(Math.round(ev.clientX - menuW + 5), TREE.min, Math.min(TREE.max, window.innerWidth - menuW - 200));
        if (!raf) raf = requestAnimationFrame(() => { raf = 0; applyTreeWidth(last); });
      };
      const up = () => {
        document.removeEventListener('mousemove', move, true);
        document.removeEventListener('mouseup', up, true);
        shield.remove();
        if (last) { set(TREE.key, String(last)); applyTreeWidth(last); }
        window.dispatchEvent(new Event('resize'));   // graphiques et arbre se recalent
      };
      document.addEventListener('mousemove', move, true);
      document.addEventListener('mouseup', up, true);
    }, true);
    document.addEventListener('dblclick', (e) => {
      if (!(e.target && e.target.closest && e.target.closest('#dragbar'))) return;
      try { localStorage.removeItem(TREE.key); } catch (err) { /* stockage indisponible */ }
      applyTreeWidth(0);
      window.dispatchEvent(new Event('resize'));
    }, true);

    // ------------------------------------------------------------------------------------------------
    // Adaptation à la largeur d'écran (le CSS est dans 99-responsive.css). RG est conçu pour le bureau :
    //   < 1200 px : menu réduit en rail d'icônes ; < 1000 px : arborescence masquée (ouvrable en superposition) ;
    //   < 768 px  : menu en tiroir. On passe par les boutons d'origine de RG (menu, arborescence) et on mémorise
    //   l'état choisi par l'utilisateur pour le rétablir quand la fenêtre redevient large.
    // ------------------------------------------------------------------------------------------------
    const mqM = window.matchMedia('(max-width: 767px)');
    const mqT = window.matchMedia('(max-width: 999px)');
    const mqC = window.matchMedia('(max-width: 1199px)');
    const fit = { shrink: null, tree: null };   // état de l'utilisateur avant notre action (null = rien changé)
    const isShrunk = () => { const b = document.getElementById('block-dashboard'); return !!b && b.classList.contains('left-menu-shrink'); };
    const treeHidden = () => { const t = document.getElementById('tree-block'); return !t || t.classList.contains('shrunk-tree'); };
    const clickBurger = () => { const b = document.getElementById('menu-main-burger'); if (b) b.click(); };
    const clickTree = () => {
      const t = document.querySelector('#header [class*="Header__StyledBox"] > svg:first-child');
      if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    };
    function fitLayout() {
      if (!document.getElementById('menu-main-burger') || !document.getElementById('tree-block') || !document.querySelector('#header [class*="Header__StyledBox"] > svg:first-child')) return false;
      if (!mqC.matches) {
        if (fit.shrink !== null) { if (isShrunk() !== fit.shrink) clickBurger(); fit.shrink = null; }
      } else {
        const want = !mqM.matches;   // tablette : rail d'icônes ; mobile : menu complet, dans le tiroir
        if (isShrunk() !== want) { if (fit.shrink === null) fit.shrink = isShrunk(); clickBurger(); }
      }
      if (!mqT.matches) {
        if (fit.tree !== null) { if (treeHidden() !== fit.tree) clickTree(); fit.tree = null; }
      } else if (fit.tree === null) {
        fit.tree = treeHidden();
        if (!treeHidden()) clickTree();
      }
      if (!mqM.matches) root.classList.remove('rgx-m-nav');
      return true;
    }
    [mqM, mqT, mqC].forEach((q) => q.addEventListener('change', () => { fitLayout(); window.dispatchEvent(new Event('resize')); }));
    { let tries = 0; const t = setInterval(() => { if (fitLayout() || ++tries > 60) clearInterval(t); }, 500); }
    const closeDrawers = () => { root.classList.remove('rgx-m-nav'); if (mqT.matches && !treeHidden()) clickTree(); };
    // Bouton « menu » de l'en-tête (visible seulement sous 768 px, voir le CSS)
    function ensureBurger() {
      if (document.getElementById('rgx-m-burger')) return;
      const bar = document.querySelector('#header header .MuiToolbar-root');
      if (!bar) return;
      const b = document.createElement('button');
      b.id = 'rgx-m-burger'; b.type = 'button'; b.title = 'Menu'; b.setAttribute('aria-label', 'Menu');
      b.innerHTML = '<i class="rgx-i rgx-i-menu"></i>';
      b.addEventListener('click', () => { if (!treeHidden()) clickTree(); root.classList.toggle('rgx-m-nav'); });
      bar.insertBefore(b, bar.firstChild);
    }
    document.addEventListener('click', (e) => {
      const t = e.target; if (!t || !t.closest) return;
      if (t === document.getElementById('block-dashboard') && (root.classList.contains('rgx-m-nav') || (mqT.matches && !treeHidden()))) { closeDrawers(); return; }   // clic sur le voile
      if (mqM.matches && t.closest('#menu-details a[href^="#/"]')) setTimeout(() => root.classList.remove('rgx-m-nav'), 120);
      if (mqT.matches && t.closest('#tree-widget a.jstree-anchor')) setTimeout(() => { if (!treeHidden()) clickTree(); }, 250);
    }, true);
    window.addEventListener('hashchange', () => { if (mqT.matches) setTimeout(closeDrawers, 150); });   // on a navigué : on referme les tiroirs

    // ------------------------------------------------------------------------------------------------
    // Liste des tickets : « Actualisation auto ». Le widget d'origine ne rafraîchit pas la liste (il faut un vrai F5).
    // Tant que le bouton est activé, la liste est rafraîchie à la fréquence du widget (data-frequency, 60 s par
    // défaut) quand l'utilisateur est inactif, sans recharger la plateforme. L'état survit (sessionStorage).
    // Désactivable : localStorage rgx.autoReload = '0'.
    // ------------------------------------------------------------------------------------------------
    const AR = { sel: 'button.refresh-widget', key: 'rgx.autoTickets', idleMs: 8000 };
    const ss = {
      get: () => { try { return sessionStorage.getItem(AR.key) === '1'; } catch (e) { return false; } },
      set: (v) => { try { sessionStorage.setItem(AR.key, v ? '1' : '0'); } catch (e) { /* stockage indisponible */ } },
    };
    const onTicketRoute = () => /\/page\/ticket(\/|$|\?)/.test(location.hash);
    const arEnabled = () => get('rgx.autoReload', '1') !== '0';
    let lastInput = Date.now();
    ['mousemove', 'keydown', 'mousedown', 'wheel', 'touchstart'].forEach((t) => document.addEventListener(t, () => { lastInput = Date.now(); }, { passive: true, capture: true }));
    document.addEventListener('click', (e) => {
      const b = e.target && e.target.closest ? e.target.closest(AR.sel) : null;
      if (b && e.isTrusted) { ss.set(!ss.get()); lastRun = Date.now(); }   // le clic de l'utilisateur bascule l'état voulu (et relance le décompte)
    }, true);
    let lastRun = Date.now();
    // Actualisation « douce » : un clic sur l'entrée « Tickets » du menu refait le rendu de la page des tickets
    // (liste, filtres, widget) SANS recharger la plateforme (arborescence, menu, onglets restent en place).
    // Vérifié sur le site réel : les éléments de la page sont remplacés, la page n'est pas rechargée.
    function arTick() {
      if (!arEnabled() || !onTicketRoute()) return;
      const btn = document.querySelector(AR.sel);
      if (!btn) return;
      if (!ss.get()) return;
      if (!btn.classList.contains('active')) {   // nouvelle page (ou rendu refait) : réactive le bouton par le gestionnaire d'origine
        btn.click();
        return;
      }
      const freq = Math.max(15, parseInt(btn.getAttribute('data-frequency'), 10) || 60) * 1000;
      if (Date.now() - lastRun < freq || document.hidden) return;
      if (Date.now() - lastInput < AR.idleMs) return;   // l'utilisateur est en train d'agir : on repousse
      const a = document.activeElement;
      if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
      if (document.querySelector('.modal.in, .modal.show, .bootstrap-datetimepicker-widget, tr.ticket-detail-open-top')) return;   // détail ou fenêtre ouverts : on ne les écrase pas
      const link = document.querySelector('#menu-tickets > a');
      if (!link) return;
      lastRun = Date.now();
      console.info('[RG thème Arobase] actualisation de la liste des tickets');
      link.click();
    }
    setInterval(arTick, 4000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arTick(); });

    // Retour visuel : tant que l'actualisation auto est active, le bouton est teinté, son icône tourne et un compte
    // à rebours (« 42 s ») indique la prochaine actualisation (« … » si elle attend que vous ayez fini d'agir).
    function arPaint() {
      const btn = document.querySelector(AR.sel);
      if (!btn) return;
      const on = arEnabled() && onTicketRoute() && ss.get() && btn.classList.contains('active');
      if (!on) { if (btn.hasAttribute('data-rgx-ar')) { btn.removeAttribute('data-rgx-ar'); btn.removeAttribute('data-rgx-ar-title'); } return; }
      const freq = Math.max(15, parseInt(btn.getAttribute('data-frequency'), 10) || 60) * 1000;
      const left = Math.ceil((lastRun + freq - Date.now()) / 1000);
      btn.setAttribute('data-rgx-ar', left > 0 ? left + ' s' : '…');
      if (!btn.hasAttribute('data-rgx-ar-title')) btn.setAttribute('data-rgx-ar-title', '');
      btn.setAttribute('title', 'Actualisation automatique active : ' + (left > 0 ? 'prochaine dans ' + left + ' s' : 'en attente de votre prochaine pause') + '. Cliquer pour la désactiver.');
    }
    setInterval(arPaint, 1000);

    // ------------------------------------------------------------------------------------------------
    // Réglages en direct depuis le panneau de l'extension (événement DOM « rgx-set » émis par popup.js).
    // ------------------------------------------------------------------------------------------------
    document.addEventListener('rgx-set', (e) => {
      const { key, value } = (e && e.detail) || {};
      if (key === K.theme) { mode = value; apply(); }
      else if (key === K.density) { density = value; apply(); }
      else if (key === 'rgx.treeWidth' && !value) { applyTreeWidth(0); window.dispatchEvent(new Event('resize')); }
      // rgx.autoReload est relu à chaque passage de la minuterie (arEnabled)
    });

    // ------------------------------------------------------------------------------------------------
    // Texte complet au survol : un libellé tronqué par « … » (nom d'hôte, e-mail, intitulé de colonne…) reçoit un
    // title avec son texte entier. Les éléments qui ont déjà une infobulle (title, Bootstrap) ne sont pas touchés.
    // ------------------------------------------------------------------------------------------------
    document.addEventListener('mouseover', (e) => {
      let el = e.target;
      for (let i = 0; el && el !== document.body && el.nodeType === 1 && i < 4; i++, el = el.parentElement) {
        if (el.hasAttribute('title') || el.hasAttribute('data-original-title') || el.hasAttribute('data-rgx-t')) return;
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).textOverflow === 'ellipsis') {
          el.setAttribute('data-rgx-t', '');
          const t = (el.innerText || el.textContent || '').trim();
          if (t) el.setAttribute('title', t);
          return;
        }
      }
    }, { passive: true });

    // ------------------------------------------------------------------------------------------------
    // Recherche rapide (Ctrl+K) : nœuds de l'arborescence déjà chargés + pages du menu. Entrée = y aller.
    // ------------------------------------------------------------------------------------------------
    const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    function paletteItems() {
      const items = [];
      document.querySelectorAll('#menu-details li.menu-lvl-1 > a[href], #menu-details li.menu-lvl-2 > a[href], #menu-details li.menu-lvl-0 > a[href^="#"]').forEach((a) => {
        const label = (a.textContent || '').replace(/\s+/g, ' ').trim();
        if (!label || /^New$/i.test(label)) return;
        const parent = a.closest('li.menu-lvl-0');
        const group = parent && parent.querySelector(':scope > a .name-menu');
        items.push({ kind: 'Page', label, hint: group && group !== a ? group.textContent.trim() : '', run: () => a.click() });
      });
      document.querySelectorAll('#tree a').forEach((a) => {
        const label = (a.textContent || '').replace(/\s+/g, ' ').trim();
        if (!label || label === '_Poubelle') return;
        const path = [];
        for (let li = a.closest('li') && a.closest('li').parentElement.closest('li'); li; li = li.parentElement.closest('li')) {
          const pa = li.querySelector(':scope > a'); if (pa) path.unshift(pa.textContent.replace(/\s+/g, ' ').trim());
        }
        items.push({ kind: 'Nœud', label, hint: path.slice(-2).join(' › '), run: () => a.click() });
      });
      // Agents et nœuds cités dans la page courante (tableaux de synthèse, listes) : trouvables même si leur branche n'est pas ouverte
      const seen = new Set();
      document.querySelectorAll('#root a[href^="#/node/"]').forEach((a) => {
        const href = a.getAttribute('href'); if (seen.has(href)) return;
        const label = (a.textContent || '').replace(/\s+/g, ' ').trim(); if (!label || label.length > 60) return;
        seen.add(href);
        items.push({ kind: 'Agent', label, hint: '', run: () => { location.hash = href; } });
      });
      return items;
    }
    // Recherche RG : ouvre la page « Rechercher » et y reporte le texte saisi (lecture seule : c'est la recherche d'agents de RG)
    function runRgSearch(text) {
      location.hash = '#/node/root/page/search';
      let tries = 0;
      const t = setInterval(() => {
        const inp = document.querySelector('#root input[placeholder*="Rechercher"]');
        if (inp || ++tries > 30) {
          clearInterval(t);
          if (!inp) return;
          const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          set.call(inp, text); inp.dispatchEvent(new Event('input', { bubbles: true }));
          const btn = inp.closest('.input-container, div') && inp.closest('.input-container, div').querySelector('svg[role="button"], button');
          if (btn) btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          inp.focus();
        }
      }, 200);
    }
    let pal = null;
    function closePalette() { if (pal) { pal.remove(); pal = null; } }
    function openPalette() {
      if (pal) { closePalette(); return; }
      const items = paletteItems();
      pal = document.createElement('div');
      pal.id = 'rgx-pal';
      pal.innerHTML = '<div class="rgx-pal-box" role="dialog" aria-label="Recherche rapide"><input type="text" placeholder="Aller à… (nœud, agent, page)" aria-label="Recherche rapide" autocomplete="off"><ul role="listbox"></ul><p class="rgx-pal-help">↑↓ naviguer · Entrée ouvrir · Échap fermer</p></div>';
      document.body.appendChild(pal);
      const input = pal.querySelector('input'); const list = pal.querySelector('ul');
      let shown = []; let sel = 0;
      const paint = () => {
        const q = norm(input.value).split(/\s+/).filter(Boolean);
        shown = items.map((it) => ({ it, s: (() => { const l = norm(it.label); const h = norm(it.hint); if (!q.every((t) => l.includes(t) || h.includes(t))) return -1; return (l.startsWith(q[0] || '') ? 0 : 1) + (q.every((t) => l.includes(t)) ? 0 : 2); })() }))
          .filter((x) => x.s >= 0).sort((a, b) => a.s - b.s).slice(0, 14).map((x) => x.it);
        const raw = input.value.trim();
        if (raw) shown.push({ kind: 'RG', label: 'Rechercher « ' + raw + ' » dans RG System', hint: 'tous les agents', run: () => runRgSearch(raw) });
        sel = Math.min(sel, Math.max(0, shown.length - 1));
        list.textContent = '';
        if (!shown.length) { const li = document.createElement('li'); li.className = 'rgx-pal-empty'; li.textContent = 'Tapez un nom de nœud, d\'agent ou de page.'; list.appendChild(li); return; }
        shown.forEach((it, i) => {
          const li = document.createElement('li'); li.setAttribute('role', 'option'); if (i === sel) li.className = 'on';
          const k = document.createElement('em'); k.textContent = it.kind; const t = document.createElement('span'); t.textContent = it.label;
          li.append(k, t);
          if (it.hint) { const h = document.createElement('small'); h.textContent = it.hint; li.append(h); }
          li.addEventListener('mousedown', (ev) => { ev.preventDefault(); closePalette(); it.run(); });
          list.appendChild(li);
        });
        const on = list.querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
      };
      input.addEventListener('input', () => { sel = 0; paint(); });
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') { ev.preventDefault(); closePalette(); }
        else if (ev.key === 'ArrowDown') { ev.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); paint(); }
        else if (ev.key === 'ArrowUp') { ev.preventDefault(); sel = Math.max(0, sel - 1); paint(); }
        else if (ev.key === 'Enter' && shown[sel]) { ev.preventDefault(); const it = shown[sel]; closePalette(); it.run(); }
      });
      pal.addEventListener('mousedown', (ev) => { if (ev.target === pal) closePalette(); });
      paint(); input.focus();
    }
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    }, true);

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
