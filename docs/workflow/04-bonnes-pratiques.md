# MaSynchro — Bonnes Pratiques

## Date de rédaction
2026-09-20

---

## Code

| Règle | Pourquoi |
|---|---|
| **TypeScript strict** (`strict: true` dans tsconfig) | Attrape les bugs au moment de la compilation, pas en production |
| **Zéro `any`** | Si tu mets `any`, TypeScript ne protège plus rien. Utiliser `unknown` si le type est vraiment inconnu |
| **Imports absolus** (`@/features/alarm/...`) | Plus lisible que `../../../features/alarm/...` |
| **Un fichier = une responsabilité** | Pas de fichier de 500 lignes qui fait tout |
| **domain/ = zéro dépendance externe** | La logique métier ne connaît ni React, ni Supabase, ni Zustand |
| **Pas de logique dans les composants** | Les composants **affichent**, les hooks **pensent**, le domain **calcule** |
| **Variables d'environnement pour les clés** | Jamais de clé API, URL secrète ou mot de passe en dur dans le code |
| **Gestion d'erreurs aux frontières** | Gérer les erreurs dans les services (API, BDD), pas dans le domain |

---

## Nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composants React | PascalCase | `AlarmCard.tsx`, `WeatherAdvice.tsx` |
| Hooks | camelCase avec préfixe `use` | `useAdaptiveAlarm.ts`, `useWeather.ts` |
| Domain (fonctions) | camelCase, verbe descriptif | `calculeHeureReveil()`, `genereTimeline()` |
| Services | camelCase + suffixe | `alarmRepository.ts`, `weatherAdapter.ts` |
| Stores Zustand | camelCase + suffixe `Store` | `alarmStore.ts`, `profileStore.ts` |
| Types/Interfaces | PascalCase | `Alarm`, `RoutineStep`, `WeatherData` |
| Constantes | UPPER_SNAKE_CASE | `MAX_SNOOZE_COUNT`, `API_TIMEOUT` |
| Fichiers de test | `*.test.ts` dans `__tests__/` | `calculeHeureReveil.test.ts` |
| Branches Git | kebab-case avec préfixe | `feature/alarm-adaptive`, `fix/notification-crash` |

---

## Structure d'un composant React

```tsx
// 1. Imports
import { View, Text } from 'react-native'
import { Button } from '@/shared/components'
import { useAlarmStore } from '../store/alarmStore'

// 2. Types (si spécifiques au composant)
interface AlarmCardProps {
  onToggle: () => void
}

// 3. Composant (export nommé, pas default)
export function AlarmCard({ onToggle }: AlarmCardProps) {
  // 4. Hooks en haut
  const { wakeUpTime, isActive } = useAlarmStore()

  // 5. Pas de logique complexe ici — c'est dans le hook ou le domain

  // 6. Render
  return (
    <View>
      <Text>{isActive ? `Réveil à ${wakeUpTime}` : 'Pas de réveil'}</Text>
      <Button title="Toggle" onPress={onToggle} />
    </View>
  )
}
```

---

## Structure d'un hook

```ts
// 1. Imports
import { useEffect, useState } from 'react'
import { calculeHeureReveil } from '../domain/calculeHeureReveil'
import { useAlarmStore } from '../store/alarmStore'
import { alarmRepository } from '../services/alarmRepository'

// 2. Le hook orchestre : domain + services + store
export function useAdaptiveAlarm() {
  const { setWakeUpTime } = useAlarmStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculate = async (params: AlarmParams) => {
    setIsLoading(true)
    setError(null)
    try {
      // Appel au domain (logique pure)
      const time = calculeHeureReveil(params)

      // Mise à jour du store
      setWakeUpTime(time)

      // Persistance via le repository
      await alarmRepository.save({ ...params, wakeUpTime: time })
    } catch (e) {
      setError('Impossible de calculer l\'heure de réveil')
    } finally {
      setIsLoading(false)
    }
  }

  return { calculate, isLoading, error }
}
```

---

## Structure d'une fonction domain

```ts
// RÈGLE : fonction PURE
// - Pas d'import React, Supabase, fetch, ou quoi que ce soit d'externe
// - Entrée → Sortie, déterministe, testable à 100%

interface AlarmParams {
  heureArrivee: string       // "09:00"
  tempsTrajet: number        // minutes
  tempsPreparation: number   // minutes
  meteo?: {
    condition: string
    extraMinutes: number
  }
}

export function calculeHeureReveil(params: AlarmParams): string {
  const { heureArrivee, tempsTrajet, tempsPreparation, meteo } = params

  const [heures, minutes] = heureArrivee.split(':').map(Number)
  const arriveeMinutes = heures * 60 + minutes

  const totalMinutes = tempsTrajet + tempsPreparation + (meteo?.extraMinutes ?? 0)
  const reveilMinutes = arriveeMinutes - totalMinutes

  const h = Math.floor(reveilMinutes / 60)
  const m = reveilMinutes % 60

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
```

---

## Sécurité

| Règle | Application |
|---|---|
| **Clés API côté serveur uniquement** | OpenWeatherMap, Google Maps, ElevenLabs → dans les variables d'env Vercel |
| **Supabase Row Level Security (RLS)** | Chaque utilisateur ne peut voir/modifier que SES données |
| **Pas de secrets dans le code** | `.env` dans `.gitignore`, secrets dans GitHub Secrets / Vercel Settings |
| **Validation des entrées** | Valider côté backend ce qui vient du mobile |
| **HTTPS partout** | Vercel et Supabase le font automatiquement |
| **Auth tokens** | Gérés par Supabase, stockés sécurisé via expo-secure-store |

---

## Performance mobile

| Règle | Pourquoi |
|---|---|
| **Memo les composants lourds** | `React.memo()` évite les re-renders inutiles |
| **Sélecteurs Zustand précis** | `useAlarmStore(s => s.wakeUpTime)` au lieu de `useAlarmStore()` |
| **Images optimisées** | Pas d'images de 5 Mo pour une icône |
| **Lazy loading des features v1.5+** | Ne pas charger Spotify si l'utilisateur ne l'utilise pas |
| **Cache des appels API** | Ne pas rappeler la météo toutes les 10 secondes |

---

## Licence — AGPL-3.0

MaSynchro est open source sous licence **AGPL-3.0** (GNU Affero General Public License).

### Ce que ça signifie

| Action | Autorisé ? |
|---|---|
| Voir le code | ✅ Oui, c'est public |
| Utiliser l'app | ✅ Oui, librement |
| Modifier le code | ✅ Oui, mais tu DOIS publier tes modifications |
| Faire une version commerciale | ✅ Oui, mais tu DOIS publier le code source |
| Copier sans partager le code | ❌ Non, interdit par AGPL |

### Pourquoi AGPL et pas MIT ?
- MIT = n'importe qui peut prendre ton code, faire une version payante, sans rien partager
- AGPL = si quelqu'un modifie et déploie MaSynchro, il DOIT publier ses modifications
- C'est le bon compromis : open source pour le portfolio et la communauté, protégé contre l'exploitation commerciale sans retour
