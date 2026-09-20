# MaSynchro — Git Hooks et Conventions de Commits

## Date de rédaction
2026-09-20

---

## Git Hooks (Husky + lint-staged + commitlint)

Les hooks Git sont des scripts qui s'exécutent automatiquement à chaque action Git. Ils empêchent de pousser du code sale ou mal formaté.

### Outils

| Outil | Rôle |
|---|---|
| **Husky** | Exécute des scripts à chaque commit/push |
| **lint-staged** | Exécute ESLint/Prettier uniquement sur les fichiers modifiés (pas tout le projet) |
| **commitlint** | Vérifie que le message de commit respecte le format Conventional Commits |

### Quand ça se déclenche

```
git commit -m "feat(alarm): add wake-up calculation"
  │
  ├── 🔍 Hook pre-commit (Husky + lint-staged)
  │     Exécute sur les fichiers stagés :
  │     ├── ESLint → vérifie les erreurs de code
  │     ├── Prettier → formate automatiquement
  │     └── Si erreur ESLint non-fixable → ❌ commit bloqué
  │
  ├── 📝 Hook commit-msg (commitlint)
  │     Vérifie le format du message :
  │     ├── "fix truc" → ❌ bloqué (pas de type, pas de scope)
  │     ├── "feat(alarm): add wake-up calculation" → ✅ passe
  │     └── "WIP" → ❌ bloqué
  │
  └── ✅ Commit créé

git push
  │
  ├── 🧪 Hook pre-push
  │     Lance les tests unitaires rapides
  │     └── Si un test échoue → ❌ push bloqué
  │
  └── ✅ Push envoyé vers GitHub
```

### Configuration

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

```yaml
# .commitlintrc.yml
extends: ['@commitlint/config-conventional']
rules:
  scope-enum: [2, always, [alarm, routine, weather, transport, voice, media, profile, shared, app, ci, docs]]
```

---

## Conventional Commits

### Format

```
type(scope): description courte (impératif, < 72 caractères)

[corps optionnel — explique le POURQUOI, pas le QUOI]

[footer optionnel — BREAKING CHANGE: ..., Refs #issue]
```

### Types autorisés

| Type | Quand l'utiliser | Exemple |
|---|---|---|
| `feat` | Nouvelle fonctionnalité | `feat(alarm): add adaptive wake-up calculation` |
| `fix` | Correction de bug | `fix(transport): handle API timeout gracefully` |
| `docs` | Documentation uniquement | `docs(architecture): add data flow diagram` |
| `style` | Formatage, pas de changement logique | `style: apply prettier to all files` |
| `refactor` | Restructuration sans changement de comportement | `refactor(routine): extract timeline logic to domain` |
| `test` | Ajout ou modification de tests | `test(alarm): add edge case for daylight saving` |
| `chore` | Maintenance, dépendances, config | `chore: upgrade expo to v52` |
| `ci` | Pipeline CI/CD | `ci: add sonar analysis step` |
| `perf` | Amélioration de performance | `perf(routine): memoize timeline calculation` |

### Scopes autorisés

```
alarm, routine, weather, transport, voice, media, profile, shared, app, ci, docs
```

### Exemples bons et mauvais

```
❌ "fix bug"                              → pas de scope, description vague
❌ "ajout du calcul de réveil"            → pas de type, en français
❌ "feat: alarm"                          → pas de scope, description = juste le scope
❌ "FEAT(ALARM): ADD CALCULATION"         → pas de majuscules

✅ "feat(alarm): add adaptive wake-up time calculation"
✅ "fix(transport): return cached data when API is unreachable"
✅ "test(routine): add unit tests for late mode recalculation"
✅ "docs(architecture): document repository pattern usage"
✅ "chore: configure eslint and prettier"
```

### Corps du commit (optionnel mais encouragé pour les features)

```
feat(voice): add morning briefing composition

The briefing is composed from weather, transport and routine data.
It uses the composeBriefing() domain function which is pure and testable.

Edge TTS is used for v1, with Expo Speech as offline fallback.

Refs #12
```

---

## Branches — Git Flow simplifié

```
main                ← Production, stable, déployé
├── develop         ← Intégration, pré-production
├── feature/*       ← Nouvelles fonctionnalités
│   ├── feature/alarm-adaptive
│   ├── feature/weather-integration
│   └── feature/voice-briefing
├── fix/*           ← Corrections de bugs
│   └── fix/notification-crash
└── docs/*          ← Documentation
    └── docs/architecture-patterns
```

### Workflow quotidien

```
1. Créer une branche depuis develop
   git checkout develop
   git pull
   git checkout -b feature/alarm-adaptive

2. Coder, commiter (les hooks vérifient tout)
   git add .
   git commit -m "feat(alarm): add wake-up time calculation"

3. Pousser et ouvrir une PR
   git push -u origin feature/alarm-adaptive
   → Ouvrir une PR vers develop sur GitHub

4. La pipeline CI vérifie tout automatiquement
   → Lint, tests, SonarCloud, build

5. Review (Claude + auto-review)
   → Merge dans develop

6. Quand develop est stable → merge dans main
   → Déploiement automatique en production
```

---

## Règle multi-poste

> Avant de fermer le laptop : `git add . && git commit && git push`
> En ouvrant le laptop : `git pull`

Jamais de travail non-commité laissé en suspens. GitHub est la source de vérité.
