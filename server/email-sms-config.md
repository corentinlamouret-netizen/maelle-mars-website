# Configuration des services Email et SMS

## 📧 Email SMTP Configuration

### Option 1: Gmail (Recommandé pour démarrer)

1. Activer les "App Passwords" sur votre compte Gmail:
   - Aller à https://myaccount.google.com/apppasswords
   - Sélectionner "Mail" et "Windows Computer"
   - Générer un mot de passe d'application (16 caractères)

2. Ajouter les variables d'environnement:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASSWORD=votre_app_password_16_caracteres
SMTP_FROM=Maelle Mars <votre.email@gmail.com>
```

### Option 2: SendGrid

1. Créer un compte sur https://sendgrid.com
2. Générer une API Key
3. Ajouter les variables d'environnement:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=votre_sendgrid_api_key
SMTP_FROM=Maelle Mars <noreply@votre-domaine.com>
```

### Option 3: Brevo (ex-Sendinblue)

1. Créer un compte sur https://www.brevo.com
2. Générer une clé SMTP
3. Ajouter les variables d'environnement:
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=votre.email@example.com
SMTP_PASSWORD=votre_brevo_smtp_key
SMTP_FROM=Maelle Mars <noreply@votre-domaine.com>
```

## 📱 Twilio SMS Configuration

1. Créer un compte sur https://www.twilio.com
2. Vérifier votre numéro de téléphone
3. Acheter un numéro Twilio (ex: +33 6 XX XX XX XX)
4. Ajouter les variables d'environnement:
```
TWILIO_ACCOUNT_SID=votre_account_sid
TWILIO_AUTH_TOKEN=votre_auth_token
TWILIO_PHONE_NUMBER=+33612345678
MAELLE_PHONE=+33612345678
```

## 🔧 Configuration dans le code

Le fichier `server/mailer.ts` doit être mis à jour pour utiliser les variables d'environnement:

```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
```

Le fichier `server/sms.ts` utilise déjà les variables d'environnement Twilio.

## ✅ Vérification

Après configuration, vous pouvez tester:

1. **Test Email**: Soumettre le formulaire de réservation et vérifier que l'email est reçu
2. **Test SMS**: Vérifier que le SMS est reçu au numéro configuré
3. **Test Webhook PayPal**: Simuler un webhook PayPal pour vérifier que les confirmations sont envoyées

## 💡 Notes importantes

- **Gmail**: Les "App Passwords" ne fonctionnent que si l'authentification 2FA est activée
- **SendGrid**: Vérifier que le domaine d'envoi est configuré dans SendGrid
- **Brevo**: Vérifier que l'email d'envoi est validé
- **Twilio**: Le numéro de téléphone doit être au format international (+33...)
- **Sandbox**: En sandbox, les emails Ethereal et SMS Twilio test continuent de fonctionner
