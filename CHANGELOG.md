# Journal des modifications

## 1.8.2 — 2026-10-17

Harmonisation des tableaux (inventaire de toutes les familles de tableaux sur le site réel).

- **Tableaux** : les listes Bootstrap (Services, Inventaire logiciel) prennent la présentation des grilles React : carte à bord arrondi, en-tête discret en capitales, filets fins, espacement homogène. Même traitement pour le tableau MUI de Gestion › Quotas / profil, dont le texte restait **noir sur fond sombre**, et pour l'en-tête des listes en lignes-cartes (Journal d'événements, Gestion › Utilisateurs).
- **Colonne Criticité** (Vues › Statistiques, tickets) : la cellule passait en `inline-flex` et sortait de la mise en page du tableau (colonne écrasée, filets coupés).
- **Recherche** : les termes trouvés ne sont plus en jaune vif avec texte clair illisible.
- **Actions › Système** : la ligne de commande n'est plus un bloc gris `#333`.
- **Gestion › Utilisateurs** : pictogramme du titre à la taille et à la teinte des autres titres.
- **Icônes** : les sprites `backup` / `security` du sélecteur de colonnes du pedigree sont remplacés comme ceux du menu.

## 1.8.1 — 2026-10-17

Tests en direct des interactions (compte à rebours, palette, Brain, menu replié, infobulles).

- **Barre d'outils des tickets** : avec le compte à rebours de l'actualisation auto, « Clôturer tout » passait à la ligne et, quand la zone est étroite (menu replié, panneau Brain ouvert), les boutons recouvraient le sélecteur « par page ». La rangée est maintenant en flex avec retour à la ligne propre.
- **Infobulles RG** (statut, Windows Update…) : marine du thème, bordure fine, coins arrondis, interligne aéré.
- Vérifié sur le site réel : le compte à rebours se relance sans recharger la page, la recherche RG de la palette `Ctrl+K` renseigne et lance bien la recherche.

## 1.8.0 — 2026-10-17

Audit en direct sur la plateforme réelle, extension chargée (clair et sombre).

- **Polices** : Roboto, imposée par plusieurs composants RG, est remplacée par Inter via un alias `@font-face` (plus de police résiduelle).
- **Recherche rapide `Ctrl+K`** : ajoute les agents de la page et un choix « Rechercher « x » dans RG System ».
- **Icônes** : flèches, disquette, états Windows Update et sprites (sélecteur `xlink:href`).
- **Sombre** : sélecteur MUI de la page Jobs (fond blanc imposé par RG, y compris au focus).
- **Mise en page** : Configuration › Communication en grille à 7 colonnes, champs `select` / `input-group` à largeur minimale, accordéons, pastilles d'icônes, règles de relance, espacement des cellules.
- **Lisibilité** : chiffres des statistiques et légendes de graphiques plus contrastés en clair.
- **Tests** : limite de taille CSS portée à 600 Ko.

## 1.7.1 — 2026-10-17

- **Actualisation auto des tickets : état visible.** Tant qu'elle est active, le bouton est teinté, son icône tourne et un compte à rebours (« 42 s ») indique la prochaine actualisation (« … » si elle attend que vous ayez fini d'agir) ; l'infobulle le précise. Le décompte repart de zéro à chaque activation.
- **Documenté** : le rechargement complet de la page toutes les 2 à 3 minutes n'est pas dû à l'extension (mesuré sans elle : redirection vers `login.microsoftonline.com`) ; il est décrit dans `docs/PROPOSITION-RG.md` et dans les limites connues du README.

## 1.7.0 — 2026-10-17

Revue complète de la plateforme et finalisation du dépôt.

