# Sécurité

## Ce que fait (et ne fait pas) l'extension

- Elle ne s'exécute que sur `https://dashboard.rg-supervision.com/*`.
- Elle ajoute du CSS et un peu de JavaScript d'habillage ; elle **ne lit aucune donnée métier (sauf la liste des tickets si vous activez les notifications), n'envoie rien, n'appelle aucun service externe** et ne stocke que des préférences d'affichage dans le `localStorage` du site (`rgx.*`).
- Aucune police, aucun script ni aucune image n'est chargé depuis un CDN : tout est embarqué.
- Les permissions demandées sont `scripting` et `activeTab` (panneau de réglages ouvert par un clic sur l'icône), `notifications` (notifications de tickets, désactivées par défaut) et l'accès au seul domaine ci-dessus.
- Le service worker (`background.js`) ne fait aucun appel réseau et n'accepte que les messages de notre propre script de contenu ; les liens ouverts au clic sont limités à la forme `#/node/<id>/page/<page>`.
- Avec les notifications activées, le script de contenu envoie, toutes les 60 s, la requête que RG envoie lui-même pour afficher les tickets, et mémorise dans le `localStorage` du site la liste (numéro, titre, nœud, agent, criticité, relances) pour détecter les changements.
- L'actualisation automatique des tickets se limite à un clic sur l'entrée « Tickets » du menu ; elle ne déclenche aucune action sur les agents.

## Signaler une vulnérabilité

Merci de **ne pas** ouvrir de ticket public pour un problème de sécurité. Utilisez le signalement privé de GitHub : onglet **Security** → **Report a vulnerability**, en décrivant le problème et la façon de le reproduire. Une réponse est donnée sous quelques jours ouvrés.

## Données de test

Les captures de pages utilisées pour les tests (`test/fixtures/`) ne sont **jamais versionnées** : elles reproduisent l'interface d'un compte réel. N'en publiez pas, même anonymisées.
