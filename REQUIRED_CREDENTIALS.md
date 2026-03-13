# 📋 Éléments à Fournir pour la Production

## 🔐 CREDENTIALS & CLÉS API (Obligatoires)

### 1. **PayPal**
**Pourquoi :** Traiter les paiements des réservations

**À fournir :**
- Client ID PayPal (mode production)
- Client Secret PayPal (mode production)
- Webhook ID PayPal (pour les notifications de paiement)

**Où obtenir :** https://developer.paypal.com/dashboard/

**Format attendu :**
```
PAYPAL_CLIENT_ID=AZ...
PAYPAL_CLIENT_SECRET=EG...
PAYPAL_WEBHOOK_ID=WH...
```

---

### 2. **Google Maps API**
**Pourquoi :** Afficher les lieux des événements sur une carte interactive

**À fournir :**
- Clé API Google Maps (avec Places, Geocoding, Maps JavaScript API activées)

**Où obtenir :** https://console.cloud.google.com/

**Format attendu :**
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

**Coût :** ~$0.007 par requête (gratuit les 100 premiers)

---

### 3. **Email SMTP**
**Pourquoi :** Envoyer les confirmations de réservation et les notifications

**Choisir une option :**

#### **Option A : Gmail (Gratuit)**
- Email Gmail : votre.email@gmail.com
- Mot de passe d'application Gmail (généré dans les paramètres de sécurité)

#### **Option B : SendGrid (Recommandé - $20/mois)**
- API Key SendGrid
- Email d'expédition (peut être différent de votre email)

#### **Option C : Brevo (Gratuit jusqu'à 300 emails/jour)**
- API Key Brevo
- Email d'expédition

**Format attendu :**
```
SMTP_HOST=smtp.gmail.com (ou smtp.sendgrid.net, etc.)
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASSWORD=votre_mot_de_passe_app
SMTP_FROM_EMAIL=noreply@maellemars.com
SMTP_FROM_NAME=Maelle Mars
```

---

### 4. **Twilio SMS**
**Pourquoi :** Envoyer les confirmations par SMS aux clients

