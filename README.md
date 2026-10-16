# RG System – thème Arobase

Extension Edge (Chromium) qui habille RG System Suite (`dashboard.rg-supervision.com`)
dans l'esprit de Webgest : Inter / Space Grotesk, palette Arobase, thème clair et sombre.
**Côté navigateur uniquement** : aucun changement de comportement, d'URL ni de données.

Le navigateur injecte lui-même le CSS avant le premier rendu : aucun gestionnaire de scripts n'est nécessaire et l'ancien style ne clignote pas.

## Installation

1. Ouvrir `edge://extensions` et activer le **Mode développeur**.
2. Cliquer sur **Charger l'extension décompressée** et choisir le dossier `dist/extension` de ce projet.
3. Recharger RG System (Ctrl+F5). La console (F12) affiche `[RG thème Arobase] extension démarrée…` puis `contrôle visuel : … (thème actif)`.

À savoir :
- L'extension est chargée **depuis le dossier** : ne pas le déplacer ni le supprimer.
- Edge peut proposer de désactiver les extensions du mode développeur au démarrage : refuser, ou réactiver l'extension dans `edge://extensions`.
- Elle ne demande que l'accès à `dashboard.rg-supervision.com` (plus `scripting` / `activeTab` pour l'interrupteur). Elle ne collecte ni n'envoie aucune donnée.
- Autre poste : copier le dossier `dist/extension` et refaire les étapes 1 à 3. Un déploiement à plusieurs passe par le Microsoft Edge Add-ons store ou une stratégie d'entreprise.

## Utilisation

- **Interrupteur général** (en cas de régression après une mise à jour de RG System) : un clic sur l'icône de l'extension désactive ou réactive le thème et recharge la page.
- **Clair / sombre** : bouton lune/soleil dans l'en-tête (à droite des icônes) ou `Alt+Maj+T`. Le choix est mémorisé ; par défaut le thème suit `prefers-color-scheme`.
- **Densité des tableaux** (confortable / compacte) : `Alt+Maj+D`, mémorisée.

Les réglages sont stockés dans le `localStorage` du site (`rgx.enabled`, `rgx.theme`, `rgx.density`).

## Mise à jour du thème

```bash
npm install        # une seule fois
npm run build      # produit dist/extension/
```

Incrémenter `version` dans `package.json` avant de recompiler, puis cliquer sur le bouton « recharger » de la carte de l'extension dans `edge://extensions`.

Le build :
1. compile `src/theme.css` avec le **Tailwind CLI** (v4) → CSS minifié ;
2. convertit les polices locales (`@fontsource`, sous-ensemble latin) en `@font-face` data-URI ;
3. assemble l'extension : `manifest.json`, `content.js`, `background.js`, `theme.css`, `fonts.css`.

Aucune ressource externe n'est chargée à l'exécution (ni CDN Tailwind, ni Google Fonts) : compatible avec la CSP de RG System, qui ne contraint que `script-src`.

## Structure

