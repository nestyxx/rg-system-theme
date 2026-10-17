# Propositions : titres, libellés et textes de l'interface

Relevé fait sur le site réel (dashboard RG System Suite), en parcourant 49 pages et en collectant les intitulés
visibles : menus, titres de page, onglets, boutons, en-têtes de colonnes, étiquettes de formulaire, messages de confirmation
(environ 750 libellés distincts). Le thème ne modifie **aucun texte** (le DOM est géré par RG) ; ces points sont des
propositions pour l'équipe produit, classées par intérêt pour l'utilisateur.

## 1. Langue : un seul vocabulaire

| Où | Actuel | Proposé | Pourquoi |
|---|---|---|---|
| Menu | `Backup` | `Sauvegarde` | tout le reste de l'interface dit « Sauvegarde » (onglets, filtres, alertes) |
| Menu | `Cybersecurity` | `Cybersécurité` | le titre de la page et le fil d'Ariane disent déjà « Cybersécurité » / « Vulnérabilités » |
| Menu | `Pedigree` | `Agents` (ou `Fiche agents`) | terme peu parlant pour un nouvel utilisateur ; la page est l'inventaire des agents |
| Menu | `Gestion` + pastille `New` | idem | la pastille reste affichée en permanence, elle devrait disparaître après la première visite |
| Bouton de fenêtre | `Close` | `Fermer` | seul bouton de fermeture en anglais |
| Pagination d'un composant | `prev` / `next` | `Précédent` / `Suivant` | « Précédent » et « Suivant » existent déjà ailleurs dans l'interface |
| Libellé technique visible | `run` | `Exécuter` | idem |
| Types de message | `Information` · `Warning` · `Danger` | `Information` · `Avertissement` · `Erreur` | `Warning` / `Danger` sont des noms de classes CSS |
| Boutons d'en-tête | `chat-toggler`, `Menu`, `False` | `Messagerie`, `Menu principal`, supprimer | libellés d'accessibilité techniques exposés aux lecteurs d'écran |
| Titres de page | `APP MANAGER`, `CUSTOM SCRIPTS`, `JOBS` | `Gestion des applications`, `Scripts personnalisés`, `Tâches de sauvegarde` | seuls titres en anglais |
| Catalogue de modèles | `Disk 1 status (1 is OK)`, `Black toner`, `Battery fault - Yes(1)`… | traduire ou garder l'OID en info secondaire | des centaines d'entrées en anglais dans une interface française |

## 2. Orthographe et accents

| Actuel | Proposé |
|---|---|
| `Etat des MAJ` (onglet Windows Update) | `État des mises à jour` (« MAJ » est une abréviation, l'onglet a la place) |
| `Etat de Interface 1` (modèles) | `État de l'interface 1` |
| `Editeur` (inventaire logiciel) | `Éditeur` (« Éditeur de registre » est correct ailleurs) |
| `A la demande` | `À la demande` |
| `INVENTAIRE LOGICIELS` | `Inventaire logiciel` |
| `Information sur les valeurs d'échelles de volume de données` | `…d'échelle…` |
| `Nombre de connexions TCP (ESTABLISHED or CLOSE- WAIT)` | espace parasite dans `CLOSE-WAIT` ; mélange français / anglais |
| `Je suis sûr de vouloir supprimer cet événement` | `Supprimer cet événement ?` (question + boutons « Supprimer » / « Annuler ») |

## 3. Cohérence grammaticale et de casse

- **« template » : masculin et féminin mélangés.** On trouve « Ce template de device », « Appliquer un template » mais
  aussi « Appliquer la template », « Lier la template », « Délier la template », « Utiliser la template ». Choisir un
  genre (masculin, comme « modèle ») ou utiliser **« modèle »**, plus clair pour des utilisateurs francophones.
- **Singulier / pluriel :** `TICKETS UTILISATEUR` et `TICKETS UTILISATEURS` pour deux écrans voisins.
- **Casse des titres :** `Windows update`, `WINDOWS UPDATE`, `Windows Update` selon l'écran ; `ÉVÉNEMENTS`, `Événements`,
  `Événement`. Les titres en capitales sont ici une mise en forme CSS : le texte lui-même devrait toujours être
  en casse de phrase (`Windows Update`).
- **Unités :** `KiB` / `GiB` dans les tableaux, `Kio` dans certaines légendes. Garder une seule famille (`Kio` /
  `Gio` en français, ou `KiB` / `GiB`).
- **Identifiants :** `ID`, `Id`, `Id de la mise à jour`, `ID Agent` : choisir `ID`.
- **Création / ajout :** `Créer un Token API` et `Token d'API` ; `Ajouter` / `Créer` utilisés pour la même action selon l'écran.

## 4. Clarté des actions

| Où | Actuel | Constat | Proposé |
|---|---|---|---|
| Tickets | `Clôturer tout` (bouton rouge) | ambigu : tout quoi ? tous les tickets du nœud ? de ses enfants ? | `Clôturer les N tickets affichés`, avec confirmation indiquant le périmètre |
| Graphiques | `Jour > Semaine` / `Mois > Année` | le signe « > » ne dit pas qu'il s'agit de la période affichée | `Période : jour / semaine` et `Période : mois / année`, bouton actif distinct |
| Tickets | `Actualisation auto` | ne dit pas à quelle fréquence | afficher la fréquence (le thème affiche désormais un compte à rebours) |
| Fiche agent | `Promouvoir en serveur` | l'effet et sa réversibilité ne sont pas indiqués | infobulle : « Traite cet agent comme un serveur (alertes, quotas). Réversible. » |
| Fiche agent | `Désactiver cet agent` | confusion possible avec « Arrêter » ou « Redémarrer » | `Désactiver la supervision de cet agent` |
| Configuration | `OnOff OnOff Antivirus Hérite de : Nœud …` | le préfixe technique `OnOff` est affiché et dupliqué | `Antivirus` + mention `Hérité du nœud …` en texte secondaire |

## 5. Messages vides et états

- Les listes vides disent « Aucun résultat trouvé », « Il n'y a pas de tickets », « Aucune réplication » : proposer une
  phrase d'aide (« Aucun ticket actif sur ce nœud. Modifiez les filtres pour voir les tickets fermés. »).
- `Réussies (sur 0)` (page Jobs) : afficher « Aucune sauvegarde sur la période » plutôt qu'un total à zéro.
- Les pages qui restent sur l'animation de chargement sans fin (hyperviseur, restauration d'un hyperviseur) devraient
  afficher un message au bout de quelques secondes (« Aucune donnée pour ce nœud » ou « Chargement trop long »).

## 6. Pour aller plus loin

- **Fil d'Ariane :** le nom de la page (en capitales) puis le chemin du nœud sont séparés par `/`. Une icône
  distincte (dossier / ordinateur) pour chaque niveau aiderait à repérer les agents parmi les clients.
- **Aide contextuelle :** le panneau « Aide » de certaines pages (Gestion des applications, Assist) est un bon modèle ;
  il pourrait être généralisé avec un lien « Documentation » par page.
- **Libellés de menu :** le thème ajoute désormais une infobulle au menu (« Pedigree — fiche et inventaire des agents
  du nœud »), utile en particulier quand le menu est réduit en icônes. Les mêmes textes pourraient devenir des
  sous-titres natifs.
