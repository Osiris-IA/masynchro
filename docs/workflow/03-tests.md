# MaSynchro — Stratégie de Tests

## Date de rédaction
2026-09-20

---

## Pyramide de tests

```
              /    E2E (Detox)     \          3-5 tests
             /   Parcours critiques \         "réveil → briefing → départ"
            /─────────────────────────\
           / Composants (RNTL)         \      ~20-30 tests
          /  Interactions utilisateur    \     "l'user modifie sa routine"
         /───────────────────────────────\
        /     Unitaires (Jest)            \   ~100+ tests
       /   Logique métier pure             \  "calculeHeureReveil() === 7h25"
      /─────────────────────────────────────\
```

**Règle** : plus on monte dans la pyramide, moins on écrit de tests mais plus ils coûtent cher (lents, fragiles). L'essentiel est en bas.

---

## Par couche — quoi tester et comment

### domain/ — Tests unitaires (PRIORITÉ MAXIMALE)

C'est ici que le TDD (Test-Driven Development) prend tout son sens.

**Méthode TDD** :
1. Écrire le test AVANT le code
2. Lancer le test → il échoue (rouge)
3. Écrire le minimum de code pour que le test passe (vert)
4. Refactoriser si nécessaire
5. Recommencer

```ts
// features/alarm/domain/__tests__/calculeHeureReveil.test.ts

describe('calculeHeureReveil', () => {
  it('doit soustraire le temps de trajet et de préparation', () => {
    const result = calculeHeureReveil({
      heureArrivee: '09:00',
      tempsTrajet: 45,    // minutes
      tempsPreparation: 40,
    })
    expect(result).toBe('07:35')
  })

  it('doit ajouter du temps si pluie', () => {
    const result = calculeHeureReveil({
      heureArrivee: '09:00',
      tempsTrajet: 45,
      tempsPreparation: 40,
      meteo: { condition: 'rainy', extraMinutes: 10 },
    })
    expect(result).toBe('07:25')
  })

  it('ne doit jamais retourner une heure dans le passé', () => {
    const result = calculeHeureReveil({
      heureArrivee: '09:00',
      tempsTrajet: 600, // 10 heures ?!
      tempsPreparation: 40,
    })
    // doit gérer le cas gracieusement
    expect(result).toBeDefined()
  })
})
```

**Couverture cible** : > 90% sur tout le domain/

### hooks/ — Tests d'intégration légère

```ts
// features/alarm/hooks/__tests__/useAdaptiveAlarm.test.ts

describe('useAdaptiveAlarm', () => {
  it('doit mettre à jour le store quand le calcul est fait', async () => {
    // Mock du repository et de l'adapter
    const mockWeather = { condition: 'sunny', extraMinutes: 0 }
    const mockTransport = { duration: 45 }

    const { result } = renderHook(() => useAdaptiveAlarm())

    await act(async () => {
      await result.current.calculate({
        heureArrivee: '09:00',
        weather: mockWeather,
        transport: mockTransport,
      })
    })

    expect(result.current.wakeUpTime).toBe('07:35')
  })
})
```

### components/ — Tests de composants (interactions clés)

```ts
// features/alarm/components/__tests__/AlarmCard.test.tsx

describe('AlarmCard', () => {
  it('doit afficher l\'heure de réveil', () => {
    render(<AlarmCard wakeUpTime="07:25" isActive={true} />)
    expect(screen.getByText('07:25')).toBeTruthy()
  })

  it('doit appeler onToggle quand on appuie', () => {
    const onToggle = jest.fn()
    render(<AlarmCard wakeUpTime="07:25" isActive={true} onToggle={onToggle} />)
    fireEvent.press(screen.getByRole('switch'))
    expect(onToggle).toHaveBeenCalled()
  })
})
```

### services/ — Tests avec mocks

```ts
// features/alarm/services/__tests__/alarmRepository.test.ts

describe('SupabaseAlarmRepository', () => {
  it('doit sauvegarder une alarme', async () => {
    const mockSupabase = createMockSupabase()
    const repo = new SupabaseAlarmRepository(mockSupabase)

    await repo.save({ id: '1', userId: 'user-1', wakeUpTime: '07:25', isActive: true })

    expect(mockSupabase.from).toHaveBeenCalledWith('alarms')
  })

  it('doit retourner null si aucune alarme trouvée', async () => {
    const mockSupabase = createMockSupabase({ data: null })
    const repo = new SupabaseAlarmRepository(mockSupabase)

    const result = await repo.getByUserId('user-inexistant')

    expect(result).toBeNull()
  })
})
```

### E2E — Parcours critiques (Detox)

```ts
// e2e/morningFlow.test.ts

describe('Parcours matinal complet', () => {
  it('doit permettre de configurer et recevoir un réveil', async () => {
    // 1. Onboarding
    await element(by.id('address-input')).typeText('10 rue de la Paix, Paris')
    await element(by.id('arrival-time')).tap()
    await element(by.text('09:00')).tap()
    await element(by.id('next-button')).tap()

    // 2. Dashboard affiche l'heure de réveil
    await expect(element(by.id('wake-up-time'))).toBeVisible()

    // 3. Briefing est disponible
    await expect(element(by.id('briefing-button'))).toBeVisible()
  })
})
```

---

## Convention de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Fichier de test | À côté du fichier source | `alarm.ts` → `__tests__/alarm.test.ts` |
| describe | Nom du module/composant | `describe('calculeHeureReveil')` |
| it/test | "doit" + comportement attendu | `it('doit soustraire le temps de trajet')` |
| Mock | Préfixé par `mock` | `mockWeatherAdapter`, `mockSupabase` |

---

## Quand écrire des tests

| Situation | Tester ? | Comment |
|---|---|---|
| Nouveau fichier dans `domain/` | **Toujours (TDD)** | Test d'abord, code ensuite |
| Nouveau composant UI | Si interaction critique | RNTL |
| Nouveau service/repository | Les cas d'erreur | Jest + mocks |
| Bug fix | **Toujours** | Écrire un test qui reproduit le bug AVANT de le fixer |
| Refactoring | Les tests existants doivent toujours passer | Ne pas toucher aux tests |

---

## Outils

| Outil | Rôle | Commande |
|---|---|---|
| **Jest** | Runner de tests, assertions | `npm test` |
| **React Native Testing Library** | Render + interactions composants | Utilisé dans Jest |
| **Detox** | Tests E2E sur simulateur/émulateur | `detox test` |
| **jest --coverage** | Rapport de couverture | `npm test -- --coverage` |
