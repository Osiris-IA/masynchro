# MaSynchro — Design Patterns

## Date de rédaction
2026-09-20

---

## Pourquoi des patterns ?

Un pattern, c'est une **solution éprouvée à un problème récurrent**. Ce n'est pas de la théorie abstraite — c'est un outil concret qui rend le code plus maintenable, testable et évolutif.

MaSynchro utilise 5 patterns principaux. Chacun résout un problème précis dans l'app.

---

## 1. Repository Pattern

### Le problème
L'app stocke des données dans Supabase. Si demain on change pour une autre base, il faudrait modifier du code partout.

### La solution
Une **interface** (le contrat) qui définit les opérations possibles, et une **implémentation** qui fait le travail réel. Le reste de l'app ne connaît que l'interface.

### Exemple concret dans MaSynchro

```ts
// features/alarm/domain/types.ts — LE CONTRAT
interface AlarmRepository {
  save(alarm: Alarm): Promise<void>
  getByUserId(userId: string): Promise<Alarm | null>
  delete(alarmId: string): Promise<void>
}

// features/alarm/services/supabaseAlarmRepository.ts — L'IMPLÉMENTATION
class SupabaseAlarmRepository implements AlarmRepository {
  async save(alarm: Alarm) {
    await supabase.from('alarms').upsert({
      id: alarm.id,
      user_id: alarm.userId,
      wake_up_time: alarm.wakeUpTime,
      is_active: alarm.isActive,
    })
  }

  async getByUserId(userId: string) {
    const { data } = await supabase
      .from('alarms')
      .select()
      .eq('user_id', userId)
      .single()
    return data ? mapToAlarm(data) : null
  }

  async delete(alarmId: string) {
    await supabase.from('alarms').delete().eq('id', alarmId)
  }
}
```

### Si l'app évolue (migration vers Prisma par exemple)

```ts
// features/alarm/services/prismaAlarmRepository.ts — NOUVELLE IMPLÉMENTATION
class PrismaAlarmRepository implements AlarmRepository {
  async save(alarm: Alarm) {
    await prisma.alarm.upsert({
      where: { id: alarm.id },
      create: alarm,
      update: alarm,
    })
  }
  // ... même interface, seul le code interne change
}
// Le reste de l'app ne change PAS — il utilise AlarmRepository, pas Supabase
```

### Où dans MaSynchro
- `features/alarm/services/alarmRepository.ts`
- `features/routine/services/routineRepository.ts`
- `features/profile/services/profileRepository.ts`

---

## 2. Adapter Pattern

### Le problème
Les APIs externes (OpenWeatherMap, Google Maps, Navitia) renvoient des données dans LEUR format. Si on utilise ces formats partout dans l'app, on est lié à eux. Et si on change de fournisseur météo, on casse tout.

### La solution
Un **adaptateur** qui traduit le format externe vers le format interne de l'app. L'app ne connaît que SON format.

### Exemple concret dans MaSynchro

```ts
// features/weather/domain/types.ts — LE FORMAT INTERNE (ce que l'app veut)
interface WeatherData {
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy'
  humidity: number
  windSpeed: number
  advice: string        // Conseil généré par genereConseilMeteo()
  extraMinutes: number  // Minutes supplémentaires à ajouter au trajet
}

// features/weather/services/weatherAdapter.ts — L'ADAPTATEUR
class OpenWeatherMapAdapter {
  async getWeather(lat: number, lon: number): Promise<WeatherData> {
    // Appelle le backend (qui proxy OpenWeatherMap)
    const raw = await apiClient.get('/api/weather', { lat, lon })

    // TRADUIT le format OpenWeatherMap → le format MaSynchro
    return {
      temperature: raw.main.temp,
      condition: this.mapCondition(raw.weather[0].id),
      humidity: raw.main.humidity,
      windSpeed: raw.wind.speed,
      advice: '',        // sera rempli par le domain
      extraMinutes: 0,   // sera calculé par le domain
    }
  }

  private mapCondition(code: number): WeatherData['condition'] {
    if (code >= 200 && code < 300) return 'stormy'
    if (code >= 300 && code < 600) return 'rainy'
    if (code >= 600 && code < 700) return 'snowy'
    if (code >= 800) return 'sunny'
    return 'cloudy'
  }
}
```

