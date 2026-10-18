# Développement

Guide technique du projet (architecture, ajout d'un écran, banc de test). Présentation et installation : [README](../README.md).

- Maquette de référence : [`maquette/direction.html`](../maquette/direction.html)
- Document pour l'équipe RG System : [`PROPOSITION-RG.md`](PROPOSITION-RG.md)
- Historique : [CHANGELOG](../CHANGELOG.md)

## Mise à jour du thème

```bash
npm install        # une seule fois
npm run build      # produit dist/extension/
npm test           # contrôles automatiques (voir plus bas)
npm run pack       # facultatif : dist/rg-system-theme-<version>.zip
```

Incrémenter `version` dans `package.json` avant de recompiler, puis cliquer sur le bouton « recharger » de la carte de l'extension dans `edge://extensions`.

Le build :
1. génère les icônes CSS (`src/icons.mjs` → `src/icons.generated.css`) ;
2. compile `src/theme.css` avec le **Tailwind CLI** (v4) → CSS minifié ;
3. convertit les polices locales (`@fontsource`, sous-ensemble latin) en `@font-face` data-URI ;
4. assemble l'extension : `manifest.json`, `content.js`, `popup.html/css/js`, `theme.css`, `fonts.css`, `icons/`.

Aucune ressource externe n'est chargée à l'exécution (ni CDN Tailwind, ni Google Fonts) : compatible avec la CSP de RG System, qui ne contraint que `script-src`.

## Structure

| Fichier | Rôle |
|---|---|
| `src/theme.css` | Point d'entrée Tailwind 4 : imports + jetons `@theme` ; le CSS est dans `src/css/` |
| `src/css/00-tokens.css` | Variables clair / sombre (`--rgx-*`) |
| `src/css/10-base.css` | Typographie, fond, sélection, focus clavier, mouvement réduit |
| `src/css/20-shell.css` | Barre latérale, en-tête, arborescence |
| `src/css/30-components.css` | Boutons, étiquettes, alertes, formulaires, tableaux, panneaux, modales, onglets, menus, pagination |
| `src/css/40-react.css` | Écrans React : grilles, onglets MUI, `BaseButton`, pastilles de statut, écrans « vitrine » |
| `src/css/50-modules.css` | Modules : Jobs, Configuration, calendrier, vulnérabilités, menu clic droit, Pace, sélecteur de date, tickets, fiche agent, courbes… |
| `src/css/60-layout.css` | Mise en page de la maquette : en-tête 56 px et icônes, logo, pagination des listes, boutons, tableaux |
| `src/css/95-pages.css` | Gabarits de page : en-tête d'identité, onglets, en-têtes de tableaux, icônes de plateforme |
| `src/css/96-surfaces.css`, `97-agent-global.css`, `98-extras.css` | Surfaces relevées sur le site réel (fenêtre d'agent, menu du profil, bibliothèque de scripts, connexion, Brain), fiche agent, criticité, passe globale (curseurs, titres), recherche rapide Ctrl+K, squelettes de chargement, harmonisation des familles de tableaux |
| `src/css/99-webgest.css` | Langage visuel de Webgest : couleur du module (`--rgx-accent`, posée par `:has()` d'après l'entrée de menu courante), menu / arborescence plats, boutons encre, onglets en rail, badges point + texte, en-têtes de tableau teintés, titres. Les jetons (`--rgx-*`) sont dans `00-tokens.css`, alignés sur `input.css` de Webgest (clair et sombre) |
| `src/css/99-coherence.css` | Éléments qui gardaient leur style d'origine, relevés par mesure (voir « Chasse aux styles d'origine » plus bas) |
| `src/css/99-responsive.css` | Adaptation à la largeur : rail < 1200 px, arborescence en superposition < 1000 px, tiroirs < 768 px (la logique de bascule est dans `content.js`, bloc « Adaptation à la largeur d'écran ») |

### Chasse aux styles d'origine

Pour chaque élément visible d'une page : lire son style calculé (couleur, fond, contour, rayon, police, ombre) avec le thème
(`html[data-rgx]` présent) puis sans (attribut retiré, transitions coupées le temps de la mesure). Un élément identique dans
les deux cas garde le style de RG. On regroupe par « classe » (hachage styled-components retiré) et on trie par nombre de pages :
les premières lignes sont les règles à écrire. Un fond blanc en thème clair est un faux positif (c'est aussi la surface du
thème). Le script de mesure tient en une trentaine de lignes ; il s'exécute dans la console ou via un outil de pilotage de navigateur.
| `src/css/80-polish.css`, `90-extra.css` | Reprise typographique, tickets, configuration, courbes ; socle étendu (Bootstrap 3 + MUI) pour les écrans non capturés |
| `src/css/70-menu-sum.css` | Retouches issues des essais sur le site réel : menu (entrée courante, sous-menus, Rechercher), survol de l'arbre, icônes des agents, tableaux de synthèse |
| `src/icons.mjs` | **Source unique des icônes** (style Lucide, trait 2 px). Le build en génère `src/icons.generated.css` (variables `--rgx-ic-*` + masques CSS, couleur = `currentColor`). Pour ajouter une icône : l'ajouter dans `ICONS`, puis dans `MENU` ou `GLYPHS`, ou l'utiliser via `var(--rgx-ic-nom)` dans le CSS. |
| `src/extension/content.js` | JS minimal : attributs de thème sur `<html>`, bouton clair/sombre, logo, avatar en initiales, boutons d'en-tête, largeur de l'arbre, actualisation douce des tickets, texte complet au survol, recherche rapide (Ctrl+K), raccourcis, MutationObserver. **Les sélecteurs de la barre latérale, de l'en-tête et du logo sont regroupés dans l'objet `SEL` en tête de fichier.** |
| `src/extension/popup.html`, `popup.css`, `popup.js` | Panneau de réglages ouvert par un clic sur l'icône : interrupteur général, thème, densité, actualisation auto, largeur de l'arbre. Il écrit dans le `localStorage` du site (via `chrome.scripting`) et content.js applique le changement en direct (événement `rgx-set`). |
| `src/extension/manifest.template.json` | Manifest V3 (version injectée par le build) |
| `src/extension/icons/` | Icônes de l'extension (générées par `npm run icons`) |
| `build.mjs`, `scripts/` | Assemblage, génération des icônes, empaquetage |
| `dev/serve.mjs`, `test/` | Banc de test local (voir plus bas) |

## Ajouter ou corriger un écran

1. Repérer dans l'inspecteur (F12) des sélecteurs **stables** : ids (`#content`, `#tree-block`), classes Bootstrap 3 (`.table`, `.btn`), classes MUI `Mui*-root`. **Éviter** les classes styled-components (`Header__StyledBox-sc-1heih6i-4 dBYHcP`) : leur hash change à chaque version de RG. On peut cibler le **nom** du composant : `[class*="Card__Layout-sc"]`.
2. Ajouter une règle dans le module `src/css/` adapté, sous `html[data-rgx] …`, en utilisant les variables (`var(--rgx-surface)`, `var(--rgx-border)`…) : le thème sombre suit automatiquement.
3. N'utiliser `!important` que si le CSS d'origine en met déjà (`branding-v3.css` : `.btn-primary`, `.background-color-primary`, `.color-rg`, `.jstree-clicked`, `table th`), si le JS de RG pose des styles inline (fonds des `<li>` du menu) ou si une règle d'origine porte un `#id`.
4. Ne pas modifier les dimensions structurantes (largeur du menu, largeur de l'arbre) : le JS de RG s'en sert pour positionner les éléments. (La hauteur de l'en-tête est portée à 56 px et la barre de redimensionnement `#dragbar` suit ; c'est le seul réglage de ce type.)
5. `npm run build`, recharger l'extension, vérifier en clair **et** en sombre.

## Banc de test hors ligne

Les écrans de RG System ne sont pas accessibles sans compte : le projet fournit donc un banc de test qui rejoue **des copies de pages** avec le thème, sans réseau.

```bash
npm run serve    # http://localhost:4173/  -> liste des pages ; ?theme=dark pour le sombre
```

- `test/harness.html` : mini-DOM de RG (`?off=1` pour tester l'interrupteur).
- `test/fixtures/` : pages RG capturées (≈ 70 écrans : Vues, Pedigree, Données, Actions, Backup, Configuration, Gestion, Réseau, Cybersecurity, Téléchargements, profil, recherche…). **Non versionné** (`.gitignore`) : même anonymisées, ces pages reproduisent l'interface d'un compte réel.
- Pour (re)générer des pages : coller `test/capture.js` dans la console de RG System (connecté), appeler `await rgxCapture('#/node/root/page/…')`, enregistrer le JSON obtenu, puis `node test/fixtures-build.mjs <fichier>` (ou `node test/fixtures-all.mjs <dossier>` pour un lot). Les noms de clients de l'arborescence sont remplacés par « CLIENT 01… » ; des règles supplémentaires (noms de personnes) se déclarent dans `localStorage.__rgxAnon`.
- `test/surfaces.html` : balisage fictif (relevé sur le site réel) de la fenêtre d'agent, du menu du profil, de la bibliothèque de scripts, des boucliers Windows Update ; `?view=login` pour la page de connexion, `?theme=dark` pour le sombre.
- `test/scan.js` : balayage automatique d'une ou plusieurs pages (texte à contraste < 3:1, grandes surfaces claires en sombre) — voir l'en-tête du fichier.

## Tests automatiques

```bash
npm test
```

Vérifie : le build, la validité du manifest (version, fichiers référencés, accès limité à `dashboard.rg-supervision.com`), l'absence de ressource externe dans le CSS livré, que **toutes** les règles sont sous `html[data-rgx]` (le thème ne peut pas déborder), et le **contraste WCAG AA (4,5:1)** de toutes les paires de couleurs du thème clair et du thème sombre. Un fichier facultatif `test/forbidden.txt` (non versionné : un terme par ligne, p. ex. des noms de clients) fait échouer le test si l'un de ces termes apparaît dans un fichier versionné.

## État de vérification

Les 50 écrans capturés ont été revus en clair et en sombre (revue visuelle + balayage automatique des contrastes). Chaque correction est contrôlée sur le banc de test. L'extension a été installée et testée dans Edge (mode développeur) sur le site réel ; les écrans ci-dessous l'ont été sur le banc de test.

| Zone | Écrans |
|---|---|
| Gabarit | barre latérale (réduite ou non), en-tête, arborescence, menu clic droit |
| Vues | Synthèse (tout, serveurs, postes, stats), opérations asynchrones |
| Tickets, Pedigree | liste, fiche agent |
| Données | CPU, mémoire, disque, E/S disque, réseau, communication, antivirus, matériel, services |
| Actions | Système, Services, App Manager, Scripts personnalisés, Windows Update |
| Backup | Gérer, Jobs, Activité, Statistiques, Restauration, Microsoft 365 |
| Configuration | Plugins, Alertes, Communication, Automatisation (calendrier), Bibliothèque, Templates (événements, devices, tickets utilisateurs), Pools, Hyperviseur, Rapports |
| Gestion | Utilisateurs, IA, Quotas |
| Autres | Réseau › Voisinage, Cybersecurity, Téléchargements › Kit de déploiement |

Limites connues :
- **Courbes** (dygraphs, `<canvas>`) : les séries sont choisies pour un fond blanc. En thème sombre, le thème inverse le dessin (inversion + rotation de teinte + luminosité) sur une carte sombre : les couleurs restent reconnaissables sans toucher aux données, mais ne sont pas identiques à celles du thème clair. Un jeu de couleurs par thème côté RG serait plus fidèle.
- **Cybersecurity › Gérer** : page promotionnelle de l'éditeur (fond blanc codé en dur), laissée telle quelle.
- **Fenêtres modales** et panneaux (Créer un ticket, Filtres) : stylés d'après les composants Bootstrap, contrôlés en direct lors de la première version ; non capturés sur le banc de test.
- Les écrans ajoutés par RG après la livraison ne sont pas stylés individuellement : le socle (boutons, tableaux, formulaires, onglets) s'applique, le reste se corrige selon « Ajouter ou corriger un écran ».

## Points d'attention connus

- **Arborescence** : le statut d'un nœud est lu dans son attribut `rel` (N1 ok, N2 critique, N3 avertissement, N4 info, N5 inactif) et affiché en pastille. La corbeille et les agents gardent leur icône d'origine. Les barres de survol/sélection de jsTree sont positionnées en JavaScript d'après la hauteur des lignes : le CSS doit donc être appliqué **avant** l'initialisation de l'arbre, ce que fait l'extension (injection au démarrage).
- Les classes `.shrink-menu-transform` de RG animent les fonds (≈ 0,5 s) : le changement clair/sombre est donc légèrement progressif sur la barre latérale.
- Les icônes du menu, de l'en-tête et des boutons sont redessinées (Lucide) ; celles de l'arbre et des statuts sont les sprites SVG d'origine (le statut est porté par leur couleur : ne pas les recolorer).

## Crédits et licences

Polices Inter, Space Grotesk et JetBrains Mono (OFL), tracés d'icônes Lucide (ISC), Tailwind CSS (MIT) : voir [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md). « RG System » appartient à son éditeur ; ce projet est un habillage non officiel.
