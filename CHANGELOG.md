# Journal des modifications

## 1.2.0 — 2026-10-17

Reprise de l'en-tête, de la typographie et du socle de composants.

- **En-tête** : boutons d'icônes **identiques** (32 px, survol en pastille, même alignement) — les éléments d'origine (fusée, Assist, notes de version, et tout bouton ajouté par RG, repris automatiquement) restent dans le DOM, masqués, et reçoivent le clic ; avatar du profil rond, cerclé, anneau de marque au survol ; menus MUI (profil, sélecteurs) dans le style du thème.
- **Typographie** : plus aucun texte en Roboto ni Helvetica Neue (boutons, champs, commutateur Courant/Tous, colonnes MUI) ; titres de courbes et légendes dans les polices du thème.
- **Synthèse (Vues)** : les pastilles d'une ligne ne passent plus à la ligne (rangées « éclatées »).
- **Tickets** : détail d'un ticket (cadre gris de 4 px remplacé par un liseré de marque, cartes homogènes, titres en petites capitales) ; sélecteur « par page » aligné sur les boutons.
- **Configuration** : accordéons et listes de plugins en cartes blanches ; listes de templates en une carte par ligne (icône | nom | actions).
- **Socle étendu** (`90-extra.css`) : dialogues, pastilles, interrupteurs, infobulles, tiroirs, champs, validation de formulaire, nav-pills, fil d'Ariane, barres de progression, code… pour les écrans non capturés (modales, Assist, Messages, recherche, profil).

## 1.1.0 — 2026-10-17

Premières évolutions de comportement (au-delà du style).

- **Arborescence redimensionnable sans minimum** (120 – 640 px), largeur mémorisée, double-clic = largeur d'origine.
- **Tickets › Actualisation auto** réellement automatique : rechargement de la page à la fréquence du widget, quand l'utilisateur est inactif ; état conservé après rechargement ; désactivable (`rgx.autoReload`).
- Synthèse d'un agent : la colonne du nœud ne passe plus à la ligne ; poignée de redimensionnement affinée.
- Test de syntaxe des scripts de l'extension dans `npm test`.
- Outil : `rgxOverflow` (débordements, chevauchements, libellés rognés) dans test/scan.js.

## 1.0.4 — 2026-10-17

- **Sous-sous-menus** (Données › Courbes › Disque…) : libellé et chevron centrés, chevron pivoté à l'ouverture, filet de liaison, plus de fond propre ; libellés alignés sur ceux du niveau 1.
- **Noms d'agents** (serveurs, postes) en JetBrains Mono dans les tableaux, les tickets et les fiches.
- **Icônes** des agents (serveur, poste, device) et des plateformes (Windows, macOS, Linux, hyperviseur) redessinées en monochrome, couleur du texte secondaire.
- **Statistiques** : tableau de plateformes contenu dans sa carte ; cartes étroites de la fiche agent (Uptime, Actions) lisibles via une requête de conteneur.
- Libellés de champs (Début / Fin) et étapes d'assistant : la classe « fond marque » de RG ne les teinte plus comme la barre latérale.

## 1.0.3 — 2026-10-17

- **Arborescence** : le texte ne se décale plus au survol (RG ajoutait 1 px de bordure aux lignes survolées) ; flèches d'ouverture centrées et remplacées par des chevrons (disparition des pointillés de liaison).
- **Menu** : mise en page en flex — icône, libellé, étiquette « New » (désormais une pastille) et chevron centrés sur la ligne ; **menu réduit refait** (icônes centrées dans des pastilles de 36 px, plus de chevrons ni de libellés, volet de sous-menu en carte avec titre de section).
- Outils de test : `rgxAlign` (alignement vertical icône / texte) dans test/scan.js.

## 1.0.2 — 2026-10-17

Deuxième série de retouches après essai sur le site réel.