### Si l'app évolue (changement de fournisseur météo)

```ts
// features/weather/services/weatherAdapter.ts — NOUVEAU FOURNISSEUR
class WeatherAPIAdapter {
  async getWeather(lat: number, lon: number): Promise<WeatherData> {
    const raw = await apiClient.get('/api/weather-v2', { lat, lon })
    // Traduit le NOUVEAU format → même format MaSynchro
    return { temperature: raw.current.temp_c, ... }
  }
}
// Le domain/ et les composants ne changent PAS
```

### Où dans MaSynchro
- `features/weather/services/weatherAdapter.ts`
- `features/transport/services/transportAdapter.ts`
- `features/voice/services/ttsAdapter.ts`

---

## 3. Strategy Pattern

### Le problème
MaSynchro utilise Edge TTS pour la voix en v1, ElevenLabs en v2, et Claude API en v3. On ne veut pas réécrire le code qui UTILISE la voix à chaque changement.

### La solution
Une **interface commune** pour toutes les stratégies de TTS. Le code appelant ne sait pas quelle stratégie est utilisée.

### Exemple concret dans MaSynchro

```ts
// features/voice/domain/types.ts — L'INTERFACE COMMUNE
interface TTSEngine {
  speak(text: string, options?: TTSOptions): Promise<void>
  stop(): void
  isAvailable(): Promise<boolean>
}

interface TTSOptions {
  language: string
  rate: number    // vitesse
  pitch: number   // tonalité
  voice?: string  // voix spécifique
}

// features/voice/services/edgeTTSEngine.ts — STRATÉGIE 1 (MVP)
class EdgeTTSEngine implements TTSEngine {
  async speak(text: string, options?: TTSOptions) {
    const audio = await apiClient.post('/api/voice', { text, ...options })
    await playAudio(audio)
  }
  stop() { stopAudio() }
  async isAvailable() { return navigator.onLine }
}

// features/voice/services/elevenLabsEngine.ts — STRATÉGIE 2 (v2)
class ElevenLabsEngine implements TTSEngine {
  async speak(text: string, options?: TTSOptions) {
    const audio = await elevenLabsAPI.generate({ text, voice: options?.voice })
    await playAudio(audio)
  }
  stop() { stopAudio() }
  async isAvailable() { return navigator.onLine && hasApiKey() }
}

// features/voice/services/expoSpeechEngine.ts — STRATÉGIE FALLBACK (offline)
class ExpoSpeechEngine implements TTSEngine {
  async speak(text: string, options?: TTSOptions) {
    await Speech.speak(text, { language: options?.language ?? 'fr-FR' })
  }
  stop() { Speech.stop() }
  async isAvailable() { return true } // toujours disponible, c'est local
}
```

### Utilisation — le code appelant ne change jamais

```ts
// features/voice/hooks/useVoice.ts
function useVoice() {
  const engine = selectTTSEngine() // choisit selon les préférences et la dispo

  const speak = async (text: string) => {
    if (await engine.isAvailable()) {
      await engine.speak(text, { language: 'fr-FR', rate: 1.0, pitch: 1.0 })
    }
  }

  return { speak, stop: engine.stop }
}
```

---

## 4. Facade Pattern

### Le problème
Le briefing matinal a besoin de 4 sources : météo, transport, routine, voix. L'écran principal ne devrait pas gérer cette complexité.

### La solution
Un **hook façade** qui cache la complexité derrière une interface simple.

### Exemple concret dans MaSynchro

