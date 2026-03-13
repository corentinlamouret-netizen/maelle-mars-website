# Configuration Admin - Maelle Mars

## 🔐 Sécurité du Dashboard Admin

Le dashboard administrateur est maintenant **protégé** par un système de rôles. Seuls les utilisateurs avec le rôle `admin` peuvent y accéder.

## 👤 Promouvoir un utilisateur en Admin

### Méthode 1: Via la base de données (Recommandée)

1. Accédez au Management UI de votre projet Manus
2. Allez dans l'onglet **Database**
3. Sélectionnez la table `users`
4. Trouvez l'utilisateur que vous souhaitez promouvoir (par email)
5. Modifiez le champ `role` de `user` à `admin`
6. Sauvegardez les modifications

### Méthode 2: Via SQL

Exécutez la commande SQL suivante:

```sql
UPDATE users SET role = 'admin' WHERE email = 'votre.email@example.com';
```

## 🔑 Accès au Dashboard Admin

Une fois promu en admin:

1. Connectez-vous avec votre compte
2. Accédez à `/admin` ou cliquez sur "Dashboard Admin" dans la navigation
3. Le système vérifiera automatiquement votre rôle
4. Si vous n'êtes pas admin, vous verrez un message d'erreur

## 🛡️ Fonctionnalités Admin Actuelles

- ✅ Voir toutes les réservations
- ✅ Voir les réservations par date
- ✅ Bloquer des créneaux horaires
- ✅ Débloquer des créneaux horaires
- ✅ Voir les statistiques mensuelles
- ✅ Voir les statistiques de visiteurs
- ✅ Voir l'historique des paiements PayPal

## 📋 Fonctionnalités Admin à Venir

- [ ] Modifier une réservation existante
- [ ] Annuler une réservation
- [ ] Rechercher une réservation
- [ ] Exporter les réservations en CSV
- [ ] Filtrer les réservations par type de consultation
- [ ] Filtrer les réservations par statut de paiement

## ⚠️ Notes de Sécurité

1. **Authentification OAuth**: Le système utilise l'authentification OAuth Manus
2. **Rôles**: Deux rôles existent: `user` et `admin`
3. **Vérification côté serveur**: Chaque endpoint admin vérifie le rôle côté serveur
4. **Vérification côté client**: Le composant `AdminGuard` protège les routes côté client

## 🔄 Flux d'Authentification Admin

```
1. Utilisateur se connecte via OAuth Manus
2. Système vérifie si l'utilisateur a le rôle 'admin'
3. Si admin: accès au dashboard admin
4. Si user: accès refusé avec message d'erreur
```

## 📞 Support

Si vous avez des questions sur la configuration admin, consultez:
- Documentation tRPC: https://trpc.io/
- Documentation Manus: https://manus.im/
