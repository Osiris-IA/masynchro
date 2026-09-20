# MaSynchro — Stack Technique Détaillée

## Date de rédaction
2026-09-20

---

## Vue d'ensemble

```
📱 Mobile           React Native + Expo (TypeScript)
☁️ Backend          Next.js API Routes → Vercel
🗄️ Base de données  Supabase (PostgreSQL)
🔐 Auth             Supabase Auth
📊 État global      Zustand
🗣️ Voix             Edge TTS → ElevenLabs → Claude API (évolutif)
🌤️ Météo            OpenWeatherMap
🚇 Transports       Google Maps Directions / Navitia
🎵 Musique          Spotify Web API + RadioBrowser (v1.5)
📋 Calendrier       Google Calendar API (v2)
```

---

## Détail de chaque brique

### React Native + Expo

**Rôle** : framework mobile cross-platform

**Ce qu'il faut savoir** :
- React Native = React, mais au lieu de rendre du HTML, il rend des composants natifs iOS/Android
- Expo = une surcouche qui simplifie tout (build, notifications, caméra, audio...)
- On écrit en TypeScript, le code est compilé pour iOS ET Android

**Librairies clés prévues** :

| Librairie | Rôle |
|---|---|
| expo-router | Navigation (file-based routing comme Next.js) |
| expo-notifications | Notifications push + alarmes planifiées |
| expo-speech | TTS local (fallback offline) |
| expo-location | Géolocalisation |
| zustand | Gestion d'état global |
| react-native-reanimated | Animations fluides |
| @supabase/supabase-js | Client Supabase |

### Next.js API Routes (Backend)

**Rôle** : serveur léger qui protège les clés API et agrège les données externes

**Ce qu'il faut savoir** :
- Pas un "vrai" serveur — ce sont des fonctions serverless déployées sur Vercel
- Chaque fichier dans `api/` = un endpoint HTTP
- Déploiement automatique à chaque push sur GitHub

**Endpoints prévus** :

| Endpoint | Méthode | Rôle |
|---|---|---|
| `/api/briefing` | POST | Agrège météo + transport → renvoie les données |
| `/api/weather` | GET | Proxy vers OpenWeatherMap |
| `/api/transport` | GET | Proxy vers Google Maps / Navitia |
| `/api/voice` | POST | Génère l'audio TTS (Edge TTS puis ElevenLabs) |

### Supabase (PostgreSQL)

**Rôle** : base de données + auth + stockage

**Ce qu'il faut savoir** :
- Supabase = interface au-dessus de PostgreSQL
- On écrit du vrai SQL pour concevoir le schéma
- L'auth (inscription, login, OAuth) est intégrée
- Le SDK JavaScript fournit un accès simple aux données

**Utilisation dans MaSynchro** :
- Stocker les profils utilisateurs, routines, préférences
- Authentification (email/password, Google, Apple)
- Row Level Security (chaque utilisateur ne voit que SES données)
- Sync entre appareils (les données sont dans le cloud)

**Approche d'apprentissage** :
1. Concevoir le schéma SQL à la main (CREATE TABLE, clés étrangères)
2. Écrire les requêtes SQL dans le dashboard Supabase
3. Puis utiliser le SDK pour les mêmes opérations dans l'app
4. Comprendre les deux niveaux

### Zustand (État global)

**Rôle** : partager des données entre les écrans sans prop drilling

**Stores prévus** :

| Store | Données | Pourquoi global |
|---|---|---|
| `alarmStore` | Heure de réveil, état on/off | Affiché sur dashboard + settings |
| `routineStore` | Étapes, timeline, progression | Dashboard + routine screen |
| `profileStore` | Préférences, adresses | Utilisé partout |
| `weatherStore` | Données météo du jour | Dashboard + briefing |
| `transportStore` | État transports, temps trajet | Dashboard + briefing |

### Text-to-Speech (Voix)

**Stratégie évolutive** :

| Version | Tech | Qualité | Coût | Online |
|---|---|---|---|---|
| MVP (v1) | Edge TTS (Microsoft) | Bonne en FR | Gratuit | Oui |
| MVP fallback | Expo Speech | Basique | Gratuit | Non (local) |
| v2 | ElevenLabs API | Excellente, émotionnelle | ~5$/mois | Oui |
| v3 | Claude API + ElevenLabs | Phrases uniques + voix naturelle | ~15$/mois | Oui |

Le **Strategy Pattern** permet de passer de l'un à l'autre sans changer le code appelant.

### APIs externes

| Service | API | Coût | Limites gratuites |
|---|---|---|---|
| Météo | OpenWeatherMap | Gratuit | 1000 appels/jour |
| Transports | Google Maps Directions | 200$/mois crédit gratuit | ~40k requêtes/mois |
| Transports FR | Navitia | Gratuit | 5000 appels/jour |
| Musique (v1.5) | Spotify Web API | Gratuit | Auth utilisateur requise |
| Radio (v1.5) | RadioBrowser API | Gratuit, open source | Illimité |
| Calendrier (v2) | Google Calendar API | Gratuit | Auth utilisateur requise |
| Sommeil (v2) | HealthKit / Google Fit | Gratuit (natif) | Accès appareil |
