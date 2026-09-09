# Cadence

Application mobile d'organisation : plannings, calendrier, tâches et déroulé
détaillé de chaque journée. Écrite en React Native avec Expo (SDK 57), elle
fonctionne sur iOS et Android à partir du même code.

Toutes les données restent **sur le téléphone** : aucun compte, aucun serveur,
fonctionnement hors ligne complet.

L'interface est sobre et construite autour du noir : fond quasi noir, surfaces à
peine détachées, un seul accent (blanc), et des couleurs de projet désaturées
qui servent uniquement à distinguer. Le thème clair existe et reste soigné :
`APPEARANCE` dans `src/hooks/use-color-scheme.ts` accepte `'dark'` (par défaut),
`'light'` ou `'system'` pour suivre le réglage du téléphone.

## Écrans

| Écran | Rôle |
| --- | --- |
| **Aujourd'hui** | Objectif du jour, avancement et déroulé horaire de la journée |
| **Calendrier** | Vue mois, charge de chaque journée en un coup d'œil, ouverture d'une journée |
| **Tâches** | Tout ce qui est à faire : en retard, à venir, sans date, terminées, avec recherche |
| **Projets** | Regroupement des tâches par projet coloré et suivi de l'avancement |
| **Fiche tâche** | Date, horaire, durée, priorité, projet, notes et **checklist d'étapes** |

## Démarrer

```bash
cd mobile
npm install
npm start
```

Puis, au choix :

- **Sur votre téléphone** : installez [Expo Go](https://expo.dev/go) (App Store
  ou Play Store) et scannez le QR code affiché dans le terminal.
- **Sur un simulateur** : `npm run ios` (macOS) ou `npm run android`.
- **Dans un navigateur** : `npm run web`.

## Vérifications

```bash
npm run typecheck   # TypeScript
npx expo export --platform ios   # vérifie que l'application se bundle
```

## Structure

```
src/
  app/            routes (Expo Router, navigation par fichiers)
    (tabs)/       les quatre onglets
    tache/        fiche d'une tâche et création
    projet/       fiche d'un projet et création
    jour/[date]   déroulé d'une journée précise
  components/     composants d'interface (ui/ = génériques)
  store/          état de l'application, persistance et sélecteurs
  lib/            dates en français, identifiants, retour haptique
  constants/      couleurs, espacements, rayons
```

## Choix techniques

- **Expo Router** : la navigation suit l'arborescence de `src/app`.
- **État local** : un `useReducer` exposé par `PlannerProvider`, sauvegardé dans
  `AsyncStorage` avec une écriture différée de 300 ms.
- **Dates** : formatage français écrit à la main (`src/lib/date.ts`), sans
  dépendance ni `Intl`, pour un rendu identique quelle que soit la langue du
  téléphone.
- **Aucune bibliothèque d'interface externe** : les composants sont dans
  `src/components/ui`, et les couleurs, espacements et rayons dans
  `src/constants/theme.ts` — un seul fichier à modifier pour changer le style.
