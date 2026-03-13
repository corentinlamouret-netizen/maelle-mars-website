- [x] Ajouter validation stricte du téléphone (format français)
- [x] Ajouter validation stricte de l'email
- [x] Ajouter validation stricte de l'adresse (minimum 10 caractères)
- [x] Ajouter validation côté serveur dans les endpoints
- [x] Tester les validations du formulaire
- [x] Séparer le champ adresse en rue, code postal et ville
- [x] Intégrer API de géolocalisation (Google Maps ou Nominatim)
- [x] Ajouter autocomplétion pour les adresses
- [x] Valider que l'adresse existe réellement
- [x] Tester avec l'adresse Perpignan (66100, 35 Avenue Robert Emm...)

## TÂCHES CRITIQUES

- [x] Finaliser le flux PayPal → Réservation avec webhook
- [x] Implémenter l'endpoint webhook PayPal
- [x] Créer la réservation automatiquement après paiement validé
- [x] Envoyer les confirmations email/SMS après paiement
- [x] Rediriger vers la page de confirmation
- [x] Tester le flux complet de paiement

## TÂCHES IMPORTANTES

- [x] Intégrer les services réels (Email SMTP et Twilio)
- [x] Sécuriser l'accès administrateur avec authentification
- [x] Améliorer l'interface administrateur (modification, annulation, recherche)
- [x] Configurer les templates d'email professionnels
- [x] Tester le flux complet de réservation

## TÂCHES ÉVÉNEMENTS

- [x] Créer le schéma de base de données pour les événements
- [x] Implémenter les endpoints API pour les événements
- [x] Créer la page de listing des événements
- [x] Intégrer Google Maps pour afficher les lieux
- [x] Créer le widget encadré des événements à venir
- [x] Implémenter la réservation de places
- [x] Tester le système d'événements

## TÂCHES TÉMOIGNAGES

- [x] Créer le schéma de base de données pour les témoignages
- [x] Implémenter les endpoints API pour les témoignages
- [x] Créer la page de soumission de témoignages
- [x] Créer le dashboard de modération admin
- [x] Tester le système de témoignages

## TÂCHES OPTIMISATION

- [x] Analyser et optimiser le code serveur
- [x] Optimiser le code client (React)
- [ ] Optimiser les performances (lazy loading, caching)
- [ ] Améliorer la sécurité et les validations
- [ ] Refactoriser le code dupliqué
- [ ] Tester et valider les optimisations

## TÂCHES TRANSFORMATION LUXE & PRO

- [x] Repositionner l'image Hero plus à droite
- [x] Agrandir le titre "Maelle Mars Médium & Clairvoyante"
- [x] Mettre la citation sur une seule ligne
- [x] Supprimer la section "Mes services"
- [x] Ajouter la section "Pourquoi consulter une voyante ?"
- [ ] Refactoriser la mise en page globale avec design luxe
- [ ] Améliorer les typographies avec fonts premium
- [ ] Optimiser les images avec placeholders luxe
- [ ] Refactoriser les composants (Services, Témoignages, Événements)
- [ ] Ajouter micro-interactions et animations élégantes
- [ ] Tester et sauvegarder la version finale luxe

## TÂCHES BASE DE DONNÉES CLIENTS & AUTHENTIFICATION ADMIN

- [x] Créer le schéma de table clients dans Drizzle
- [x] Ajouter les procédures tRPC pour gérer les clients (getAll, create, update, delete)
- [x] Connecter la page admin /admin/fichierclient à la base de données
- [x] Ajouter la protection admin avec authentification (page /admin/login)
- [x] Créer les tests vitest pour les procédures clients
- [x] Connecter BookingForm pour sauvegarder les nouveaux clients
- [x] Créer un dashboard admin avec statistiques et graphiques
- [x] Implémenter les notifications en temps réel pour les réservations
- [x] Créer les tests vitest pour les notifications
- [x] Tester le flux complet de création de client via BookingForm
- [x] Ajouter la persistance des modifications clients (update/delete)
- [x] Tester l'authentification admin et les redirections

## TÂCHES RAPPORTS ET CALENDRIER

- [x] Créer le générateur de rapport PDF mensuel
- [x] Implémenter l'envoi d'email du rapport à maellemars@gmail.com
- [x] Ajouter la section de génération de rapport au dashboard admin
- [x] Créer le calendrier de consultations interactif
- [x] Mettre à jour le calendrier avec le design system
- [x] Créer les tests vitest pour les rapports (17 tests)
- [ ] Tester l'envoi d'email du rapport en production
- [ ] Ajouter la synchronisation des réservations au calendrier

