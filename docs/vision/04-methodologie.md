# Méthodologie de travail

## Date de rédaction
2026-09-12

---

## Objectif
Adopter dès maintenant les pratiques professionnelles pour que ce projet serve aussi de **formation pratique** aux méthodes de travail en entreprise.

---

## Gestion de projet — Agile personnel

### Sprints
- **Durée** : 1 à 2 semaines
- **Planning** : en début de sprint, on définit les objectifs
- **Review** : en fin de sprint, on fait le bilan de ce qui a été fait
- **Rétrospective** : qu'est-ce qui a bien marché, qu'est-ce qu'on améliore

### Outils
- **GitHub Issues** : chaque fonctionnalité, bug, ou tâche = une issue
- **GitHub Projects** : tableau Kanban (To Do → In Progress → Review → Done)
- **Labels** : `feature`, `bug`, `docs`, `learning`, `enhancement`
- **Milestones** : liés aux versions (MVP, v1.5, v2)

---

## Git — Workflow

### Branches
```
main           → code en production, stable
├── develop    → intégration, pré-production
├── feature/*  → nouvelles fonctionnalités (feature/alarm-adaptive)
├── fix/*      → corrections de bugs (fix/notification-crash)
└── docs/*     → documentation (docs/api-weather)
```

### Convention de commits
Format : `type(scope): description`

Types :
- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `docs` : documentation
- `style` : formatage, pas de changement de logique
- `refactor` : restructuration du code
- `test` : ajout ou modification de tests
- `chore` : maintenance, dépendances, config

Exemples :
```
feat(alarm): add adaptive wake-up time calculation
fix(transport): handle RATP API timeout gracefully
docs(readme): add setup instructions
test(routine): add unit tests for timeline generation
```

### Pull Requests
- Toute modification passe par une PR
- Description claire de ce qui change et pourquoi
- Auto-review avant de merge (checklist)

---

## Code — Standards

### Linting et formatage
- **ESLint** : règles de qualité du code
- **Prettier** : formatage automatique
- **Husky** : hooks Git (lint avant chaque commit)

### Nommage
- Composants : PascalCase (`AlarmCard.tsx`)
- Hooks : camelCase avec prefix `use` (`useWeather.ts`)
- Services : camelCase (`weatherService.ts`)
- Types : PascalCase (`RoutineStep`, `WeatherData`)
- Constantes : UPPER_SNAKE_CASE (`MAX_SNOOZE_COUNT`)

### Principes SOLID appliqués
1. **S** — Single Responsibility : un fichier = une responsabilité
2. **O** — Open/Closed : extensible sans modifier l'existant
3. **L** — Liskov Substitution : les sous-types sont interchangeables
4. **I** — Interface Segregation : interfaces petites et spécifiques
5. **D** — Dependency Inversion : dépendre des abstractions, pas des implémentations

---

## Tests — Stratégie

### Pyramide de tests
```
        /  E2E  \         ← Peu de tests, parcours critiques
       / Intégration \    ← Tests de composants avec interactions
      /   Unitaires    \  ← Beaucoup de tests, logique métier
```

### Quand écrire des tests
- **Logique métier** (calcul d'horaires, routines) → TOUJOURS tester
- **Composants UI** → tester les interactions critiques
- **API endpoints** → tester les cas normaux et les erreurs
- **E2E** → parcours utilisateur clés (réveil → briefing → départ)

### Convention
- Fichier de test à côté du fichier source : `alarm.ts` → `alarm.test.ts`
- Nommage des tests : `describe('AlarmService')` → `it('should calculate wake-up time based on commute')`

---

## Documentation continue

### Quoi documenter
- **Chaque décision technique** → pourquoi ce choix, quelles alternatives
- **Chaque sprint** → objectifs, résultats, apprentissages
- **L'architecture** → schémas, flux de données
- **Les APIs** → endpoints, paramètres, réponses
- **Les learnings** → ce qu'on apprend à chaque étape

### Structure de la documentation
```
docs/
├── vision/          → Contexte, fonctionnalités, choix techniques, méthodo
├── architecture/    → Schémas, flux, modèle de données
├── features/        → Specs détaillées par fonctionnalité
├── sprints/         → Journal de chaque sprint
├── api/             → Documentation des APIs (internes et externes)
├── design/          → Maquettes, wireframes, charte graphique
└── learning/        → Notes d'apprentissage, patterns étudiés
```

---

## Multi-poste — Workflow

### Postes de travail
- **Poste travail** : développement principal
- **Poste perso** : développement complémentaire

### Synchronisation
- Tout passe par **GitHub**
- `git push` avant de quitter un poste
- `git pull` en arrivant sur l'autre poste
- Jamais de travail non-commité laissé en suspens

### Règle d'or
> Avant de fermer le laptop : `git add . && git commit && git push`
