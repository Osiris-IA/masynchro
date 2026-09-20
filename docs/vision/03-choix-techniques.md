# Choix Techniques

## Date de rédaction
2026-09-12

---

## Stack retenue

### Mobile — React Native + Expo

**Choix** : React Native avec Expo SDK

**Pourquoi ce choix** :
- Un seul codebase pour iOS ET Android
- Basé sur React + TypeScript → aligné avec les objectifs d'apprentissage
- Expo simplifie le build, le déploiement, les mises à jour OTA
- Écosystème mature, grosse communauté

**Alternatives considérées** :

| Option | Pour | Contre | Verdict |
|---|---|---|---|
| React Native + Expo | React/TS, un seul code, Expo simplifie tout | Moins de contrôle natif qu'en pur natif | **RETENU** |
| Flutter | Performant, beau par défaut | Dart (pas dans les objectifs d'apprentissage) | Rejeté |
| Natif (Swift + Kotlin) | Performance maximale | Deux codebases, double travail | Rejeté |
| PWA | Simple à déployer | Pas d'accès alarmes/audio fiable sur mobile | Rejeté |

---

### Backend — Next.js API Routes

**Choix** : Next.js (API Routes) déployé sur Vercel

**Pourquoi ce choix** :
- TypeScript partout (front et back)
- API Routes = simple, rapide, pas de serveur à gérer
- Vercel = déploiement automatique à chaque push
- Aligné avec l'objectif d'apprentissage Next.js

**Alternatives considérées** :

| Option | Pour | Contre | Verdict |
|---|---|---|---|
| Next.js API Routes | TS, simple, Vercel | Moins flexible qu'un vrai serveur pour du temps réel | **RETENU** |
| Express.js | Flexible, léger | Pas de framework structure, plus à configurer | Rejeté |
| Spring Boot (Java) | Robuste, Java dans les objectifs | Trop lourd pour un MVP mobile | Peut-être v2/v3 |
| NestJS | Structuré, TS | Plus complexe que nécessaire pour le MVP | Alternative future |

---

### Base de données — Supabase (PostgreSQL)

**Choix** : Supabase

**Pourquoi ce choix** :
- PostgreSQL en dessous → on apprend le vrai SQL
- Auth intégrée (inscription, login, OAuth)
- Stockage fichiers intégré
- Temps réel intégré (pour de futures features)
- Gratuit pour commencer (tier gratuit généreux)
- Dashboard visuel pour explorer ses données

**Alternatives considérées** :

| Option | Pour | Contre | Verdict |
|---|---|---|---|
| Supabase | PostgreSQL + auth + storage + realtime, gratuit | Dépendance au service | **RETENU** |
| PostgreSQL nu + Prisma | Contrôle total, Prisma = DX top | Plus à configurer (auth, hosting séparé) | Alternative |
| MongoDB | Flexible, JSON natif | Pas SQL (objectif d'apprentissage) | Rejeté |
| Firebase | Très intégré mobile | NoSQL, vendor lock-in Google | Rejeté |

---

### Text-to-Speech (Voix)

**Stratégie évolutive** :

| Version | Tech | Qualité | Coût |
|---|---|---|---|
| MVP (v1) | Edge TTS (Microsoft) | Bonne, naturelle en FR | Gratuit |
| v1.5 | Expo Speech (fallback offline) | Basique | Gratuit |
| v2 | ElevenLabs API | Excellente, émotionnelle | Freemium |
| v3 | Claude API + ElevenLabs | Phrases uniques + voix naturelle | Payant |

---

### APIs externes

| Service | API | Coût | Usage |
|---|---|---|---|
| Météo | OpenWeatherMap | Gratuit (1000 appels/jour) | Météo contextuelle |
| Transports | Google Maps Directions API | Gratuit (limité) puis payant | Temps de trajet |
| Transports FR | Navitia / API RATP | Gratuit | Transport en commun FR |
| Musique | Spotify Web API | Gratuit (auth utilisateur) | Lancer musique/podcast |
| Radio | RadioBrowser API | Gratuit, open source | Stations de radio |
| Calendrier | Google Calendar API / CalDAV | Gratuit | Intégration agenda (v2) |
| Sommeil | HealthKit / Google Fit | Gratuit (natif) | Cycles de sommeil (v2) |

---

### Notifications Push

**Choix** : Expo Notifications + Firebase Cloud Messaging

**Pourquoi** : Expo gère l'abstraction iOS/Android, FCM est le standard gratuit.

---

### CI/CD et DevOps

| Outil | Usage |
|---|---|
| GitHub | Hébergement du code, issues, PR |
| GitHub Actions | CI/CD — lint, tests, build automatique |
| Vercel | Déploiement backend automatique |
| EAS (Expo Application Services) | Build et publication sur App Store / Play Store |
| Sentry | Monitoring des erreurs et crashs en production |

---

### Tests

| Type | Outil | Ce qu'on teste |
|---|---|---|
| Unitaires | Jest | Logique métier (calcul d'horaires, routines) |
| Composants | React Native Testing Library | UI, interactions utilisateur |
| E2E | Detox | Parcours complets (réveil → départ) |
| API | Supertest | Endpoints backend |

---

## Architecture logicielle

### Patterns appliqués

- **Clean Architecture** — séparation UI / domaine / données
- **Repository Pattern** — couche d'abstraction pour l'accès données
- **Custom Hooks** — logique réutilisable côté React
- **SOLID** — Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **Atomic Design** — organisation des composants UI (atoms, molecules, organisms)

### Structure du projet (prévue)

```
src/
├── app/                  # Navigation et écrans (Expo Router)
├── components/           # Composants UI réutilisables
│   ├── atoms/            # Boutons, textes, icônes
│   ├── molecules/        # Groupes de composants simples
│   └── organisms/        # Composants complexes (timeline, cards)
├── hooks/                # Custom hooks React
├── services/             # Appels API, logique externe
│   ├── weather.ts
│   ├── transport.ts
│   ├── spotify.ts
│   └── speech.ts
├── domain/               # Logique métier pure
│   ├── routine.ts        # Calcul de la routine
│   ├── alarm.ts          # Gestion du réveil adaptatif
│   └── timeline.ts       # Génération de la timeline
├── repositories/         # Accès aux données (Supabase)
├── store/                # État global (Zustand)
├── types/                # Types TypeScript
├── utils/                # Utilitaires
└── constants/            # Constantes, config
```
