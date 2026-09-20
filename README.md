# MaSynchro

> *Chaque matin, parfaitement synchronisé.*

Application mobile (iOS + Android) — un compagnon matinal intelligent et bienveillant qui remplace tous tes réveils par une seule app qui s'adapte à chaque matin.

## Concept

MaSynchro ne dit pas quoi faire. Elle **accompagne**. Elle ne stresse pas. Elle **rassure**. Elle n'est pas un outil froid. Elle est un **allié chaleureux** qui s'adapte à chaque matin.

**Philosophie** : *"Absorber le stress, jamais en créer."*

## Fonctionnalités (MVP)

- **Réveil adaptatif** — calcule l'heure optimale selon le trajet, la préparation et la météo
- **Routine personnalisable** — définis tes étapes matinales avec leurs durées
- **Météo contextuelle** — pas juste "il pleut" mais "prends un parapluie, ajoute 5 min"
- **Transports en temps réel** — recalcul automatique si perturbation
- **Voix accompagnante** — briefing matinal bienveillant
- **Mode "je suis en retard"** — recalcule sans culpabiliser

## Stack technique

| Brique | Techno |
|---|---|
| Mobile | React Native + Expo (TypeScript) |
| Backend | Next.js API Routes → Vercel |
| Base de données | Supabase (PostgreSQL) |
| État | Zustand |
| Voix | Edge TTS → ElevenLabs (évolutif) |

## Architecture

Architecture hybride feature-based. Voir [`docs/architecture/`](docs/architecture/) pour les détails.

```
src/
├── shared/       ← Composants et utils réutilisables
├── features/     ← Cœur métier (alarm, routine, weather, transport, voice, profile)
└── app/          ← Écrans et navigation (Expo Router)
```

## Documentation

- [`docs/vision/`](docs/vision/) — Contexte, fonctionnalités, choix techniques, roadmap
- [`docs/architecture/`](docs/architecture/) — Architecture, patterns, stack détaillée
- [`docs/workflow/`](docs/workflow/) — Git hooks, CI/CD, tests, bonnes pratiques

## Licence

AGPL-3.0 — voir [LICENSE](LICENSE)
