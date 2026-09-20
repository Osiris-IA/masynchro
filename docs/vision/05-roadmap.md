# Roadmap

## Date de rédaction
2026-09-12

---

## Vue d'ensemble

```
MVP (v1)  →  v1.5  →  v2  →  v3
 8-10 sem    4 sem    8 sem   continu
```

---

## Phase 0 — Fondations (Sprint 0, ~1 semaine)
- [x] Définir le problème et la vision
- [x] Choisir la stack technique
- [x] Définir la méthodologie
- [x] Documenter les choix
- [ ] Choisir le nom de l'app
- [ ] Créer le repo GitHub
- [ ] Initialiser le projet Expo + Next.js
- [ ] Configurer ESLint, Prettier, Husky
- [ ] Configurer Supabase
- [ ] Créer le schéma de base de données initial
- [ ] Premier commit

---

## MVP (v1) — Le compagnon qui marche (~8-10 semaines)

### Sprint 1 — Fondations techniques (2 sem)
- Setup complet du projet
- Navigation de base (Expo Router)
- Écran d'onboarding (adresse, horaires, routine)
- Connexion Supabase (auth + BDD)

### Sprint 2 — Réveil adaptatif (2 sem)
- Calcul de l'heure de réveil
- Intégration Google Maps (temps de trajet)
- Alarme native (Expo Notifications)
- Écran principal avec heure de réveil

### Sprint 3 — Routine et timeline (2 sem)
- Création/édition de routine personnalisée
- Génération de la timeline matinale
- Notifications à chaque étape
- Mode "je suis en retard" (recalcul)

### Sprint 4 — Météo, transports, voix (2 sem)
- Intégration OpenWeatherMap
- Conseils météo contextuels
- Intégration transports (Google Maps / Navitia)
- Voix : briefing matinal (Edge TTS)

### Sprint 5 — Polish et tests (1-2 sem)
- Tests unitaires de la logique métier
- Tests de composants
- Bug fixes
- UI polish
- Test avec de vrais utilisateurs (amis, famille)

---

## v1.5 — Musique et widgets (~4 semaines)

### Sprint 6
- Intégration Spotify (auth OAuth, contrôle lecture)
- Playlists par moment (réveil, préparation, trajet)
- Intégration podcast

### Sprint 7
- Widget écran d'accueil (iOS + Android)
- Améliorations basées sur le feedback utilisateurs
- Fallback offline pour la voix (Expo Speech)

---

## v2 — Intelligence (~8 semaines)

### Sprint 8-9
- Voix ElevenLabs (naturelle)
- Intégration calendrier
- Analyse cycles de sommeil (HealthKit / Google Fit)

### Sprint 10-11
- IA conversationnelle (Claude API) pour phrases uniques
- Mode couple/coloc
- Statistiques et gamification douce

---

## v3 — Écosystème (continu)

- Apple Watch / Wear OS
- Mode offline complet
- Conversation vocale avec l'app
- Communauté (partage de routines)

---

## Publication sur les stores

### App Store (iOS)
- Compte Apple Developer (99$/an)
- Review Apple (~1-2 semaines la première fois)
- Build via EAS (Expo)

### Play Store (Android)
- Compte Google Play Developer (25$ une fois)
- Review Google (~quelques jours)
- Build via EAS (Expo)
