# Tâches restantes pour finaliser le site Maelle Mars

## État actuel du projet
Le site est **fonctionnel à 85%** avec les éléments suivants complétés :
- ✅ Design galactique mystique avec animations
- ✅ 6 pages principales (Accueil, À Propos, Consultations, Témoignages, Événements, Contact)
- ✅ Système complet de réservation avec 4 types de consultations
- ✅ Validation stricte des données (téléphone, email, adresse)
- ✅ Intégration PayPal pour les paiements
- ✅ Tableau de bord administrateur avec calendrier
- ✅ Système de blocage de créneaux
- ✅ Statistiques mensuelles (réservations, revenus, visiteurs)

---

## 🔴 TÂCHES CRITIQUES (Bloquantes)

### 1. **Finaliser le flux de paiement PayPal → Réservation**
**Priorité:** CRITIQUE  
**Description:** Actuellement, après le paiement PayPal, le système ne crée pas automatiquement la réservation en base de données.

**À faire:**
- [ ] Implémenter le webhook PayPal pour capturer la confirmation de paiement
- [ ] Créer l'endpoint `/api/paypal/webhook` pour recevoir les notifications PayPal
- [ ] Valider la signature du webhook PayPal
- [ ] Créer automatiquement la réservation en BD après paiement validé
- [ ] Envoyer les emails de confirmation au client et à Maelle
- [ ] Envoyer les SMS de confirmation (si Twilio est en production)
- [ ] Rediriger vers la page de confirmation avec les détails de la réservation
- [ ] Tester le flux complet: sélection → formulaire → paiement → confirmation

**Fichiers concernés:**
- `server/routers.ts` - Ajouter endpoint webhook
- `server/db.ts` - Fonction pour créer réservation après paiement
- `client/src/pages/booking/Payment.tsx` - Gérer la redirection post-paiement

---

### 2. **Intégrer les services de notification réels**
**Priorité:** CRITIQUE  
**Description:** Les emails et SMS utilisent actuellement des services de test (Ethereal, Twilio sandbox).

**À faire:**
- [ ] Configurer Nodemailer avec un vrai service SMTP (Gmail, SendGrid, Brevo, etc.)
- [ ] Configurer Twilio avec des credentials réels (pas sandbox)
- [ ] Tester l'envoi d'email de confirmation au client
- [ ] Tester l'envoi d'email de notification à Maelle
- [ ] Tester l'envoi de SMS de confirmation au client
- [ ] Tester l'envoi de SMS de notification à Maelle
- [ ] Vérifier que les templates d'email sont correctement formatés
- [ ] Vérifier que les numéros de téléphone sont correctement sauvegardés

**Fichiers concernés:**
- `server/mailer.ts` - Configuration SMTP
- `server/sms.ts` - Configuration Twilio
- `server/routers.ts` - Endpoints d'envoi

---

### 3. **Tester le flux de réservation complet**
**Priorité:** CRITIQUE  
**Description:** Valider que tout fonctionne de bout en bout.

**À faire:**
- [ ] Tester: sélection type consultation → formulaire → sélection créneau → paiement → confirmation
- [ ] Vérifier que la réservation est créée en BD
- [ ] Vérifier que les emails sont envoyés
- [ ] Vérifier que les SMS sont envoyés
- [ ] Vérifier que le calendrier admin affiche la nouvelle réservation
- [ ] Tester avec plusieurs réservations simultanées
- [ ] Tester la détection de conflits de créneaux
- [ ] Tester le blocage de créneaux par l'admin

---

## 🟡 TÂCHES IMPORTANTES (Non-bloquantes mais essentielles)

### 4. **Améliorer l'interface administrateur**
**Priorité:** HAUTE  
**Description:** Le dashboard admin fonctionne mais manque de fonctionnalités.

**À faire:**
- [ ] Ajouter la possibilité de **modifier une réservation existante**
- [ ] Ajouter la possibilité d'**annuler une réservation**
- [ ] Ajouter un **formulaire de recherche** pour trouver une réservation
- [ ] Afficher les **détails complets** d'une réservation (adresse, email, téléphone)
- [ ] Ajouter une **liste des paiements non confirmés** (en attente)
- [ ] Ajouter un **export CSV** des réservations du mois
- [ ] Ajouter des **filtres** (par date, par type de consultation, par statut)
- [ ] Ajouter une **notification visuelle** quand une nouvelle réservation arrive

**Fichiers concernés:**
- `client/src/pages/admin/Calendar.tsx`
- `client/src/pages/admin/Stats.tsx`
- `client/src/pages/admin/PaymentHistory.tsx`
- `server/routers.ts` - Nouveaux endpoints

---

### 5. **Configurer les emails de production**
**Priorité:** HAUTE  
**Description:** Les templates d'email doivent être professionnels et en français.

**À faire:**
- [ ] Créer un template HTML professionnel pour l'email de confirmation client
- [ ] Créer un template HTML professionnel pour l'email de notification Maelle
- [ ] Ajouter le logo de Maelle dans les emails
- [ ] Ajouter un lien pour **annuler la réservation** dans l'email
- [ ] Ajouter un lien pour **modifier la réservation** dans l'email
- [ ] Tester que les emails s'affichent correctement sur mobile
- [ ] Ajouter un **pied de page** avec les coordonnées de Maelle
- [ ] Ajouter des **liens sociaux** (Instagram, Facebook) dans les emails