- **Toutes les pages du menu analysées** : 69 écrans capturés sur le site réel (dont recherche, vCenter, journal d'événements, inventaire logiciel, processus, Exchange, Replica, matériel, Messages, résumé quotidien, quatre assistants de restauration, profil, bibliothèque avec données), vérifiés en clair et en sombre par balayage automatique (contrastes, polices, débordements) et à l'œil.
- **Panneau de réglages** dans l'icône de l'extension : interrupteur général, thème (clair / sombre / auto), densité, actualisation auto des tickets, largeur d'origine de l'arborescence. Les réglages s'appliquent en direct. Le service worker disparaît (plus besoin).
- **Recherche rapide `Ctrl+K`** : nœuds de l'arborescence déjà chargés et pages du menu, navigation au clavier.
- **Texte complet au survol** des libellés tronqués par « … » (noms d'hôtes, e-mails, colonnes) : un `title` est posé s'il n'y en a pas déjà un.
- **Squelettes de chargement** (MUI Skeleton) avec reflet discret, désactivé si le système demande moins d'animations.
- **Corrections** : journal d'événements illisible en sombre (texte gris foncé imposé par un sélecteur à identifiant), libellés Information / Warning / Danger de la page Messages, légendes du profil, aperçu de notification, polices Roboto / Arial résiduelles.
- **Dépôt** : licence MIT, README refait (captures avant / après, direction visuelle), guide développeur déplacé dans `docs/DEVELOPPEMENT.md`, `CONTRIBUTING.md`, `SECURITY.md`, modèles de ticket et de pull request, intégration continue (tests + zip) et publication automatique du zip à chaque étiquette `vX.Y.Z`, `scripts/screenshots.mjs` pour régénérer les captures.

## 1.6.0 — 2026-10-17

- **Actualisation auto des tickets : plus de rechargement de la plateforme.** La liste est rafraîchie en cliquant par script sur l'entrée « Tickets » du menu (vérifié sur le site réel : les éléments de la page sont remplacés, arborescence et menu restent en place). Pas de rafraîchissement si un champ est en cours de saisie, si une fenêtre ou le détail d'un ticket est ouvert.
- **Fiche agent** : pastilles d'état en haut à droite (Windows Update, antivirus, sauvegarde, température) en disques homogènes de 34 px, teintés selon l'état ; panneau d'actions (Assist, Commande, Maintenance, Promouvoir, Désactiver, Redémarrer) en boutons carrés identiques ; lignes « Informations » en flex (la ligne « Système d'exploitation » et le champ « Date d'installation » ne se chevauchent plus).
- **Criticité** (tickets, statistiques, Configuration › Communication) : barres de niveau (3 = critique, 2 = moyenne, 1 = faible) aux couleurs du thème, au lieu de carrés pleins à ombre.
- **Icônes** : 22 glyphicons de plus remplacés par le jeu du thème (modifier, chevrons, pagination première/dernière page, menu « … », tri, cloche, livre, pouce…) ; sprites Commande, Maintenance, Calendrier, Drapeau, App Manager, Opérations, Sécurité, Sauvegarde, Température remplacés eux aussi.
- **Connexion** : même logo que la barre latérale (pastille « RG » + nom) ; titre centré.
- **Barre latérale** : hamburger de réduction aligné sur le bord droit des pastilles du menu ; marge haute au-dessus du premier niveau de l'arborescence.
- **Passe globale** : curseurs (main sur tout ce qui est cliquable, texte sur les champs, interdit sur le désactivé) ; échelle de titres unique (h1 → h6) ; polices Roboto résiduelles ramenées sur Inter (libellés flottants, Stats, Trial, vulnérabilités, profil) ; infobulles et libellés accessibles ajoutés aux actions en simple icône (« Supprimer », « Modifier », « Actualiser »…) sans écraser ceux de RG ; champs d'horaires jamais plus étroits qu'une heure.

## 1.5.0 — 2026-10-17

Surfaces relevées sur le site réel (balisage lu en direct, sans rien modifier) : `96-surfaces.css`.

- **Fenêtre d'agent** (survol d'un nom d'hôte) : carte du thème ; pastille d'icône compacte ; **logo Windows aux couleurs de marque** ; **actions** (terminal, redémarrer, Assist, maintenance, fiche) en boutons carrés homogènes, trait gris, marque au survol ; le pictogramme Assist (sprite multicolore) devient le casque du thème.
- **Statut Windows Update** (boucliers du tableau de synthèse) : boucliers du thème, un par état (à jour, optionnel, critique, redémarrage, suspendu, désactivé, inconnu), couleur = état.
- **Menu latéral** : « Rechercher » aligné comme les autres entrées (le paragraphe interne avait sa propre marge) ; logo sans l'étiquette « suite ».
- **Profil** : avatar en **initiales** sur disque de marque (tirées de l'adresse du Gravatar, ex. prenom.nom → PN) à la place de l'identicône ; menu du profil refait (carte arrondie, avatar de 56 px, bouton « Gérer mon profil » en pilule, icônes grises → marque au survol, « Se déconnecter » en rouge) ; page « Mon profil » : avatar rond, titre, libellés.
- **Bibliothèque de scripts** : cartes (titre, pastilles de langage et de durée, date, actions en boutons carrés, bloc de commande clair en thème clair au lieu du noir codé en dur, défilement au-delà de 150 px), barre de filtres homogène.
- **Courbes** : en-tête de section sans bandeau gris (icône, titre, repli), cartes un peu plus aérées.
- **Panneau Brain** : tiroir avec filet et ombre (son contenu est une application distincte, non stylable).
- **Page de connexion** : carte centrée, sans l'image promotionnelle ; logo en silhouette blanche en thème sombre.
- Banc de test : `test/surfaces.html` (balisage fictif de la fenêtre d'agent, du menu du profil, de la bibliothèque, des boucliers WU ; `?view=login`, `?theme=dark`).

## 1.4.1 — 2026-10-17

- **Courbes en thème sombre** : cartes sombres (plus de carte blanche au milieu d'une page sombre). Le dessin des séries (canvas) est inversé avec rotation de teinte et surcroît de luminosité ; légendes, valeurs min / moyenne / max, titres et axes reprennent les couleurs du thème.

## 1.4.0 — 2026-10-17

Passe de revue complète : les 51 pages capturées ont été reprises une à une, en clair puis en sombre (1440 px). Défauts relevés et corrigés :

- **Menu latéral** : la hauteur de l'en-tête du logo est posée par le CSS seul. Avant l'injection du logo par le script, le logo d'origine (100 px) décalait toute la navigation de ~45 px.
- **Étiquettes d'état sans variante** (« Pas installé », « Désactivé ») : pastille neutre au lieu d'un aplat gris foncé de 300 px.
- **Pastilles de statut des tickets** (retour à la normale / en alerte) : disques pleins rouge / vert (elles étaient quasi invisibles), carrés de criticité sans ombre.
- **Listes déroulantes étroites** (version d'un paquet, fréquence et relances des règles d'escalade) : le texte n'est plus rogné.
- **Sélecteur de période** (Backup › Activité) : champs date et heure redimensionnés (la date était coupée), icône calendrier visible.
- **Tableaux sans ligne d'en-tête dédiée** (Données › Services) : même en-tête que les autres (petites capitales grises).
- **Légendes de courbes** (min / moyenne / max) : valeur et unité sur une ligne.
- **Règle d'escalade des tickets** : boutons Samedi / Dimanche lisibles (sur deux lignes si la colonne est étroite).
- **Icônes sombres en mode sombre** : Devices SNMP, Assist et Backup Microsoft 365 (tableau des types de plateforme) passent aux traits du thème.
- **Rapports › Personnalisation** : la grille de cartes d'origine (1130 px fixes) suit désormais la largeur disponible au lieu de déborder.

## 1.3.0 — 2026-10-17

Gabarits de page (`95-pages.css`).

- **En-tête d'identité** (nœud, agent) : icône dans une pastille teintée de 52 px, titre en Space Grotesk 24 px, identifiant en pastille à chasse fixe avec icône de copie.
- **Onglets** (Agents actifs / désactivés / Informations / Clients…) : compacts, alignés à gauche, filet de séparation, trait de marque ; plus de largeur minimale de 160 px.
- **En-têtes de tableaux React** : libellé et icônes (filtre, tri) sur **une seule ligne**, icônes discrètes, pleines au survol ; « masquer la colonne » n'apparaît qu'au survol de l'en-tête.
- **Icône Windows** (tableau, fiches) aux couleurs de marque ; Mac, Linux et hyperviseur en gris.

## 1.2.1 — 2026-10-17

- **Fenêtres flottantes** (survol d'un agent, popovers MUI) : carte du thème (bordure, rayon, ombre), séparateurs, icônes grises avec survol de marque ; composants « Typo » de RG (famille portée par des attributs HTML) ramenés sur Inter / Space Grotesk / JetBrains Mono. Réglage fait sans accès au DOM exact de la fenêtre d'agent : à affiner avec son balisage.

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