## TÂCHES CALENDRIER AVANCÉ & NOTIFICATIONS SMS

- [x] Ajouter des filtres au calendrier (type de consultation, statut de paiement)
- [x] Afficher le prochain rendez-vous à l'ouverture du calendrier
- [x] Intégrer notification SMS pour le prochain rendez-vous
- [x] Implémenter l'envoi SMS avec Nom Prénom et Numéro
- [x] Automatiser l'envoi mensuel des rapports le 1er du mois
- [x] Créer un job cron pour les rapports mensuels
- [x] Tester les filtres du calendrier
- [x] Tester l'envoi de notifications SMS (15 tests)
- [x] Tester l'automatisation des rapports

## CORRECTIONS DE SÉCURITÉ

- [x] Mettre à jour les dépendances npm vulnérables
- [x] Ajouter Helmet.js pour les headers de sécurité
- [x] Configurer CORS strictement
- [x] Ajouter Rate Limiting (express-rate-limit)
- [x] Implémenter le logging de sécurité
- [ ] Ajouter la protection CSRF (prochaine étape)
- [x] Tester les corrections de sécurité (28 tests)

## TÂCHES MENU ÉVÉNEMENTS

- [x] Créer une page Événements avec menu déroulant (Conférence/Salon)
- [x] Créer la page Conférence
- [x] Créer la page Salon
- [x] Ajouter les routes pour /events/conference et /events/salon
- [x] Tester la navigation entre les pages

## TÂCHES REFONTE PAGE CONTACT

- [x] Analyser les pages Consultations et Événements pour cohérence visuelle
- [x] Créer la nouvelle page Contact avec hero section
- [x] Ajouter les informations de contact (email, téléphone, réseaux sociaux)
- [x] Intégrer un formulaire de contact élégant avec sélection de sujet
- [x] Ajouter une citation finale et section d'ambiance
- [x] Tester la page Contact

## REFONTE PAGE D'ACCUEIL V2 (ÉPURÉE)

- [ ] Supprimer les sections trop longues et recréer une page courte et impactante
- [ ] Design minimaliste : hero fort + 2-3 éléments essentiels max

## ENRICHISSEMENT PAGE D'ACCUEIL V3

- [x] Ajouter section Consultations sur la page d'accueil
- [x] Ajouter section "Ce qui différencie Maëlle" sur la page d'accueil
- [x] Ajouter section Témoignages aléatoires (3 par visite depuis la BDD)
- [x] Créer procédure tRPC getRandomTestimonials (3 aléatoires depuis pool)
- [x] Tester l'affichage des témoignages aléatoires

## BUG FIX - CRÉNEAUX RÉSERVATION