- **Menu** : pastilles inscrites dans la barre (marge et espace intérieur de 10 px portés par le `<li>`, plus de dépendance aux classes de RG) ; **icônes devant chaque entrée de sous-menu** (Vues, Données, Actions, Configuration, Backup…), retrait réduit, libellés alignés sur ceux du premier niveau ; le parent d'un sous-menu contenant la page courante porte la pastille de marque ; chevrons en trait fin.
- **Arborescence** : le lien occupe toute la largeur de sa ligne (survol et sélection en barre pleine largeur) ; les barres jsTree positionnées en JavaScript, à l'origine du survol décalé, sont traversées par la souris.
- **Tableaux de synthèse** : première et dernière colonne à 16 px du bord ; pastilles d'état refaites (« ok » discret avec point, problèmes en couleurs pleines, forme en pilule) ; pastille connecté / hors ligne centrée ; en-têtes de colonnes alignés.
- **Champs flottants React** (double bordure) et **petits boutons** (marge intérieure de 1 px) corrigés.
- Outil : `rgxLayout` (test/scan.js) détecte les textes collés au bord d'une carte et les contrôles sans marge intérieure.

## 1.0.1 — 2026-10-17

Retouches après essai sur le site réel (Vues › Serveurs).

- **Menu** : le liseré blanc et le fond translucide posés par RG sur l'entrée courante sont retirés ; sous-menus sans cadre, libellés alignés ; l'entrée « Rechercher » (rendue sans lien par React) reçoit la même icône et la même pastille que les autres.
- **Tableaux de synthèse** : icônes des plugins (en-têtes de colonnes, listes Plugins / Alertes) redessinées en trait fin ; dossier du nœud en contour coloré par statut ; pastille connecté / hors ligne pleine.
- **Arborescence** : icônes des agents (poste, serveur, device) et de la corbeille redessinées ; survol et sélection portés par le lien (les barres positionnées en JavaScript par jsTree, décalées dès que la hauteur des lignes change, sont rendues invisibles).

## 1.0.0 — 2026-10-17

Première version stable.

### Fidélité à la maquette
- **Logo** : pastille « RG » + « RG system » + étiquette « suite » (menu réduit : pastille seule). Le logo image d'origine reste affiché si le balisage n'est pas injecté.
- **En-tête 56 px** : icônes de trait fin (arborescence, fusée, assistance, notes de version, clair/sombre), pastille « Brain » à contour avec étincelle de marque, fil d'Ariane en Space Grotesk.
- **Barre latérale** : le bouton de réduction passe sur la ligne du logo, la navigation remonte ; séparateur aligné sur l'en-tête.
- **Pagination** : carrés de 32 px, écart de 4 px, états survol / désactivé / page courante ; couvre la pagination Bootstrap (Tickets) et les listes « Page 1 - 4 sur 4 » (tableaux React).
- **Alertes** avec icône d'état et liseré de 3 px ; barres d'actions en boutons séparés (les groupes segmentés restent soudés).
- **Arborescence** : pastilles de statut, sélection en pastille de marque, barre pleine largeur du plugin jsTree neutralisée.

### Écrans
- Écrans « vitrine » React (Rapports personnalisés…), variantes `success / warning / danger / primary` des boutons et pastilles de statut React, `panel-heading-list` : lisibles en sombre.
- 50 pages de RG System passées en revue en clair et en sombre sur un banc de test hors ligne (fixtures anonymisées), avec balayage automatique des contrastes.

### Qualité
- CSS découpé en modules (`src/css/00-tokens … 60-layout`).
- `npm test` : build, manifest, absence de ressource externe, portée `html[data-rgx]`, contraste WCAG AA des couleurs (clair et sombre).
- Palette claire ajustée (texte secondaire, vert, orange, rouge) pour atteindre 4,5:1.
- Accessibilité : anneau de focus clavier, `prefers-reduced-motion`.
- Icônes d'extension (16 / 32 / 48 / 128), `THIRD-PARTY-NOTICES.md`, `npm run pack` (zip).

## 0.9.0
- Extension Edge (Manifest V3) : injection du CSS avant le premier rendu, interrupteur général, raccourcis Alt+Maj+T / Alt+Maj+D.
- Thème clair/sombre, polices locales, système d'icônes en masques CSS.
