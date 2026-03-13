# Déploiement sur Railway

## Étapes pour déployer votre site sur Railway

### 1. Créer un compte Railway
- Allez sur https://railway.app
- Connectez-vous avec GitHub (recommandé)

### 2. Créer un nouveau projet
- Cliquez sur "New Project"
- Sélectionnez "Deploy from GitHub"
- Autorisez Railway à accéder à vos repositories GitHub

### 3. Sélectionner votre repository
- Cherchez `maelle-mars-website`
- Cliquez sur "Deploy"

### 4. Configurer les variables d'environnement
Une fois le projet créé, allez dans **Variables** et ajoutez :

```
DATABASE_URL=postgresql://postgres:1d5443cb-9c56-42a8-8c04-e06ddfba787b@rjricksnlzxvtuiywkkd.pooler.supabase.com:6543/postgres?pgbouncer=true
JWT_SECRET=your-jwt-secret-here
VITE_APP_ID=your-vite-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Maëlle Mars
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@maellemars.com
MAELLE_EMAIL=maellemars@gmail.com
```

### 5. Déploiement automatique
- Railway déploiera automatiquement chaque fois que vous poussez du code vers GitHub
- Vous pouvez voir les logs en temps réel dans le dashboard Railway

### 6. Domaine personnalisé
- Dans Railway, allez dans **Settings** → **Domains**
- Ajoutez votre domaine personnalisé (ex: maellemars.com)
- Configurez les DNS records selon les instructions de Railway

## Dépannage

### Erreur de connexion à Supabase
- Vérifiez que `DATABASE_URL` utilise le port 6543 (Transaction Pooler)
- Vérifiez que le mot de passe est correct

### Erreur de build
- Vérifiez que `pnpm install` fonctionne localement
- Vérifiez que `pnpm build` fonctionne localement

### Logs en temps réel
- Dans Railway, cliquez sur votre service
- Allez dans **Logs** pour voir les erreurs en temps réel