- [x] Diagnostiquer le problème "Aucun créneau disponible" sur /booking/schedule
- [x] Corriger la logique de génération des créneaux disponibles (calcul d'heure de fin erroné)
- [x] Tester la réservation avec des créneaux réels (22 créneaux 30min, 11 créneaux 1h, etc.)

## BUG FIX - CONSULTATION TYPE INVALID

- [x] Corriger l'erreur "Invalid option: consultationType" sur /booking/schedule
- [x] Ajouter une valeur par défaut et une redirection si consultationType est absent

## BUG FIX - FLUX RÉSERVATION CONSULTATION TYPE

- [x] Corriger la perte de consultationType lors de la validation du formulaire /booking/form
- [x] S'assurer que le type de consultation est sélectionné avant ou dans le formulaire
- [x] Ajouter sélecteur visuel de type de consultation dans /booking/form
- [x] Corriger les boutons Réserver sur /consultations pour passer le type au contexte

## FIX NAVBAR

- [ ] Logo en calligraphie anglaise élégante avec courbes marquées
- [ ] "Médium & Clairvoyante" sur une seule ligne dans la navbar
- [ ] Aligner tous les onglets sur une seule ligne
- [ ] Ajouter icônes Instagram et Facebook dans la navbar
- [ ] Supprimer les icônes Instagram/Facebook de la page d'accueil


## SYSTEME D'AUTHENTIFICATION OAUTH & ADMIN

- [x] Ajouter un bouton de connexion OAuth dans le Header
- [x] Creer un menu utilisateur avec profil et deconnexion
- [x] Afficher le bouton "Tableau de bord" pour les admins
- [x] Integrer le hook useAuth pour la gestion de session
- [x] Creer un menu mobile pour la connexion

## OPTIMISATION TABLEAU DE BORD ADMIN

- [x] Creer un tableau de bord admin avec statistiques en temps reel
- [x] Ajouter des cartes de statistiques (clients, consultations, avis, engagement)
- [x] Implementer la distribution des consultations avec graphiques
- [x] Creer une section "Avis & Temoignages" avec moderation
- [x] Ajouter des onglets pour naviguer entre Statistiques et Avis
- [x] Afficher les avis en attente de moderation
- [x] Afficher les avis publies avec note
- [x] Ajouter des boutons Publier/Rejeter pour les avis
- [x] Creer des tests vitest pour le dashboard admin
- [x] Optimiser le design avec gradients et couleurs elegantes


## AGENDA ELEGANT AVEC DESIGN CARNET PHYSIQUE

- [x] Creer les endpoints tRPC pour les statistiques de reservations
- [x] Creer les endpoints tRPC pour les statistiques de visites
- [x] Creer le composant Agenda avec design carnet physique (fond brun, ecriture noire)
- [x] Implementer les filtres jour/semaine/mois
- [x] Ajouter l'affichage du prochain client au clic sur un jour
- [x] Ajouter le nombre de reservations a venir dans la journee
- [x] Ajouter les statistiques de visites (par jour + totaux)
- [x] Creer les tests vitest pour l'agenda
- [x] Integrer l'agenda au dashboard admin
- [x] Ajouter les onglets Agenda et Visites au dashboard principal
- [x] Afficher les statistiques de visites du site par jour
- [x] Afficher le total des visites et moyenne par jour


## BLOCAGE D'HORAIRES DANS L'AGENDA

- [x] Ajouter une interface pour bloquer des horaires sur l'agenda
- [x] Afficher les créneaux bloqués dans le calendrier
- [x] Permettre de débloquer les créneaux bloqués
- [x] Synchroniser les créneaux bloqués avec les réservations
- [x] Créer les tests vitest pour le blocage d'horaires
- [x] Sauvegarder et tester


## BUGS À CORRIGER

- [x] Bug: Reconnexion automatique après déconnexion (corrigé - redirection vers accueil)
- [ ] Bug: Erreur "Unexpected token '<'" lors du blocage d'horaires (problème d'authentification - à tester après déconnexion/reconnexion)


## OPTIMISATION DU CODE

- [x] Supprimer ComponentShowcase.tsx (1437 lignes - démo seulement)
- [x] Créer AdminStatsCards.tsx (composant réutilisable)
- [x] Créer AdminDashboardTabs.tsx (composant réutilisable)
- [x] Créer CalendarHeader.tsx (composant réutilisable)
- [x] Créer VisitStats.tsx (composant réutilisable)
- [x] Éliminer axios de package.json (non utilisé)
- [x] Refactoriser la structure des composants
- [x] Optimiser les imports (tree-shaking)
- [x] Tester les performances après optimisation (142 tests passent)
- [x] Sauvegarder les optimisations


## CORRECTIONS DE BUGS PRIORITAIRES

- [x] Corriger l'erreur de connexion automatique après déconnexion (flag localStorage ajouté)
- [x] Corriger l'erreur qui empêche d'envoyer des avis (endpoint testimonials.submit fonctionne)
- [x] Tester les corrections (142 tests passent)


## LIEN DE PAIEMENT - OFFRE PROMOTIONNELLE 10MIN

- [x] Créer une page de paiement pour la consultation 10min
- [x] Intégrer le bouton PayPal hosted (ID: 66Y83EBJ3X5RQ)
- [x] Ajouter la route /promo-10min
- [x] Ajouter le lien dans la navigation
- [x] Tester le paiement (142 tests passent)


## BUG À CORRIGER - OFFRE PROMO

- [x] Corriger la redirection depuis la banderole promo vers /booking/form?promo=10min15
- [x] Ajouter le support du paramètre promo dans BookingForm
- [x] Tester la navigation complète du flux promo (142 tests passent)


## BUGS CRITIQUES À CORRIGER

- [x] Bug: Impossible de se déconnecter en tant qu'administrateur (corrigé - logique sessionStorage améliorée)
- [x] Bug: Impossible de réserver une consultation de 15 minutes (corrigé - types 10min et 15min ajoutés au schéma)


## CORRECTIONS OFFRE CONSULTATION EXPRESS (MARS 2026)

- [x] Supprimer la logique promotionnelle du code (promo=10min15)
- [x] Ajouter la consultation express 15€ les 10 min comme offre normale
- [x] Ajouter l'option "10 minutes" au sélecteur du formulaire de témoignage
- [x] Tester le flux de réservation pour la consultation express
- [x] Tester la soumission de témoignage avec la consultation express


## BUG CRITIQUE - VALIDATION D'ADRESSE

