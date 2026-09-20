# MaSynchro — Architecture Globale

## Date de rédaction
2026-09-20

---

## Pattern : Architecture Hybride (Shared + Features)

MaSynchro utilise une architecture **hybride feature-based** inspirée de la Clean Architecture. Le code n'est pas découpé par couche technique (controllers/services/models) mais par **domaine fonctionnel**, avec une boîte à outils partagée.

### Pourquoi ce choix

| Approche | Avantage | Inconvénient | Verdict |
|---|---|---|---|
| Découpage technique (MVC classique) | Familier, simple au début | Quand l'app grandit, une feature est éparpillée dans 10 dossiers | Rejeté |
| Découpage par feature (modulaire) | Tout ce qui concerne "alarm" est dans alarm/ | Risque de duplication entre features | **Retenu** |
| Microservices | Scalabilité maximale | Overkill pour une développeuse solo, complexité réseau | Rejeté pour le MVP |

### Principe fondamental

> Chaque feature est **autonome** : elle contient ses propres composants UI, sa logique métier, ses hooks, ses services et son état. On peut la comprendre, la tester et la modifier sans toucher au reste.

---

## Structure du projet

```
masynchro/
├── src/
│   ├── shared/                     ← A. Boîte à outils réutilisable
│   │   ├── components/             Bouton, Input, Modal, Card (sans logique métier)
│   │   ├── hooks/                  useDebounce(), useNetworkStatus()
│   │   ├── services/               apiClient.ts (wrapper fetch vers le backend)
│   │   ├── types/                  Types globaux (User, ApiResponse...)
│   │   ├── utils/                  formatTime(), formatDate(), validators
│   │   └── constants/              Couleurs, config, clés publiques
│   │
│   ├── features/                   ← B. Cœur métier (un dossier = une feature)
│   │   ├── alarm/                  Réveil adaptatif
│   │   │   ├── components/         AlarmCard, AlarmSetup (UI spécifique)
│   │   │   ├── domain/             calculeHeureReveil() — LOGIQUE PURE
│   │   │   ├── hooks/              useAdaptiveAlarm() — orchestration React
│   │   │   ├── services/           alarmRepository.ts — accès Supabase
│   │   │   ├── store/              alarmStore.ts — état Zustand
│   │   │   └── __tests__/          Tests unitaires + composants
│   │   │
│   │   ├── routine/                Gestion des routines et timeline
│   │   │   ├── components/         TimelineView, RoutineEditor, StepCard
│   │   │   ├── domain/             genereTimeline(), recalculeRetard()
│   │   │   ├── hooks/              useRoutine(), useLateMode()
│   │   │   ├── services/           routineRepository.ts
│   │   │   ├── store/              routineStore.ts
│   │   │   └── __tests__/
│   │   │
│   │   ├── weather/                Météo contextuelle
│   │   │   ├── components/         WeatherCard, WeatherAdvice
│   │   │   ├── domain/             genereConseilMeteo()
│   │   │   ├── hooks/              useWeather()
│   │   │   ├── services/           weatherAdapter.ts — traduit l'API externe
│   │   │   └── __tests__/
│   │   │
│   │   ├── transport/              Transports en temps réel
│   │   │   ├── components/         TransportStatus, TrajetCard
│   │   │   ├── domain/             calculeTempsTrajet()
│   │   │   ├── hooks/              useTransport()
│   │   │   ├── services/           transportAdapter.ts
│   │   │   └── __tests__/
│   │   │
│   │   ├── voice/                  Voix accompagnante (TTS)
│   │   │   ├── components/         VoiceToggle, BriefingPlayer
│   │   │   ├── domain/             composeBriefing()
│   │   │   ├── hooks/              useBriefing(), useVoice()
│   │   │   ├── services/           ttsAdapter.ts — Edge TTS / ElevenLabs
│   │   │   └── __tests__/
│   │   │
│   │   ├── media/                  Spotify, podcast, radio (v1.5)
│   │   │   └── ...
│   │   │
│   │   └── profile/                Profil utilisateur, préférences
│   │       ├── components/         ProfileScreen, AddressForm
│   │       ├── hooks/              useProfile()
│   │       ├── services/           profileRepository.ts
│   │       ├── store/              profileStore.ts
│   │       └── __tests__/
│   │
│   └── app/                        ← C. Navigation + Écrans (Expo Router)
│       ├── _layout.tsx             Layout racine (providers, thème)
│       ├── (tabs)/
│       │   ├── _layout.tsx         Layout des onglets
│       │   ├── index.tsx           Dashboard matinal (compose les features)
│       │   ├── routine.tsx         Écran gestion de routine
│       │   └── settings.tsx        Réglages
│       └── onboarding/
│           ├── welcome.tsx         Bienvenue
│           ├── address.tsx         Configuration adresses
│           └── routine-setup.tsx   Configuration routine initiale
│
├── backend/                        ← Next.js API Routes (déployé sur Vercel)
│   └── api/
│       ├── briefing.ts             Agrège météo + transport → renvoie au mobile
│       ├── weather.ts              Proxy OpenWeatherMap (protège la clé API)
│       ├── transport.ts            Proxy Google Maps / Navitia
│       ├── voice.ts                Génération TTS
│       └── auth.ts                 Endpoints auth (si besoin au-delà de Supabase)
│
├── docs/                           ← Documentation complète
├── CLAUDE.md                       ← Règles pour Claude Code
├── LICENSE                         ← AGPL-3.0
└── README.md
```

---

## Anatomie d'une feature

Chaque dossier dans `features/` suit la même structure interne :

