# Proposition d'évolution visuelle de RG System Suite

Document à destination de l'équipe RG System. Il accompagne une extension de navigateur (côté navigateur, sans toucher au
serveur) qui montre ce qu'une interface modernisée pourrait donner **sans changer le comportement de la plateforme**.

## Pourquoi

Au quotidien, l'interface cumule trois générations de composants : Bootstrap 3 + jQuery + jsTree « classic »,
composants MUI, et composants `styled-components`. Les trois ne partagent ni couleurs, ni rayons, ni polices,
ni états de survol. Résultat : une impression d'ensemble datée et des écarts de contraste (textes `#333`
codés en dur, fonds blancs, gris `#ADADAD`).

## Ce que montre le prototype

- une palette et une typographie uniques (Inter pour le texte, Space Grotesk pour les titres) ;
- un **thème clair et un thème sombre**, tous deux basés sur des variables CSS (`--rgx-surface`, `--rgx-ink`…) ;
- des rayons, bordures, ombres et survols cohérents (boutons, champs, tableaux, onglets, cartes, menus, modales, pagination, alertes) ;
- une **identité visuelle** : logo (pastille « RG » + nom), en-tête de 56 px avec icônes de trait fin (style Lucide), pastilles de statut dans l'arborescence ;
- la barre latérale, le header, l'arborescence, les grilles React, le calendrier d'automatisation, les écrans
  Pedigree / Jobs / Utilisateurs / Configuration / Vulnérabilités ;
- aucun changement de structure, d'URL, de requête ou de donnée ; aucune dépendance chargée à l'exécution
  (CSS et polices embarquées, compatibles avec la CSP actuelle qui ne contraint que `script-src`).

## Comment RG pourrait l'adopter nativement

1. **Utiliser le mécanisme de thème existant.** `rg-themes/…/branding-v3.css` fixe déjà une couleur de marque. L'étendre
   à un jeu de variables CSS (surface, texte, bordure, accent, états) permettrait d'obtenir les deux thèmes à coût quasi nul.
2. **Remplacer les couleurs codées en dur** par ces variables, en particulier dans les composants `styled-components`
   (`Expandable__Layout`, `LeftPanel__Card`, `Card__Layout`, `Stats__Layout`, `ViewSwitch__Layout`…), les lignes zébrées (`.ticket-table-even`, `.list-striped*`, `#block-info-pedigree div.row:nth-child(2n)`) et les `Typo`/`MuiBox` en `#333`.
3. **Ne plus poser de couleur en `style` inline** (ex. `StatusBanner` : `background-color: var(--blue-lagoon-color)`), ni de
   `background-color` inline en JavaScript sur les `<li>` du menu (effet de survol) : un `:hover` CSS suffit et laisse le thème décider.
4. **Réduire les `!important`** de `branding-v3.css` (`.btn-primary`, `.background-color-primary`, `.color-rg`, `.jstree-clicked`,
   `table th`) : ils obligent tout thème à les surcharger à armes égales.
5. **Icônes en SVG `currentColor`** : les pictogrammes de l'en-tête (fusée, assistance, notes de version…) et du menu sont des tracés pleins aux couleurs figées ; le prototype les redessine en trait fin via des masques CSS. Les icônes d'agents (`img-sum-server`, `img-sum-workstation`…) sont des images de fond
   gris foncé, illisibles en sombre sans filtre ; des SVG héritant de `currentColor` les rendraient thémables.
6. **Exposer des points d'accroche stables** (`data-testid`, noms de classes sémantiques) : les classes `Composant-sc-hash`
   changent à chaque build, ce qui fragilise toute personnalisation.
7. **Ne pas recharger la page entière** lors de certaines navigations (observé en cours de test) : l'écran flashe et le thème doit
   se réappliquer.

8. **Deux défauts d'ergonomie relevés à l'usage** : (a) l'arborescence ne peut pas être réduite sous une largeur minimale (le prototype la rend librement redimensionnable) ; (b) le bouton « Actualisation auto » de la liste des tickets ne recharge pas la liste, il faut un rechargement complet de la page (le prototype rafraîchit la liste à la fréquence du widget en re-déclenchant le rendu de la page, sans rechargement complet).
9. **Survol de l'arborescence** : les barres du plugin jsTree « wholerow » sont positionnées en JavaScript d'après une mesure faite à l'initialisation et se décalent dès que la hauteur des lignes change ; un lien occupant toute la largeur de sa ligne (CSS seul) supprime le besoin de ces barres.

## Ce que l'on n'a pas touché

Aucune action de la plateforme n'a été déclenchée pendant les tests (pas de redémarrage, de suppression, de clôture ni
d'enregistrement de formulaire). Les captures ne sont pas jointes : elles contiennent des noms de clients.

## Écrans couverts et limites

Les 50 écrans capturés (Vues, Tickets, Pedigree et fiche agent, Données, Actions, Backup, Configuration, Gestion, Réseau, Cybersecurity,
Téléchargements) ont été revus en clair et en sombre sur un banc de test hors ligne, avec un balayage automatique des contrastes
(`npm test` contrôle en plus le contraste WCAG AA de toute la palette). Restent à valider sur la plateforme réelle : les fenêtres
modales et quelques écrans non capturés (Assist, Messages, recherche globale).

Point de conception à discuter : les courbes (dygraphs, `<canvas>`) utilisent des couleurs de séries pensées pour un fond
blanc. Le prototype affiche donc le graphique sur une carte sombre en inversant son dessin (inversion, rotation de teinte,
luminosité) : les couleurs restent reconnaissables mais approximatives. Un jeu de couleurs de séries par thème côté RG
serait plus fidèle.

## Licence du prototype

Le code, le CSS, les icônes redessinées et la maquette sont sous **licence MIT** : l'équipe de RG System peut en reprendre tout ou partie, librement, sans autorisation ni démarche préalable.

## Licence et polices

Le prototype embarque Inter, Space Grotesk et JetBrains Mono (SIL Open Font License 1.1), via les paquets `@fontsource/*`.