- [x] Corriger la validation d'adresse dans BookingForm.tsx
- [x] Empêcher les adresses bidons (validation permissive Nominatim)
- [x] Valider le code postal (rejet de 00000 et 99999)
- [x] Valider la ville (lettres uniquement, pas "jj")
- [x] Tester avec des données invalides et valides


## DIAGNOSTIC CRÉNEAUX DISPONIBLES - MARS 2026

- [x] Diagnostiquer le problème "Aucun créneau disponible" sur /booking/schedule
- [x] Identifier la cause : navigation directe sans remplir le formulaire
- [x] Tester le flux complet : Consultations → Formulaire → Sélection créneau
- [x] Valider que 22 créneaux s'affichent correctement pour le 06/03/2026
- [x] Confirmer que la sélection de créneau fonctionne


## CORRECTION CRÉNEAUX CONSULTATION EXPRESS 10MIN & 15MIN

- [x] Identifier le problème : pas de génération de créneaux pour "10min" et "15min"
- [x] Ajouter les cas "10min" et "15min" à la procédure getAvailableSlots
- [x] Générer 45 créneaux pour consultation 10 min (09:00-19:55, intervalle 15 min)
- [x] Générer créneaux pour consultation 15 min (09:00-19:45, intervalle 20 min)
- [x] Tester le flux complet avec consultation express
- [x] Valider la sélection de créneau (09:00-09:10)


## REDIRECTION TÉMOIGNAGES VERS MANUS (MARS 2026)

- [ ] Supprimer le code de soumission de témoignage du serveur (testimonials-router.ts)
- [ ] Configurer l'envoi direct vers l'API Manus Data API (SubmitTestimonial.tsx)
- [ ] Tester la soumission de témoignage en production
- [ ] Vérifier que les données arrivent dans le tableau de bord Manus


## FIX EMAILS DE CONFIRMATION APRÈS PAIEMENT PAYPAL (MARS 2026)

- [x] Identifier le problème : les emails de confirmation ne sont pas envoyés après un paiement PayPal réussi
- [x] Vérifier la configuration SMTP (Brevo) - OK
- [x] Ajouter les imports manquants dans paypal-webhook.ts (getAllReservations, updatePaymentStatus)
- [x] Créer l'endpoint REST `/api/webhooks/paypal` pour recevoir les webhooks PayPal
- [x] Tester l'endpoint webhook avec une requête de test - OK
- [x] Vérifier que les emails sont envoyés avec succès - OK
- [x] Corriger le mapping des types de consultation dans les templates d'email (10min, 15min, 25min, 30min, 40min, 1hour)
- [ ] Configurer PayPal pour envoyer les webhooks à https://www.maellemars.com/api/webhooks/paypal
- [ ] Tester le flux complet de paiement en production


## MIGRATION VERS SUPABASE POSTGRESQL (MARS 2026)

- [x] Créer le projet Supabase (rjricksnlzxvtuiywkkd)
- [x] Créer le schéma de base de données PostgreSQL dans Supabase
- [x] Mettre à jour drizzle.config.ts pour PostgreSQL
- [x] Mettre à jour le schéma Drizzle pour PostgreSQL
- [x] Remplacer mysql2 par pg et postgres-js dans package.json
- [x] Mettre à jour server/db.ts pour utiliser PostgreSQL
- [x] Corriger les imports et les références aux fonctions de base de données
- [x] Corriger les erreurs TypeScript dans AdminDashboardHome.tsx
- [x] Corriger les erreurs TypeScript dans paypal-webhook.ts
- [x] Corriger les erreurs TypeScript dans routers.ts
- [x] Configurer la connection string Supabase (.env.local)
- [x] Redémarrer le serveur avec Supabase PostgreSQL
- [x] Tester la connexion à Supabase
- [x] Configurer la connexion SSL à Supabase
- [x] Pousser le code vers GitHub (commit effectué)
- [ ] Déployer sur Railway ou Render
- [ ] Configurer les webhooks PayPal en production
- [ ] Tester le flux complet de paiement en production


## MIGRATION SUPABASE POSTGRESQL

- [x] Configurer postgres-js avec ssl: 'require' et prepare: false
- [x] Mettre à jour la connection string avec le port 6543 (Transaction Pooler)
- [x] Améliorer la gestion d'erreurs dans les procédures tRPC (createV2, create)
- [ ] Déployer en production sur Railway ou Render
- [ ] Configurer les webhooks PayPal en production
- [ ] Tester le flux complet de paiement en production
- [ ] Vérifier que les données sont sauvegardées dans Supabase PostgreSQL
