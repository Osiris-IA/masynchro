# MaSynchro — Pipeline CI/CD

## Date de rédaction
2026-09-20

---

## Vue d'ensemble

La pipeline CI/CD automatise la vérification et le déploiement du code. À chaque push ou PR, GitHub Actions exécute une série de vérifications.

```
Push / PR sur GitHub
  │
  ▼
┌─────────────────────────────────────────────────────────┐
│                    GitHub Actions                        │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Stage 1 — Qualité du code (~1 min, parallèle)  │    │
│  │  ├── 🔍 ESLint        → erreurs et warnings     │    │
│  │  ├── 🎨 Prettier      → vérification formatage  │    │
│  │  └── 🔒 TypeScript    → tsc --noEmit (typage)   │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                │
│                    ✅ ou ❌                               │
│                         │                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Stage 2 — Tests (~2-3 min)                     │    │
│  │  ├── 🧪 Jest          → tests unitaires          │    │
│  │  ├── 🧩 RNTL          → tests de composants      │    │
│  │  └── 📊 Coverage      → rapport de couverture    │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Stage 3 — Analyse statique (~2 min)            │    │
│  │  └── 🔬 SonarCloud    → bugs, smells, sécu,     │    │
│  │                          duplication, couverture │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Stage 4 — Build (~3 min)                       │    │
│  │  └── 📦 Expo build    → vérifie la compilation  │    │
│  └─────────────────────────────────────────────────┘    │
│                         │                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Stage 5 — Review IA (sur les PRs uniquement)   │    │
│  │  └── 🤖 Claude Review → commentaires inline     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ✅ Tout vert → PR prête pour merge                     │
│  ❌ Un échec → PR bloquée, notification, tu corriges    │
└─────────────────────────────────────────────────────────┘
```

---

## SonarCloud

### Qu'est-ce que c'est
SonarCloud est un service d'analyse statique de code dans le cloud. Il détecte automatiquement les problèmes de qualité.

### Pourquoi SonarCloud (et pas SonarQube)
- **SonarQube** = à installer sur ton propre serveur → lourd, pas adapté projet solo
- **SonarCloud** = version cloud, **gratuit pour les projets open source** → parfait pour MaSynchro

### Ce qu'il détecte

| Catégorie | Ce qu'il cherche | Exemple |
|---|---|---|
| **Bugs** | Erreurs logiques | Variable utilisée avant initialisation |
| **Code Smells** | Code qui fonctionne mais est mal écrit | Fonction de 200 lignes, paramètres inutilisés |
| **Vulnérabilités** | Failles de sécurité | Clé API en dur, injection possible |
| **Couverture** | % du code testé | Objectif : > 80% sur le domain/ |
| **Duplications** | Code copié-collé | Objectif : < 3% |

### Quality Gate — le gardien

SonarCloud bloque la PR si les seuils ne sont pas respectés :

```
Quality Gate: ✅ Passed (ou ❌ Failed)

  Nouveau code :
    Coverage:        82.3%    (seuil minimum : 80%)
    Duplications:     1.2%    (seuil maximum : 3%)
    Bugs:             0       (seuil : 0)
    Vulnerabilities:  0       (seuil : 0)
    Code Smells:      3       (warning, à traiter)
```

### Seuils pour MaSynchro

| Métrique | Seuil | Pourquoi |
|---|---|---|
| Couverture sur nouveau code | ≥ 80% | Le domain/ doit être testé à 90%+, le reste compense |
| Duplications | ≤ 3% | Éviter le copier-coller |
| Bugs | 0 | Non négociable |
| Vulnérabilités | 0 | Non négociable |
| Code Smells | Pas de blocage | Warning pour amélioration continue |

---

## Review par Claude

### Review manuelle (dans le terminal)

```bash
# Review du diff courant (modifications non commitées)
claude /code-review

# Review avec corrections automatiques
claude /code-review --fix

# Review d'une PR GitHub
claude /review
```

### Ce que Claude vérifie
- Bugs logiques (conditions inversées, cas limites oubliés)
- Violations des patterns (domain/ qui importe Supabase, etc.)
- Code simplifiable ou dupliqué
- Problèmes de sécurité
- Respect des conventions du projet (défini dans CLAUDE.md)
- Suggestions d'amélioration

### Review automatique sur PR (GitHub Actions)
Quand un abonnement Claude sera actif, une étape CI pourra lancer la review automatiquement sur chaque PR et poster des commentaires inline.

---

## Déploiement

### Environnements

**MVP** : 2 environnements (dev + prod). Le staging viendra plus tard.

```
develop (branche)                    main (branche)
      │                                    │
      ▼                                    ▼
┌──────────────┐                  ┌──────────────┐
│     DEV      │                  │   PRODUCTION  │
│              │                  │               │
│ Vercel       │                  │ Vercel Prod   │
│  Preview     │                  │               │
│              │                  │ Supabase Prod │
│ Supabase Dev │                  │               │
│              │                  │ EAS Prod      │
│ Tu développes│                  │ Les users     │
│ tu casses,   │                  │ voient cette  │
│ c'est normal │                  │ version       │
└──────────────┘                  └──────────────┘
```

### Déploiement automatique

| Événement | Action |
|---|---|
| Push sur `develop` | Vercel déploie un aperçu (preview URL) |
| Merge sur `main` | Vercel déploie en production automatiquement |
| Tag de release | EAS build mobile (iOS + Android) |

### Déploiement mobile (EAS)

```bash
# Build de développement (pour tester sur ton téléphone)
eas build --profile development --platform all

# Build de preview (pour faire tester à d'autres)
eas build --profile preview --platform all

# Build de production (pour les stores)
eas build --profile production --platform all

# Soumettre sur les stores
eas submit --platform ios
eas submit --platform android
```

### Variables d'environnement

```
Chaque environnement a ses propres variables :

DEV (.env.development)
├── SUPABASE_URL=https://xxx.supabase.co        (projet dev)
├── SUPABASE_ANON_KEY=eyJ...                     (clé dev)
└── API_URL=https://dev.masynchro.vercel.app

PROD (.env.production)
├── SUPABASE_URL=https://yyy.supabase.co         (projet prod)
├── SUPABASE_ANON_KEY=eyJ...                     (clé prod)
└── API_URL=https://masynchro.vercel.app

⚠️ Les fichiers .env ne sont JAMAIS commitrés dans Git
   → Ils sont dans .gitignore
   → Les vrais secrets sont dans les Settings de Vercel/GitHub
```
