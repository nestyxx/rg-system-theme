# Contribuer

Merci de votre intérêt. Le projet est un habillage **côté navigateur** : il ne modifie jamais le comportement, les URL ni les données de RG System.

## Avant de commencer

```bash
npm install
npm run build      # dist/extension/
npm test           # contrôles automatiques
npm run serve      # banc de test : http://localhost:4173/
```

Chargez `dist/extension` dans `edge://extensions` (mode développeur → « Charger l'extension décompressée »).

## Règles

1. **Aucune donnée réelle** dans une contribution : pas de capture de page non anonymisée, pas de nom de client ou de personne, pas d'adresse, pas de numéro de série. `test/fixtures/` est ignoré par Git, ne l'ajoutez pas.
2. **Tout le CSS est sous `html[data-rgx]`** (test automatique) et utilise les variables `--rgx-*` : le thème sombre suit alors tout seul.
3. **Sélecteurs stables** : ids, classes Bootstrap 3, classes MUI `Mui*-root`, ou le *nom* d'un composant styled-components (`[class*="Card__Layout-sc"]`). Jamais les classes à hash.
4. Un écran corrigé = vérifié **en clair et en sombre** (`?theme=dark` sur le banc de test) et le texte reste lisible (contraste ≥ 4,5:1 pour les jetons).
5. `npm test` doit rester vert. Incrémentez la version de `package.json` et complétez `CHANGELOG.md` pour tout changement visible.

Le détail de l'architecture et la marche à suivre pour ajouter un écran sont dans [`docs/DEVELOPPEMENT.md`](docs/DEVELOPPEMENT.md).

## Signaler un défaut d'affichage

Utilisez le modèle « Écran mal habillé » : page concernée (menu ou route), thème (clair / sombre), capture **sans donnée sensible**, et si possible le sélecteur du composant fautif (F12).
