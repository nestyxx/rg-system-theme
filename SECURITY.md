# Sécurité

## Ce que fait (et ne fait pas) l'extension

- Elle ne s'exécute que sur `https://dashboard.rg-supervision.com/*`.
- Elle ajoute du CSS et un peu de JavaScript d'habillage ; elle **ne lit aucune donnée métier, n'envoie rien, n'appelle aucun service externe** et ne stocke que des préférences d'affichage dans le `localStorage` du site (`rgx.*`).
- Aucune police, aucun script ni aucune image n'est chargé depuis un CDN : tout est embarqué.
- Les permissions demandées sont `scripting` et `activeTab` (panneau de réglages ouvert par un clic sur l'icône) et l'accès au seul domaine ci-dessus.
- L'actualisation automatique des tickets se limite à un clic sur l'entrée « Tickets » du menu ; elle ne déclenche aucune action sur les agents.

## Signaler une vulnérabilité

Merci de **ne pas** ouvrir de ticket public pour un problème de sécurité. Écrivez au mainteneur (adresse affichée sur son profil GitHub) en décrivant le problème et la façon de le reproduire. Une réponse est donnée sous quelques jours ouvrés.

## Données de test

Les captures de pages utilisées pour les tests (`test/fixtures/`) ne sont **jamais versionnées** : elles reproduisent l'interface d'un compte réel. N'en publiez pas, même anonymisées.