| Fichier | Rôle |
|---|---|
| `src/theme.css` | Tout le CSS (Tailwind 4) : variables clair/sombre, puis une section par composant |
| `src/icons.mjs` | **Source unique des icônes** (style Lucide, trait 2 px) : icônes du menu, correspondance glyphicons → icônes. Le build en génère `src/icons.generated.css` (masques SVG, couleur = `currentColor`). Pour ajouter une icône : l'ajouter dans `ICONS`, puis dans `MENU` ou `GLYPHS`. |
| `src/extension/content.js` | Logique JS minimale : attributs de thème sur `<html>`, bouton, raccourcis, MutationObserver. **Les sélecteurs de la barre latérale et de l'en-tête sont regroupés dans l'objet `SEL` en tête de fichier.** |
| `src/extension/background.js` | Interrupteur général (clic sur l'icône) |
| `src/extension/manifest.template.json` | Manifest V3 (version injectée par le build) |
| `build.mjs` | Assemblage |
| `dev/serve.mjs`, `test/harness.html` | Banc de test local (voir plus bas) |
| `docs/PROPOSITION-RG.md` | Document à destination de l'équipe RG System |
| `maquette/direction.html` | Maquette de direction |

## Ajouter ou corriger un écran

1. Repérer dans l'inspecteur (F12) des sélecteurs **stables** : ids (`#content`, `#tree-block`), classes Bootstrap 3 (`.table`, `.btn`), classes MUI `Mui*-root`. **Éviter** les classes styled-components (`Header__StyledBox-sc-1heih6i-4 dBYHcP`) : leur hash change à chaque version de RG. On peut cibler le **nom** du composant : `[class*="Card__Layout-sc"]`.
2. Ajouter une règle dans `src/theme.css`, sous `html[data-rgx] …`, en utilisant les variables (`var(--rgx-surface)`, `var(--rgx-border)`…) : le thème sombre suit automatiquement.
3. N'utiliser `!important` que si le CSS d'origine en met déjà (`branding-v3.css` : `.btn-primary`, `.background-color-primary`, `.color-rg`, `.jstree-clicked`, `table th`), si le JS de RG pose des styles inline (fonds des `<li>` du menu) ou si une règle d'origine porte un `#id`.
4. Ne pas modifier les dimensions structurantes (largeur du menu, hauteur du header, largeur de l'arbre) : le JS de RG s'en sert pour positionner les éléments.
5. `npm run build`, recharger l'extension, vérifier en clair **et** en sombre.

## État de vérification par écran (clair + sombre sauf mention)

Vérifié = ouvert dans le navigateur, contrôlé visuellement et par un balayage automatique des fonds clairs / textes sombres restés en thème sombre.

| Écran | État |
|---|---|
| Barre latérale, header, arborescence (+ menu clic droit), barre d'actions Tickets, panneaux Filtres / Créer | vérifié |
| Tickets : liste remplie (filtre « Tous »), lignes paires, boutons d'action | vérifié en clair et en sombre |
| Vues › Synthèse / Serveurs, Pedigree (liste) | vérifié (aussi chez l'utilisateur, avec l'extension) |
| Pedigree : fiche d'un agent (cartes, lignes zébrées, réseau, commentaires) | vérifié en sombre |
| Données › Disque (courbes dygraphs) | vérifié en sombre : cartes de courbes laissées claires (voir ci-dessous) |
| Actions › Système, Services, Windows Update (agent en ligne, lecture seule) | vérifié en sombre |
| Utilisateurs (+ menu ⋮), Gestion › IA, Mon profil | vérifié en sombre |
| Backup › Jobs, Gérer | vérifié |
| Configuration › Plugins, Alertes, Communication, Automatisation, Bibliothèque de scripts, Templates d'événements, Rapports de supervision | vérifié en sombre |
| Réseau › Voisinage, Téléchargements › Kit de déploiement, Cybersecurity › Vulnérabilités | vérifié en sombre |
| Extension chargée dans Edge (mode développeur) | testée par l'utilisateur : thème appliqué en clair et en sombre |
| Fenêtres modales Bootstrap (`.modal-*`) | vérifiées sur un gabarit factice, pas sur une vraie modale RG |
| Données (autres courbes : CPU, mémoire, réseau, antivirus…) | non vérifié individuellement (même composant dygraphs que Disque) |
| Actions › Assist, Scripts personnalisés, App Manager, Messages ; Backup › restaurations, Activité, Statistiques, Microsoft 365 ; Configuration › Pools, Hyperviseur, Templates devices/tickets, Rapports personnalisés | non ouverts |
| Cybersecurity › Gérer | page promotionnelle de l'éditeur (fond blanc codé en dur), laissée telle quelle |

**Courbes en sombre** : les graphiques sont dessinés en `<canvas>` avec des séries choisies pour un fond blanc. Plutôt que d'altérer les couleurs des données, le thème garde la carte du graphique claire (arrondie, ombrée) dans un écran sombre.

Pour traiter un écran non vérifié : l'ouvrir, F12, repérer les éléments restés blancs/illisibles en sombre, puis suivre « Ajouter ou corriger un écran ».

## Banc de test local

```bash
npm run serve    # sert dist/ et test/ sur http://localhost:4173
```

Ouvrir `http://localhost:4173/harness.html` : la page charge `fonts.css`, `theme.css` et `content.js` comme le fait le manifest, sur un mini-DOM de RG System (`?off=1` pour tester l'interrupteur).

## Points d'attention connus

- **Arborescence** : le statut d'un nœud est lu dans son attribut `rel` (N1 ok, N2 critique, N3 avertissement, N4 info, N5 inactif) et affiché en pastille. La corbeille et les agents gardent leur icône d'origine. Les barres de survol/sélection de jsTree sont positionnées en JavaScript d'après la hauteur des lignes : le CSS doit donc être appliqué **avant** l'initialisation de l'arbre, ce que fait l'extension (injection au démarrage).

- Les classes `.shrink-menu-transform` de RG animent les fonds (≈ 0,5 s) : le changement clair/sombre est donc légèrement progressif sur la barre latérale.
- Les icônes du menu et de l'arbre sont les sprites SVG d'origine (le statut des nœuds est porté par leur couleur : ne pas les recolorer).
