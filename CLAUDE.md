# MaSynchro — Règles du projet

> "Chaque matin, parfaitement synchronisé."

Application mobile (iOS + Android) — compagnon matinal intelligent et bienveillant.

## Architecture

- **Architecture hybride** : `shared/` (boîte à outils) + `features/` (cœur métier autonome par feature)
- Chaque feature contient : `components/`, `domain/`, `hooks/`, `services/`, `store/`, `__tests__/`
- **Le domain/ ne doit JAMAIS importer** de services/, React, Supabase, Zustand ou toute bibliothèque externe
- Les écrans (`app/`) orchestrent les features via leurs hooks
- Le backend Next.js (`backend/api/`) est un proxy sécurisé pour les clés API — la logique métier reste côté mobile

## Stack

- Mobile : React Native + Expo (TypeScript)
- Backend : Next.js API Routes → Vercel
- BDD : Supabase (PostgreSQL)
- État : Zustand
- Voix : Edge TTS (MVP) → ElevenLabs (v2) → Claude API (v3)

## Patterns obligatoires

- **Repository** pour tout accès BDD (`*Repository.ts`) — abstraire Supabase
- **Adapter** pour toute API externe (`*Adapter.ts`) — traduire vers le format interne
- **Strategy** pour les implémentations interchangeables (`*Engine.ts`) — TTS notamment
- **Facade** pour les use cases complexes — hooks qui cachent la coordination multi-features

## Conventions de code

- TypeScript strict, zéro `any`
- Imports absolus : `@/features/alarm/...`
- Composants : PascalCase, export nommé (pas default)
- Hooks : camelCase, préfixe `use`
- Domain : fonctions pures, zéro side effect
- Tests : fichiers dans `__tests__/`, convention `*.test.ts`

## Conventions Git

- Conventional Commits : `type(scope): description`
- Types : feat, fix, docs, style, refactor, test, chore, ci, perf
- Scopes : alarm, routine, weather, transport, voice, media, profile, shared, app, ci, docs
- Branches : `feature/*`, `fix/*`, `docs/*` depuis `develop`

## Tests

- domain/ → TDD obligatoire, couverture > 90%
- hooks/ → tests d'intégration
- components/ → tests des interactions critiques
- Bug fix → toujours écrire un test qui reproduit le bug AVANT de le corriger

## Philosophie UX

- **Bienveillance** : ton chaleureux, jamais culpabilisant
- **Discrétion** : la voix parle uniquement quand c'est utile
- **Proactivité** : anticiper (transports perturbés, météo)
- **Adaptabilité** : chaque matin est différent

## Contexte d'apprentissage

L'utilisatrice est étudiante en alternance. Ce projet est aussi une formation pratique. À chaque étape :
- Expliquer le POURQUOI des choix (pattern, archi, méthode)
- Introduire les bonnes pratiques progressivement
- Ne pas juste donner du code — enseigner