```
features/alarm/
├── components/     ← UI spécifique à cette feature
│                     Utilise les composants de shared/ comme briques de base
│
├── domain/         ← Logique métier PURE
│                     Zéro import de React, Supabase, ou bibliothèque externe
│                     Fonctions pures : entrée → sortie, testables à 100%
│                     C'est ici que vit la VALEUR de l'app
│
├── hooks/          ← Orchestration React
│                     Connecte le domain/ aux services/ et au store/
│                     Gère le cycle de vie React (useEffect, state)
│
├── services/       ← Accès au monde extérieur
│                     Repository (Supabase) ou Adapter (API externe)
│                     Implémente une interface définie par le domain/
│
├── store/          ← État global (Zustand)
│                     Données partagées entre les écrans
│
└── __tests__/      ← Tests (priorité : domain > hooks > components)
```

### Règle d'or : le domain/ ne dépend de RIEN

```
✅ domain/ peut importer : ses propres types, des utils de shared/
❌ domain/ ne peut PAS importer : React, Supabase, Zustand, fetch, AsyncStorage

Pourquoi : si tu changes de base de données, de framework UI, ou de librairie
d'état, le domain/ ne bouge pas. C'est le cœur stable de l'app.
```

---

## Flux de données

### Qui appelle qui

```
Écran (app/)
  └── utilise un hook de feature (features/alarm/hooks/)
        ├── lit/écrit le store (features/alarm/store/)
        ├── appelle le domain (features/alarm/domain/) pour les calculs
        └── appelle les services (features/alarm/services/) pour les données externes
              └── communique avec Supabase ou le backend Next.js
```

### Les flèches pointent toujours vers l'intérieur

```
┌─────────────────────────────────────────────────┐
│  Écrans (app/)                                   │
│  ┌───────────────────────────────────────────┐   │
│  │  Hooks (features/*/hooks/)                │   │
│  │  ┌─────────────────────────────────────┐  │   │
│  │  │  Domain (features/*/domain/)        │  │   │  ← Le centre ne connaît
│  │  │  Logique pure, zéro dépendance      │  │   │    pas l'extérieur
│  │  └─────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────┘   │
│  Services + Store (features/*/services/, store/) │  ← Périphérie : accès données
└─────────────────────────────────────────────────┘
```

---

## Le flux matinal — scénario central

```
22h — L'utilisatrice configure son réveil pour demain 9h

📱 Mobile                              ☁️ Backend (/api/briefing)
   │                                        │
   ├── POST /api/briefing ─────────────────→│
   │   { arrivée: "09:00",                  ├── GET OpenWeatherMap (clé secrète)
   │     adresse_domicile, adresse_travail } ├── GET Google Maps (clé secrète)
   │                                        │
   │←── { météo, trajet, conseils } ────────│
   │
   ├── domain/calculeHeureReveil()
   │     9h00 - 45min trajet - 10min pluie - 40min prépa = 7h25
   │
   ├── store/alarmStore.setWakeUpTime("07:25")
   │
   └── Notification planifiée → alarme à 7h25

7h25 — Le réveil sonne

📱 Mobile
   ├── Charge les données en cache (ou refetch si réseau)
   ├── domain/composeBriefing(météo, trajet, routine)
   │     → "Bonjour ! Il pleut ce matin, prends un parapluie.
   │        Le RER A est ok, 45 minutes de trajet. Tu es dans les temps."
   ├── ttsAdapter.speak(briefing)
   └── Affiche le dashboard avec la timeline
```

---

## Mobile vs Serveur — répartition

| Responsabilité | Mobile (React Native) | Serveur (Next.js) |
|---|---|---|
| Calculs (heure réveil, timeline) | ✅ | |
| Logique métier (routines, retard) | ✅ | |
| Affichage et navigation | ✅ | |
| État local (Zustand) | ✅ | |
| Alarme et notifications | ✅ | |
| Appels aux APIs externes | | ✅ (proxy sécurisé) |
| Protection des clés API | | ✅ |
| Agrégation des données (briefing) | | ✅ |
| Auth (Supabase) | ✅ (SDK client) | ✅ (vérification) |

**Principe** : le serveur protège les secrets, le mobile garde l'intelligence. Un seul appel réseau au lieu de 3-4.

---

## Stratégie offline

| Fonctionnalité | Online | Offline |
|---|---|---|
| Alarme / réveil | ✅ Heure optimale recalculée | ✅ Dernière heure en cache |
| Routine / timeline | ✅ | ✅ Stockée localement |
| Météo | ✅ Temps réel | ⚠️ Dernière donnée en cache |
| Transports | ✅ Temps réel | ❌ Non disponible |
| Voix TTS | ✅ Edge TTS (réseau) | ✅ Expo Speech (local) |
| Profil / préférences | ✅ Sync Supabase | ✅ AsyncStorage local |

---

## Scalabilité — si l'app évolue

### Court terme (MVP → v2)
L'architecture actuelle suffit largement. Ajouter une feature = créer un nouveau dossier dans `features/`.

### Moyen terme (v2 → v3)
- Les Use Cases transversaux (briefing matinal qui touche météo + transport + routine + voix) restent dans les hooks des écrans
- Si ça devient trop complexe (>5 features coordonnées), on pourra extraire un dossier `orchestration/`
- Le pattern Observer (Zustand) gère les cascades simples

### Long terme (v3+)
- Si besoin de temps réel avancé (mode couple/coloc), Supabase Realtime est déjà intégré
- Si le backend grandit, migration possible vers NestJS ou Spring Boot sans toucher au mobile
- Le Repository Pattern protège contre tout changement de BDD
