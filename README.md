# BD Automobile

Site web du garage automobile BD Automobile (Eghezée, Belgique) : vente de véhicules d'occasion et récents, présentation du garage, prise de contact.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS
- Framer Motion pour les animations
- Prisma + PostgreSQL
- React Hook Form + Zod pour les formulaires
- Cloudinary pour les photos/vidéos des véhicules

## Démarrer en local

```bash
npm install
cp .env.example .env   # puis renseigner DATABASE_URL et les clés Cloudinary
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  app/            routes (App Router)
  components/
    ui/           composants génériques réutilisables
    layout/       header, footer, navigation
    sections/     sections de page (hero, services, ...)
  lib/            utilitaires
  features/       logique métier par domaine (véhicules, contact, ...)
  types/          types partagés
prisma/           schéma et migrations de base de données
```

## Application mobile

Le dossier `mobile/` contient **Cadence**, une application mobile Expo
(iOS + Android) d'organisation : plannings, calendrier, tâches et déroulé de
journée. C'est un projet indépendant du site, avec ses propres dépendances —
voir [`mobile/README.md`](mobile/README.md).

