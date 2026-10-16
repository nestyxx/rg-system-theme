# RG System – thème Arobase

Userscript Tampermonkey (Edge) qui habille RG System Suite (`dashboard.rg-supervision.com`)
dans l'esprit de Webgest : Inter / Space Grotesk, palette Arobase, thème clair et sombre.
**Côté navigateur uniquement** : aucun changement de comportement, d'URL ni de données.

## Installation

1. Installer l'extension **Tampermonkey** dans Edge (si ce n'est pas fait).
2. Ouvrir `dist/rg-system-theme.user.js` dans Edge (ou glisser le fichier dans la page Tampermonkey › Utilitaires › Importer), puis **Installer**.
3. Recharger RG System. Le thème s'applique dès `document-start`, sans flash de l'ancien style.

Tampermonkey : activer le « Mode développeur » dans `edge://extensions` si Edge le demande.

## Alternative sans Tampermonkey : extension Edge (recommandée si le userscript ne démarre pas)

Le dossier `dist/extension/` est une extension Manifest V3 minimale qui fait la même chose : le navigateur injecte le CSS lui-même avant le premier rendu (aucun gestionnaire de scripts, aucun flash de l'ancien style).

1. Ouvrir `edge://extensions` et activer le **Mode développeur**.
2. **Charger l'extension décompressée** et choisir le dossier `dist\\extension`.
3. Recharger RG System (Ctrl+F5) : la console (F12) affiche `[RG thème Arobase] extension démarrée…` puis `contrôle visuel : … (thème actif)`.

- **Interrupteur** : un clic sur l'icône de l'extension active/désactive le thème et recharge la page.
- **Clair / sombre** et **densité** : bouton en bas de la barre latérale, `Alt+Maj+T` et `Alt+Maj+D` (réglages mémorisés dans le `localStorage` du site).
- **Mise à jour** : après `npm run build`, cliquer sur le bouton « recharger » de la carte de l'extension dans `edge://extensions`.
- L'extension ne demande que l'accès à `dashboard.rg-supervision.com` (et `scripting`/`activeTab` pour l'interrupteur). Elle ne collecte ni n'envoie aucune donnée.
- **Ne pas installer en même temps** le userscript et l'extension (doublons).

## Utilisation

- **Clair / sombre** : bouton en bas de la barre latérale, ou menu Tampermonkey › *Thème : automatique / clair / sombre*. Le choix est mémorisé. En mode automatique, le thème suit `prefers-color-scheme`.
- **Raccourcis** : `Alt+Maj+T` bascule clair/sombre, `Alt+Maj+D` bascule la densité des tableaux (confortable / compacte, mémorisée). Les deux sont aussi dans le menu Tampermonkey.
- **Désactiver le thème** (en cas de régression après une mise à jour de RG System) : icône Tampermonkey › *⏻ Désactiver le thème Arobase*, la page se recharge avec l'apparence d'origine. Même chemin pour le réactiver. Alternative radicale : désactiver le script dans le tableau de bord Tampermonkey.

## Mise à jour du thème

```bash
npm install        # une seule fois
npm run build      # produit dist/rg-system-theme.user.js
```

Puis ré-importer le fichier dans Tampermonkey (même `@name`/`@namespace` : il remplace la version installée). Incrémenter `version` dans `package.json` avant de recompiler.

Le build :
1. compile `src/theme.css` avec le **Tailwind CLI** (v4) → CSS minifié ;
2. convertit les polices locales (`@fontsource`, sous-ensemble latin) en `@font-face` data-URI ;
3. injecte le tout dans `src/userscript.template.js`.

Aucune ressource externe n'est chargée à l'exécution (ni CDN Tailwind, ni Google Fonts) : compatible avec la CSP de RG System, qui ne contraint que `script-src`.

## Structure

| Fichier | Rôle |
|---|---|
| `src/theme.css` | Tout le CSS (Tailwind 4) : variables clair/sombre, puis une section par composant |
| `src/userscript.template.js` | Logique JS minimale : interrupteur, bascule clair/sombre, bouton, MutationObserver. **Les sélecteurs RG System sont regroupés dans l'objet `SEL` en tête de fichier.** |
| `build.mjs` | Assemblage |
| `dev/serve.mjs` | Petit serveur local de prévisualisation (optionnel) |
| `maquette/direction.html` | Maquette de direction validée |

## Ajouter ou corriger un écran

1. Repérer dans l'inspecteur (F12) des sélecteurs **stables** : ids (`#content`, `#tree-block`), classes Bootstrap 3 (`.table`, `.btn`), classes MUI `Mui*-root`. **Éviter** les classes styled-components (`Header__StyledBox-sc-1heih6i-4 dBYHcP`) : leur hash change à chaque version de RG.
2. Ajouter une règle dans `src/theme.css`, sous `html[data-rgx] …`, en utilisant les variables (`var(--rgx-surface)`, `var(--rgx-border)`…) : le thème sombre suit automatiquement.
3. N'utiliser `!important` que si le CSS d'origine en met déjà (`branding-v3.css` : `.btn-primary`, `.background-color-primary`, `.color-rg`, `.jstree-clicked`, `table th`) ou si le JS de RG pose des styles inline (fonds des `<li>` du menu).
4. Ne pas modifier les dimensions structurantes (largeur du menu, hauteur du header, largeur de l'arbre) : le JS de RG s'en sert pour positionner les éléments.
5. `npm run build`, réimporter, vérifier en clair **et** en sombre.

## État de vérification par écran (v0.6.0, clair + sombre sauf mention)

Vérifié = ouvert dans le navigateur, contrôlé visuellement et par un balayage automatique des fonds clairs / textes sombres restés en thème sombre.

| Écran | État |
|---|---|
| Barre latérale, header, arborescence (+ menu clic droit), barre d'actions Tickets, panneaux Filtres / Créer | vérifié |
| Tickets : liste remplie (filtre « Tous »), lignes paires, boutons d'action | vérifié en clair et en sombre |
| Vues › Synthèse / Serveurs, Pedigree (liste) | vérifié |
| Pedigree : fiche d'un agent (cartes, lignes zébrées, réseau, commentaires) | vérifié en sombre |
| Données › Disque (courbes dygraphs) | vérifié en sombre : cartes de courbes laissées claires (voir ci-dessous) |
| Actions › Système, Services, Windows Update (agent en ligne, lecture seule) | vérifié en sombre |
| Utilisateurs (+ menu ⋮), Gestion › IA, Mon profil | vérifié en sombre |
| Backup › Jobs, Gérer | vérifié |
| Configuration › Plugins, Alertes, Communication, Automatisation, Bibliothèque de scripts, Templates d'événements, Rapports de supervision | vérifié en sombre |
| Réseau › Voisinage, Téléchargements › Kit de déploiement, Cybersecurity › Vulnérabilités | vérifié en sombre |
| Userscript réel (banc `test/harness.html`) : polices embarquées, bascule, raccourcis, densité, interrupteur, recréation du bouton | vérifié avec des substituts Tampermonkey |
| Fenêtres modales Bootstrap (`.modal-*`) | vérifiées sur un gabarit factice, pas sur une vraie modale RG |
| Données (autres courbes : CPU, mémoire, réseau, antivirus…) | non vérifié individuellement (même composant dygraphs que Disque) |
| Actions › Assist, Scripts personnalisés, App Manager, Messages ; Backup › restaurations, Activité, Statistiques, Microsoft 365 ; Configuration › Pools, Hyperviseur, Templates devices/tickets, Rapports personnalisés | non ouverts |
| Installation réelle dans Tampermonkey / Edge | à tester |
| Cybersecurity › Gérer | page promotionnelle de l'éditeur (fond blanc codé en dur), laissée telle quelle |

**Courbes en sombre** : les graphiques sont dessinés en `<canvas>` avec des séries choisies pour un fond blanc. Plutôt que d'altérer les couleurs des données, le thème garde la carte du graphique claire (arrondie, ombrée) dans un écran sombre.

Pour traiter un écran non vérifié : l'ouvrir, F12, repérer les éléments restés blancs/illisibles en sombre, puis suivre « Ajouter ou corriger un écran ».

## Test du userscript sans Tampermonkey

```bash
npm run serve    # sert dist/ et test/ sur http://localhost:4173
```

Ouvrir `http://localhost:4173/harness.html` : la page charge le vrai `dist/rg-system-theme.user.js` avec de faux `GM_*` et un mini-DOM de RG System (`?disabled=1` pour tester l'interrupteur).

## Points d'attention connus

- Les classes `.shrink-menu-transform` de RG animent les fonds (≈ 0,5 s) : le changement clair/sombre est donc légèrement progressif sur la barre latérale.
- Les icônes du menu et de l'arbre sont les sprites SVG d'origine (le statut des nœuds est porté par leur couleur : ne pas les recolorer).