```ts
// features/voice/hooks/useBriefing.ts — LA FACADE
function useBriefing() {
  const weather = useWeather()
  const transport = useTransport()
  const routine = useRoutine()
  const { speak } = useVoice()

  const playMorningBriefing = async () => {
    // Le domain compose le texte (logique pure)
    const text = composeBriefing({
      weather: weather.data,
      transport: transport.data,
      routine: routine.timeline,
    })

    // La voix le lit
    await speak(text)
  }

  return {
    playMorningBriefing,
    isLoading: weather.isLoading || transport.isLoading,
    isReady: weather.data && transport.data && routine.timeline,
  }
}

// app/(tabs)/index.tsx — L'ÉCRAN (simple !)
function HomeScreen() {
  const { playMorningBriefing, isReady } = useBriefing()

  return (
    <View>
      <Button
        title="Lancer le briefing"
        onPress={playMorningBriefing}
        disabled={!isReady}
      />
    </View>
  )
}
// L'écran ne sait RIEN de la météo, des transports, ou du TTS
// Il connaît juste useBriefing() — c'est ça la façade
```

---

## 5. Observer Pattern (via Zustand)

### Le problème
Quand l'heure de réveil change, plusieurs écrans doivent se mettre à jour : le dashboard, le widget, la notification.

### La solution
Les composants **s'abonnent** à un store. Quand les données changent, ils se mettent à jour automatiquement.

### Exemple concret dans MaSynchro

```ts
// features/alarm/store/alarmStore.ts — LE STORE (le sujet observé)
import { create } from 'zustand'

interface AlarmState {
  wakeUpTime: string | null
  isActive: boolean
  setWakeUpTime: (time: string) => void
  toggleAlarm: () => void
}

const useAlarmStore = create<AlarmState>((set) => ({
  wakeUpTime: null,
  isActive: false,
  setWakeUpTime: (time) => set({ wakeUpTime: time }),
  toggleAlarm: () => set((state) => ({ isActive: !state.isActive })),
}))

// features/alarm/components/AlarmCard.tsx — OBSERVATEUR 1
function AlarmCard() {
  const { wakeUpTime, isActive } = useAlarmStore()
  // Se met à jour AUTOMATIQUEMENT quand wakeUpTime change
  return <Text>{isActive ? `Réveil à ${wakeUpTime}` : 'Pas de réveil'}</Text>
}

// app/(tabs)/index.tsx — OBSERVATEUR 2 (autre écran)
function HomeScreen() {
  const wakeUpTime = useAlarmStore((state) => state.wakeUpTime)
  // Se met à jour aussi, indépendamment de AlarmCard
  return <DashboardHeader nextAlarm={wakeUpTime} />
}

// Le store ne sait PAS qui l'écoute. Les composants ne savent PAS
// qui d'autre écoute. Tout est découplé.
```

---

## Résumé — quel pattern pour quel problème

| Problème | Pattern | Fichier dans MaSynchro |
|---|---|---|
| Changer de BDD sans tout casser | **Repository** | `features/*/services/*Repository.ts` |
| Changer d'API externe sans tout casser | **Adapter** | `features/*/services/*Adapter.ts` |
| Changer d'implémentation (TTS, auth...) | **Strategy** | `features/voice/services/*Engine.ts` |
| Cacher la complexité d'un use case | **Facade** | `features/voice/hooks/useBriefing.ts` |
| Réagir aux changements de données | **Observer** | `features/*/store/*Store.ts` |

---

## Patterns à venir (v2+)

| Pattern | Quand | Pourquoi |
|---|---|---|
| **Factory** | v2 — Génération de conseils météo/transport | Créer le bon type de conseil selon les conditions |
| **Singleton** | v2 — Client Supabase | Un seul client partagé dans toute l'app |
| **State Machine** | v2 — Mode retard | Gérer les transitions d'état (normal → retard → rattrapé → trop tard) |
| **Event Bus** | v3 — Cascades complexes | Quand modifier une donnée déclenche 5+ actions |
