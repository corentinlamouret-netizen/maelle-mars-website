# Guide de Test Complet - Maelle Mars

Ce guide vous aide à tester tous les aspects du site web de Maelle Mars.

## 🧪 Tests Unitaires

Exécutez les tests vitest pour valider la logique métier :

```bash
npm test
```

Tests inclus :
- Validation des emails
- Validation des téléphones
- Validation des adresses
- Création de réservations
- Modification de réservations
- Annulation de réservations
- Recherche de réservations
- Gestion des créneaux bloqués

## 🌐 Tests du Flux de Réservation Complet

### 1. Test de Création de Réservation

**Étapes :**
1. Accédez à la page "Consultations"
2. Sélectionnez un type de consultation (ex: 30 minutes)
3. Remplissez le formulaire avec :
   - Prénom : Jean
   - Nom : Dupont
   - Email : jean.dupont@example.com
   - Téléphone : 06 12 34 56 78
   - Rue : 123 Rue de la Paix
   - Code postal : 75000
   - Ville : Paris
4. Sélectionnez une date et une heure disponibles
5. Cochez les cases de consentement
6. Cliquez sur "Prendre rendez-vous"

**Résultat attendu :**
- Redirection vers la page de paiement PayPal
- Affichage du montant correct

### 2. Test de Paiement PayPal

**Étapes :**
1. Cliquez sur "Payer avec PayPal"
2. Connectez-vous à PayPal (compte test)
3. Approuvez le paiement
4. Attendez la redirection

**Résultat attendu :**
- Redirection vers la page de confirmation
- Affichage des détails de la réservation
- Email de confirmation reçu
- SMS de confirmation reçu (si Twilio est configuré)

### 3. Test de Validation des Données

**Téléphone invalide :**
- Essayez "6" → Erreur : "Téléphone invalide"
- Essayez "06 123" → Erreur : "Téléphone invalide"
- Essayez "06 12 34 56 78" → Accepté ✓

**Email invalide :**
- Essayez "notanemail" → Erreur : "Email invalide"
- Essayez "test@example.com" → Accepté ✓

**Adresse invalide :**
- Essayez "123" → Erreur : "Adresse doit contenir au moins 10 caractères"
- Essayez "123 Rue de la Paix, 75000 Paris" → Accepté ✓

**Adresse aléatoire :**
- Essayez "hgcjcjgcfhgchktchj,cg" → Erreur : "Adresse invalide"
- Essayez "35 Avenue Robert Emm, 66100 Perpignan" → Accepté ✓

### 4. Test de Validation d'Adresse avec Nominatim

**Étapes :**
1. Entrez une rue partielle : "35 Avenue Robert"
2. Entrez le code postal : "66100"
3. Entrez la ville : "Perpignan"
4. Attendez la validation automatique

**Résultat attendu :**
- L'adresse complète s'affiche : "35 Avenue Robert Emm, 66100 Perpignan"
- Validation réussie ✓

### 5. Test du Dashboard Admin

**Accès :**
1. Connectez-vous avec un compte admin
2. Accédez à `/admin`

**Vérifications :**
- ✓ Voir toutes les réservations
- ✓ Voir les réservations par date
- ✓ Voir les statistiques mensuelles
- ✓ Voir l'historique des paiements
- ✓ Bloquer/débloquer des créneaux

**Fonctionnalités de gestion :**
- ✓ Modifier une réservation
- ✓ Annuler une réservation
- ✓ Rechercher par email
- ✓ Rechercher par nom
- ✓ Rechercher par plage de dates
- ✓ Exporter en CSV

### 6. Test des Emails

**Configuration pour les tests :**

Pour Gmail :
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASSWORD=votre_app_password
```

Pour SendGrid :
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=votre_sendgrid_api_key
```

**Tests :**
1. Créez une réservation
2. Vérifiez que l'email de confirmation est reçu
3. Vérifiez le format HTML du template
4. Vérifiez les informations affichées

### 7. Test des SMS

**Configuration :**
```
TWILIO_ACCOUNT_SID=votre_account_sid
TWILIO_AUTH_TOKEN=votre_auth_token
TWILIO_PHONE_NUMBER=+33612345678
MAELLE_PHONE=+33612345678
```

**Tests :**
1. Créez une réservation avec "Recevoir les mises à jour"
2. Vérifiez que le SMS de confirmation est reçu
3. Vérifiez le contenu du SMS

### 8. Test du Webhook PayPal

**Simulation :**
1. Accédez à la console PayPal Developer
2. Allez dans "Webhooks"
3. Sélectionnez votre endpoint
4. Cliquez sur "Send a test event"
5. Sélectionnez "PAYMENT.CAPTURE.COMPLETED"
6. Cliquez sur "Send"

**Vérifications :**
- ✓ Le statut de paiement est mis à jour
- ✓ Les emails de confirmation sont envoyés
- ✓ Les SMS de confirmation sont envoyés

## 📋 Checklist de Test Complet

- [ ] Création de réservation avec validation
- [ ] Paiement PayPal
- [ ] Email de confirmation reçu
- [ ] SMS de confirmation reçu
- [ ] Dashboard admin accessible
- [ ] Modification de réservation
- [ ] Annulation de réservation
- [ ] Recherche de réservation
- [ ] Export CSV
- [ ] Blocage de créneaux
- [ ] Déblocage de créneaux
- [ ] Webhook PayPal fonctionnel

## 🐛 Dépannage

### Les emails ne sont pas envoyés
1. Vérifiez les variables d'environnement SMTP
2. Vérifiez les logs du serveur
3. Testez avec Ethereal en sandbox

### Les SMS ne sont pas envoyés
1. Vérifiez les variables d'environnement Twilio
2. Vérifiez que le numéro de téléphone est au format international
3. Testez avec Twilio sandbox

### Le webhook PayPal ne fonctionne pas
1. Vérifiez que l'URL du webhook est correcte
2. Vérifiez les logs du serveur
3. Testez avec un événement de test PayPal

## 📞 Support

Pour toute question, consultez :
- Documentation PayPal : https://developer.paypal.com/
- Documentation Twilio : https://www.twilio.com/docs/
- Documentation Nominatim : https://nominatim.org/