**À fournir :**
- Account SID Twilio
- Auth Token Twilio
- Numéro de téléphone Twilio (pour l'envoi)

**Où obtenir :** https://www.twilio.com/console

**Format attendu :**
```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+33...
```

**Coût :** ~€0.08 par SMS en France

---

## 📝 CONTENU & TEXTES (Obligatoires)

### 5. **Informations Personnelles**
- Votre nom complet (Maelle Mars)
- Votre biographie professionnelle (200-300 mots)
- Votre photo professionnelle (haute résolution, format portrait)
- Vos coordonnées de contact (téléphone, email)
- Votre adresse physique (pour les événements)

---

### 6. **Services & Tarifs**
**Pour chaque type de consultation :**
- Nom du service (ex: "Consultation Clairvoyance")
- Description détaillée (100-200 mots)
- Durée (en minutes)
- Prix (en euros)
- Nombre de places disponibles (si événement)

**Exemple :**
```
Consultation Clairvoyance
Durée : 30 minutes
Prix : 50€
Description : Une consultation personnalisée pour recevoir des messages...
```

---

### 7. **Événements à Venir**
**Pour chaque événement :**
- Titre de l'événement
- Date et heure de début
- Date et heure de fin
- Lieu complet (rue, code postal, ville)
- Coordonnées GPS (latitude, longitude) - optionnel, je peux les récupérer
- Description de l'événement (200-300 mots)
- Nombre de places disponibles
- Prix d'entrée

**Exemple :**
```
Titre : Conférence Spirituelle - Perpignan
Date : 13 juin 2026, 14:00-17:00
Lieu : 35 Avenue Robert Emmanuelle Brousse, 66100 Perpignan
Places : 50
Prix : 25€
Description : Une conférence inspirante sur...
```

---

### 8. **Conditions Légales**
- Conditions d'utilisation (texte complet)
- Politique de confidentialité (RGPD compliant)
- Politique de remboursement
- Mentions légales (SIRET, adresse, responsable légal)

---

## 🎨 ASSETS VISUELS (Recommandés)

### 9. **Images**
- Logo Maelle Mars (PNG transparent, 500x500px minimum)
- Photo de profil (1200x1200px minimum, portrait)
- Images de fond pour les pages (2000x2000px minimum)
- Photos des lieux d'événements (si disponibles)
- Icônes personnalisées (optionnel)

**Format :** JPG ou PNG optimisés

---

### 10. **Couleurs & Design**
- Palette de couleurs préférée (codes HEX)
  - Couleur primaire (ex: #D4AF37 pour or)
  - Couleur secondaire
  - Couleur d'accent
- Police de caractères préférée (Google Fonts)
- Style général (mystique, moderne, épuré, etc.)

---

## 📊 CONFIGURATION MÉTIER

### 11. **Horaires & Disponibilités**
- Jours d'ouverture (lundi-dimanche)
- Heures d'ouverture (ex: 10:00-19:00)
- Jours de fermeture (vacances, jours fériés)
- Délai de réservation minimum (ex: 48h avant)

---

### 12. **Paramètres de Paiement**
- Devise (EUR)
- Taxes/TVA applicables (si applicable)
- Frais de transaction à ajouter (optionnel)
- Conditions de remboursement (délai, conditions)

---

### 13. **Notifications**
- Email de réception des réservations : votre.email@gmail.com
- Email pour les notifications admin : admin@maellemars.com
- Numéro de téléphone pour les SMS (le vôtre)

---

## 🔗 DOMAINE & HÉBERGEMENT

### 14. **Domaine Personnalisé (Optionnel)**
- Domaine déjà acheté ? (ex: maellemars.com)
- Registrar (GoDaddy, OVH, etc.)
- Accès aux paramètres DNS

**Si pas de domaine :** Je peux vous aider à en acheter un directement dans Manus

---

## 📱 RÉSEAUX SOCIAUX (Optionnel)

### 15. **Liens Réseaux Sociaux**
- Facebook URL
- Instagram URL
- LinkedIn URL
- TikTok URL
- YouTube URL

---

## 📋 CHECKLIST DE COLLECTE

Avant de me fournir les informations :

**Credentials (Priorité 1 - Bloquant) :**
- [ ] PayPal Client ID & Secret
- [ ] Google Maps API Key
- [ ] Email SMTP (Gmail/SendGrid/Brevo)
- [ ] Twilio Account SID & Auth Token

**Contenu (Priorité 2 - Important) :**
- [ ] Biographie professionnelle
- [ ] Description des services avec tarifs
- [ ] Événements à venir (dates, lieux, prix)
- [ ] Conditions légales & politique de confidentialité

**Visuels (Priorité 3 - Recommandé) :**
- [ ] Photo professionnelle
- [ ] Logo (si disponible)
- [ ] Palette de couleurs

**Configuration (Priorité 4 - Optionnel) :**
- [ ] Horaires & disponibilités
- [ ] Domaine personnalisé
- [ ] Réseaux sociaux

---

## 🚀 PROCESSUS DE FOURNITURE

### **Étape 1 : Credentials**
Envoyez-moi les credentials via le Management UI (Secrets panel) :
1. Allez dans Settings → Secrets
2. Remplissez chaque champ avec la valeur correspondante
3. Je validerai que tout fonctionne

### **Étape 2 : Contenu**
Envoyez-moi un document Word/Google Docs avec :
- Biographie
- Services & tarifs
- Événements
- Textes légaux

### **Étape 3 : Images**
Uploadez les images via le Management UI ou envoyez-les par email

### **Étape 4 : Test**
Je testerai le flux complet avec vos données réelles

### **Étape 5 : Publication**
Cliquez sur "Publish" dans le Management UI

---

## 💡 CONSEILS

**Pour les credentials :**
- Utilisez des mots de passe forts
- Activez l'authentification à deux facteurs sur vos comptes
- Ne partagez jamais vos secrets en clair (utilisez le panel Secrets de Manus)

**Pour le contenu :**
- Soyez descriptif et authentique
- Utilisez un ton professionnel mais accessible
- Incluez des appels à l'action clairs

**Pour les images :**
- Utilisez des images de haute qualité
- Optimisez la taille (< 500KB par image)
- Utilisez des formats modernes (WebP si possible)

---

## 📞 BESOIN D'AIDE ?

Si vous avez des questions sur comment obtenir une clé API ou configurer un service :
1. Consultez les liens fournis ci-dessus
2. Regardez les tutoriels officiels
3. Demandez-moi de vous guider pas à pas

**Estimation du temps pour collecter tout :** 2-4 heures
