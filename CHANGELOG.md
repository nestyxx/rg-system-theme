# Journal des modifications

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