**Fichiers concernés:**
- `server/mailer.ts` - Templates d'email

---

### 6. **Sécuriser l'accès administrateur**
**Priorité:** HAUTE  
**Description:** N'importe qui peut accéder au dashboard admin actuellement.

**À faire:**
- [ ] Ajouter une **authentification admin** (login/mot de passe ou OAuth)
- [ ] Créer une page de **login admin**
- [ ] Protéger les routes admin avec un middleware d'authentification
- [ ] Ajouter une **session sécurisée** pour l'admin
- [ ] Implémenter un **système de rôles** (admin, user)
- [ ] Ajouter un **logout button** dans le dashboard admin
- [ ] Tester que les utilisateurs non-authentifiés ne peuvent pas accéder

**Fichiers concernés:**
- `server/routers.ts` - Middleware d'authentification
- `client/src/pages/admin/` - Pages protégées
- `client/src/App.tsx` - Routes protégées

---

## 🟢 TÂCHES OPTIONNELLES (Améliorations)

### 7. **Ajouter un système de confirmation de réservation**
**Priorité:** MOYENNE  
**Description:** Permettre au client de confirmer sa réservation par email.

**À faire:**
- [ ] Générer un **token unique** pour chaque réservation
- [ ] Envoyer un **lien de confirmation** dans l'email
- [ ] Créer une page `/booking/confirm/:token` pour confirmer
- [ ] Marquer la réservation comme **confirmée** en BD
- [ ] Envoyer un rappel 24h avant la consultation

---

### 8. **Ajouter un système de rappel automatique**
**Priorité:** MOYENNE  
**Description:** Envoyer des rappels aux clients avant leur consultation.

**À faire:**
- [ ] Créer un **job cron** qui s'exécute tous les jours
- [ ] Trouver les réservations de demain
- [ ] Envoyer un **email de rappel** au client
- [ ] Envoyer un **SMS de rappel** au client
- [ ] Envoyer un **email de rappel** à Maelle

---

### 9. **Ajouter un système d'avis/commentaires**
**Priorité:** BASSE  
**Description:** Permettre aux clients de laisser un avis après leur consultation.

**À faire:**
- [ ] Créer une table `reviews` en BD
- [ ] Ajouter un **formulaire d'avis** accessible après la consultation
- [ ] Afficher les **avis vérifiés** sur la page Témoignages
- [ ] Ajouter une **notation par étoiles**
- [ ] Modérer les avis avant publication

---

### 10. **Optimiser les performances**
**Priorité:** BASSE  
**Description:** Le site fonctionne mais peut être optimisé.

**À faire:**
- [ ] Ajouter un **cache** pour les pages statiques
- [ ] Optimiser les **images** (compression, lazy loading)
- [ ] Ajouter un **CDN** pour les assets
- [ ] Minifier le CSS et JavaScript
- [ ] Ajouter un **service worker** pour le mode offline

---

## 📋 RÉSUMÉ DES PRIORITÉS

| Tâche | Priorité | Effort | Impact |
|-------|----------|--------|--------|
| Finaliser flux PayPal → Réservation | 🔴 CRITIQUE | 4h | Bloquant |
| Intégrer services réels (Email/SMS) | 🔴 CRITIQUE | 2h | Bloquant |
| Tester flux complet | 🔴 CRITIQUE | 3h | Bloquant |
| Sécuriser accès admin | 🟡 HAUTE | 3h | Essentiel |
| Améliorer interface admin | 🟡 HAUTE | 5h | Essentiel |
| Configurer emails production | 🟡 HAUTE | 2h | Essentiel |
| Confirmation de réservation | 🟢 MOYENNE | 2h | Optionnel |
| Rappels automatiques | 🟢 MOYENNE | 3h | Optionnel |
| Système d'avis | 🟢 BASSE | 3h | Optionnel |
| Optimiser performances | 🟢 BASSE | 2h | Optionnel |

---

## 🚀 PLAN D'ACTION RECOMMANDÉ

**Phase 1 (Jour 1) - Rendre le site fonctionnel:**
1. Finaliser le flux PayPal → Réservation (4h)
2. Intégrer services réels Email/SMS (2h)
3. Tester flux complet (3h)

**Phase 2 (Jour 2) - Sécuriser et améliorer:**
4. Sécuriser accès admin (3h)
5. Améliorer interface admin (5h)

**Phase 3 (Optionnel) - Polir et optimiser:**
6. Configurer emails production (2h)
7. Ajouter confirmations et rappels (5h)
8. Optimiser performances (2h)

---

## 📞 CONTACT POUR CONFIGURATION

Pour finaliser le site, vous aurez besoin de:
- **Email SMTP:** Credentials pour envoyer les emails (Gmail, SendGrid, Brevo, etc.)
- **Twilio:** Credentials réels pour les SMS
- **PayPal:** Webhook URL configurée dans le dashboard PayPal
- **Admin login:** Décider du système d'authentification (email/mot de passe ou OAuth)
