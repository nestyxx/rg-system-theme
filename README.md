# RG System – thème Arobase

> Un habillage moderne, clair et sombre, pour **RG System Suite** : une extension Edge / Chrome qui ne touche
> qu'à l'affichage. Même plateforme, mêmes données, même comportement : une interface cohérente, lisible et agréable.

![RG System avec le thème, clair](docs/img/rg-light.png)

| Thème sombre | Interface d'origine |
|---|---|
| ![Thème sombre](docs/img/rg-dark.png) | ![Interface d'origine](docs/img/rg-original.png) |

*Captures de données fictives (nœuds « CLIENT 01… »). Le projet est un **prototype non officiel** : il n'est ni affilié à l'éditeur de RG System ni approuvé par lui.*

## Ce que ça change

- **Un seul langage visuel** : typographie (Inter, Space Grotesk, JetBrains Mono), couleurs, rayons, ombres, survols, icônes (jeu Lucide), pastilles d'état et formulaires identiques sur tous les écrans, en clair et en sombre.
- **Les écrans de RG repris un à un** : barre latérale, arborescence, tableaux de synthèse, fiche agent, tickets, courbes, configuration, sauvegardes, vulnérabilités, gestion, profil, page de connexion… plus un socle générique (Bootstrap 3 + MUI) pour ce qui n'a pas été vu.
- **Des gains d'usage**, tous côté navigateur :
  - arborescence **redimensionnable librement** (la largeur minimale d'origine est supprimée) ;
  - **actualisation automatique des tickets** qui fonctionne vraiment, sans recharger la plateforme ;
  - **recherche rapide `Ctrl+K`** (nœuds de l'arborescence et pages du menu) ;
  - **texte complet au survol** des libellés tronqués, infobulles sur les actions en simple icône ;
  - panneau de réglages dans l'icône de l'extension : thème, densité, actualisation, largeur de l'arbre ;
  - avatar en initiales, courbes lisibles en sombre, squelettes de chargement.

| Courbes en sombre | Configuration | Connexion |
|---|---|---|
| ![Courbes](docs/img/rg-charts-dark.png) | ![Configuration](docs/img/rg-config-light.png) | ![Connexion](docs/img/rg-login.png) |

La direction visuelle de départ est la maquette [`maquette/direction.html`](maquette/direction.html) (ci-dessous).

![Maquette de référence](docs/img/direction.png)

## Installation (Edge ou Chrome)

1. Télécharger le dernier zip dans les [Releases](../../releases) (ou `npm run build` puis dossier `dist/extension`) et l'**extraire**.
2. Ouvrir `edge://extensions` (ou `chrome://extensions`), activer le **Mode développeur**.
3. **Charger l'extension décompressée** et choisir le dossier extrait.
4. Recharger RG System (Ctrl+F5). La console (F12) affiche `[RG thème Arobase] extension démarrée…`.

À savoir : l'extension est chargée **depuis le dossier** (ne pas le déplacer). Edge peut proposer de désactiver les extensions du mode développeur au démarrage : refuser, ou la réactiver dans `edge://extensions`. Un déploiement à plusieurs passe par le Microsoft Edge Add-ons store ou une stratégie d'entreprise.

## Utilisation

Cliquer sur l'icône de l'extension ouvre le panneau de réglages. Raccourcis :

| Raccourci | Action |
|---|---|
| `Alt+Maj+T` | Clair ↔ sombre (par défaut : suit le réglage du système) |
| `Alt+Maj+D` | Densité des tableaux : confortable ↔ compacte |
| `Ctrl+K` | Recherche rapide : nœuds chargés dans l'arborescence et pages du menu |
| Double-clic sur la poignée de l'arbre | Retour à la largeur d'origine |

Les réglages sont mémorisés dans le `localStorage` du site (`rgx.*`). Interrupteur général (en cas de régression après une mise à jour de RG) : désactiver le thème dans le panneau de l'extension.

## Vie privée et sécurité

- L'extension ne s'exécute **que** sur `https://dashboard.rg-supervision.com/*`.
- **Aucune donnée n'est lue pour être envoyée ailleurs, aucun appel réseau n'est ajouté**, aucune télémétrie. Polices, icônes et CSS sont embarqués : pas de CDN.
- Elle ne modifie ni les URL, ni les requêtes, ni les données : uniquement du CSS et un peu de JavaScript d'affichage.
- Permissions : accès au domaine ci-dessus, plus `scripting` / `activeTab` pour le panneau de réglages.
- Détail et procédure de signalement : [SECURITY.md](SECURITY.md).

## Limites connues

- **Courbes** (canvas dygraphs) : les couleurs des séries sont choisies pour un fond blanc ; en sombre elles sont inversées avec rotation de teinte (reconnaissables, pas identiques).
- **Contenus externes** : le widget « Nouveautés » et l'application Brain sont des applications distinctes, seul leur tiroir est habillé.
- **Fenêtres modales** et quelques états rares (erreurs, confirmations) sont stylés d'après les composants Bootstrap/MUI mais n'ont pas tous été vus en conditions réelles.
- Après une mise à jour de RG System, un écran peut perdre son habillage : voir [Ajouter ou corriger un écran](docs/DEVELOPPEMENT.md#ajouter-ou-corriger-un-écran). Les sélecteurs fragiles sont regroupés en tête de `content.js` (objet `SEL`).

## Pour les développeurs

```bash
npm install
npm run build   # dist/extension/
npm test        # contrôles automatiques (manifest, CSS sans ressource externe, règles sous html[data-rgx], contrastes AA)
npm run serve   # banc de test local : http://localhost:4173/
```

Architecture, ajout d'un écran, banc de test et tests : [docs/DEVELOPPEMENT.md](docs/DEVELOPPEMENT.md).
Contribuer : [CONTRIBUTING.md](CONTRIBUTING.md). Historique : [CHANGELOG.md](CHANGELOG.md).
Pour l'équipe de RG System : [docs/PROPOSITION-RG.md](docs/PROPOSITION-RG.md) (ce que l'éditeur pourrait intégrer nativement).

## Licence et crédits

[MIT](LICENSE) © 2026 Arobase. Polices Inter, Space Grotesk et JetBrains Mono (OFL), tracés d'icônes Lucide (ISC), Tailwind CSS (MIT) : voir [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
« RG System » et « RG System Suite » appartiennent à leur éditeur ; ce projet est un habillage non officiel.
