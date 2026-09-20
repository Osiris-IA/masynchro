# Fonctionnalités

## Date de rédaction
2026-09-12

---

## MVP (v1) — Le minimum pour valider l'idée

### F1 — Réveil adaptatif
- **Description** : calcule l'heure optimale de réveil selon l'heure d'arrivée souhaitée, le temps de trajet en temps réel, et le temps de préparation personnel
- **Entrées** : heure d'arrivée au travail, adresse domicile/travail, durée de préparation
- **Sorties** : heure de réveil calculée, alarme déclenchée
- **Pourquoi MVP** : c'est le coeur de l'app, sans ça rien n'a de sens

### F2 — Routine personnalisable
- **Description** : l'utilisateur définit ses étapes matinales (douche, café, méditation, sport...) avec des durées estimées
- **Entrées** : liste d'étapes, durée de chaque étape
- **Sorties** : timeline matinale générée
- **Pourquoi MVP** : chaque utilisateur est différent, la personnalisation est clé

### F3 — Météo contextuelle
- **Description** : pas juste la température, mais des conseils concrets
- **Exemples** :
  - "Il pleut, prends un parapluie, ajoute 5 min de marche"
  - "Grand soleil, lunettes et crème solaire"
  - "Verglas, fais attention en sortant"
- **API** : OpenWeatherMap (gratuit)
- **Pourquoi MVP** : impacte directement le temps de préparation et le trajet

### F4 — Transports en temps réel
- **Description** : état du trafic et des transports en commun, avec recalcul automatique
- **Exemples** :
  - "Ligne 13 perturbée, pars 15 min plus tôt"
  - "Trafic fluide, tu peux prendre ton temps"
- **APIs possibles** : Google Maps Directions, API RATP/SNCF, Navitia
- **Pourquoi MVP** : c'est le facteur n°1 de retard imprévu

### F5 — Voix accompagnante (basique)
- **Description** : text-to-speech avec ton bienveillant aux moments clés
- **Moments de parole** :
  - Réveil : briefing matinal (météo, trajet, ton de la journée)
  - Transitions : "c'est le moment de te préparer"
  - Départ : "tu peux y aller, tout est bon"
  - Encouragement : "belle matinée, t'es prête !"
- **Tech v1** : Edge TTS (Microsoft) — gratuit, qualité correcte en français
- **Pourquoi MVP** : c'est le DIFFERENCIATEUR de l'app

### F6 — Mode "je suis en retard"
- **Description** : si l'utilisateur prend du retard, l'app recalcule la routine en temps réel
- **Comportement** : JAMAIS de culpabilisation. Rassurer et réorganiser.
- **Exemples** :
  - "Pas de stress, si tu skip le café tu seras pile à l'heure"
  - "Le prochain métro est dans 8 min, ça passe encore"
- **Pourquoi MVP** : gère le scénario le plus stressant du matin

---

## v1.5 — Améliorations rapides après feedback

### F7 — Intégration Spotify / Musique / Podcast
- **Description** : lancer automatiquement de la musique ou un podcast selon le moment
- **Moments** :
  - Réveil → playlist douce, volume progressif
  - Préparation → playlist énergie ou podcast quotidien
  - Trajet → reprise du podcast là où on s'est arrêté
  - En avance → "T'as 10 min, un petit podcast ?"
- **APIs** : Spotify Web API, RadioBrowser API (radio gratuite)
- **Option** : choix entre Spotify, Apple Music, radio, ou silence

### F8 — Widget écran d'accueil
- **Description** : voir sa timeline matinale sans ouvrir l'app
- **Contenu** : heure de réveil, prochaine étape, météo, état trajet

---

## v2 — Intelligence avancée

### F9 — Voix naturelle avancée
- **Description** : voix IA ultra-naturelle et émotionnelle
- **Tech** : ElevenLabs API
- **Evolution** : phrases générées par IA (Claude API) pour ne jamais répéter les mêmes scripts

### F10 — Intégration calendrier
- **Description** : lecture du calendrier pour adapter la routine automatiquement
- **Exemple** : réunion à 8h30 au lieu de 9h → tout est recalculé

### F11 — Analyse de sommeil
- **Description** : via HealthKit (iOS) / Google Fit (Android)
- **Usage** : adapter le réveil aux cycles de sommeil pour se réveiller au meilleur moment

### F12 — Mode couple/coloc
- **Description** : synchroniser les routines de plusieurs personnes
- **Cas d'usage** : une salle de bain partagée, des horaires différents

---

## v3 — Vision long terme

### F13 — Watch connectée
- **Description** : vibration douce au poignet, notifications discrètes
- **Plateformes** : Apple Watch, Wear OS

### F14 — Gamification douce
- **Description** : PAS de streak culpabilisant
- **Exemples** :
  - "3 matinées zen cette semaine, bravo"
  - Statistiques positives (temps moyen de préparation, matinées sans stress)

### F15 — Mode offline
- **Description** : la routine de base fonctionne même sans internet
- **Dégradation** : pas de transports en temps réel, mais la timeline et l'alarme marchent

### F16 — IA conversationnelle
- **Description** : l'utilisateur peut parler à l'app vocalement
- **Exemple** : "Hey, j'ai pas envie de me lever" → réponse adaptée et bienveillante
