# Tutoriel de A à Z — du dépôt GitHub à la vente du site

Guide complet du cycle de vie d'un site comme **BD Automobile** : créer le dépôt,
développer, mettre en ligne, sécuriser, puis **vendre / livrer le site à un client**
(contrat, facturation, transfert des accès, maintenance).

Les commandes et exemples sont ceux de ce dépôt : Next.js (App Router) + TypeScript,
Tailwind CSS, Prisma + PostgreSQL, Cloudinary, déploiement Vercel.

> Convention : `$` = commande à taper dans un terminal. Remplacez toujours
> `bellefroidbrice-cell/bdtest1` par votre propre compte / dépôt.

---

## Sommaire

1. [Prérequis et comptes à créer](#1-prérequis-et-comptes-à-créer)
2. [Créer le dépôt GitHub](#2-créer-le-dépôt-github)
3. [Initialiser le projet en local](#3-initialiser-le-projet-en-local)
4. [Variables d'environnement](#4-variables-denvironnement)
5. [Base de données PostgreSQL + Prisma](#5-base-de-données-postgresql--prisma)
6. [Cloudinary : photos et vidéos des véhicules](#6-cloudinary--photos-et-vidéos-des-véhicules)
7. [Développer : structure du code et bonnes pratiques](#7-développer--structure-du-code-et-bonnes-pratiques)
8. [Espace d'administration et authentification](#8-espace-dadministration-et-authentification)
9. [Workflow Git : branches, commits, pull requests](#9-workflow-git--branches-commits-pull-requests)
10. [Qualité : lint, build, revue de code, CI](#10-qualité--lint-build-revue-de-code-ci)
11. [Déploiement sur Vercel](#11-déploiement-sur-vercel)
12. [Nom de domaine, e-mails et HTTPS](#12-nom-de-domaine-e-mails-et-https)
13. [SEO, performance et analytics](#13-seo-performance-et-analytics)
14. [Obligations légales (Belgique / RGPD)](#14-obligations-légales-belgique--rgpd)
15. [Sauvegardes et plan de reprise](#15-sauvegardes-et-plan-de-reprise)
16. [Préparer la vente : chiffrage et devis](#16-préparer-la-vente--chiffrage-et-devis)
17. [Contrat, cession des droits et conditions](#17-contrat-cession-des-droits-et-conditions)
18. [Livraison, recette et formation du client](#18-livraison-recette-et-formation-du-client)
19. [Transfert des accès et facturation](#19-transfert-des-accès-et-facturation)
20. [Après la vente : maintenance et évolutions](#20-après-la-vente--maintenance-et-évolutions)
21. [Checklist finale](#21-checklist-finale)

---

## 1. Prérequis et comptes à créer

### Outils locaux

| Outil | Version conseillée | Vérification |
|---|---|---|
| Node.js | 20 LTS ou plus récent | `node -v` |
| npm | fourni avec Node | `npm -v` |
| Git | 2.40+ | `git --version` |
| Un éditeur | VS Code, Cursor… | — |

### Comptes en ligne

| Service | Usage | Coût de départ |
|---|---|---|
| [GitHub](https://github.com) | hébergement du code | gratuit |
| [Vercel](https://vercel.com) | hébergement du site | gratuit (Hobby) / ~20 €/mois (Pro, obligatoire pour un usage commercial) |
| [Neon](https://neon.tech) ou Vercel Postgres | base de données PostgreSQL | gratuit puis ~19 €/mois |
| [Cloudinary](https://cloudinary.com) | photos / vidéos optimisées | gratuit jusqu'à ~25 crédits/mois |
| Registrar (OVH, Gandi, Cloudflare…) | nom de domaine | 10–20 €/an |

> **Conseil vente** : ouvrez ces comptes **à votre nom** pendant le développement,
> puis transférez-les au client à la livraison (voir §19). Ne mélangez jamais les
> comptes de plusieurs clients dans un même projet.

---

## 2. Créer le dépôt GitHub

### 2.1 Via l'interface web

1. GitHub → bouton **New** (ou <https://github.com/new>).
2. **Repository name** : `bdtest1` (nom court, en minuscules, sans espace).
3. **Description** : « Site web du garage BD Automobile ».
4. **Private** tant que le site n'est pas payé et livré. Passez en Public seulement
   si le client l'accepte explicitement.
5. Ne cochez **ni** README, **ni** .gitignore, **ni** licence si vous poussez un
   projet déjà existant (cela éviterait un conflit au premier `push`).
6. **Create repository**.

### 2.2 Via la ligne de commande (GitHub CLI)

```bash
$ gh auth login
$ gh repo create bellefroidbrice-cell/bdtest1 --private --source=. --remote=origin
```

### 2.3 Relier un projet local existant

```bash
$ git init
$ git branch -M main
$ git remote add origin https://github.com/bellefroidbrice-cell/bdtest1.git
$ git add .
$ git commit -m "Initialiser le projet"
$ git push -u origin main
```

### 2.4 Réglages du dépôt à faire tout de suite

- **Settings → Branches** : protéger `main` (interdire le push direct, exiger une
  pull request et une revue).
- **Settings → Secrets and variables** : jamais de secret dans le code, tout ici.
- Vérifier que `.gitignore` contient au minimum :

```gitignore
node_modules
.next
.env
.env*.local
```

> ⚠️ **Le `.env` ne doit jamais être commité.** S'il l'a été par erreur, considérez
> toutes les clés comme compromises : régénérez-les *et* réécrivez l'historique
> (`git filter-repo`) ou recréez le dépôt.

---

## 3. Initialiser le projet en local

Sur un dépôt existant :

```bash
$ git clone https://github.com/bellefroidbrice-cell/bdtest1.git
$ cd bdtest1
$ npm install
$ cp .env.example .env
$ npm run dev
```

Le site tourne sur <http://localhost:3000>.

Scripts disponibles (`package.json`) :

| Script | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run vercel-build` | `prisma generate` + `prisma migrate deploy` + `next build` (utilisé par Vercel) |
| `npm start` | démarrer le build de production |
| `npm run lint` | ESLint |

> Ce projet utilise une version de Next.js dont les conventions diffèrent des
> versions précédentes (voir `AGENTS.md`). Avant d'écrire du code, lisez les guides
> livrés dans `node_modules/next/dist/docs/` plutôt que de vous fier à un tutoriel
> trouvé en ligne.

---

## 4. Variables d'environnement

Le fichier `.env.example` liste tout ce qui est nécessaire :

```bash
DATABASE_URL="postgresql://user:password@host:5432/bdautomobile?schema=public"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

ADMIN_PASSWORD_HASH=""
AUTH_SECRET=""
```

Règles à retenir :

- Tout ce qui commence par `NEXT_PUBLIC_` est **visible dans le navigateur**.
  N'y mettez jamais un secret (l'`API_SECRET` Cloudinary reste côté serveur).
- `AUTH_SECRET` : générer une valeur aléatoire.

```bash
$ openssl rand -base64 32
```

- `ADMIN_PASSWORD_HASH` : hash bcrypt du mot de passe administrateur, jamais le
  mot de passe en clair.

```bash
$ node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" 'MotDePasseSolide'
```

- **Piège** : dans un fichier `.env` local, échappez chaque `$` du hash en `\$`
  (`\$2b\$12\$...`), sinon `$2b` est interprété comme une variable. Sur Vercel,
  collez la valeur telle quelle, sans échappement.
- Trois environnements = trois jeux de valeurs : local, préproduction (Preview),
  production. Ne réutilisez jamais la base de production en local.

---

## 5. Base de données PostgreSQL + Prisma

### 5.1 Créer la base

Sur Neon : **New project** → région proche des visiteurs (Europe/Frankfurt pour la
Belgique) → copier la *connection string* dans `DATABASE_URL`.

### 5.2 Le schéma

Le schéma vit dans `prisma/schema.prisma`. Exemple (extrait du modèle `Vehicle`) :

```prisma
model Vehicle {
  id      String  @id @default(cuid())
  slug    String  @unique
  brand   String
  model   String
  year         Int
  mileageKm    Int
  fuel         FuelType
  transmission TransmissionType
  price        Int
  status       VehicleStatus
}
```

La configuration Prisma (chemin du schéma, dossier des migrations, URL) est dans
`prisma.config.ts`.

### 5.3 Cycle de travail

```bash
# 1. Modifier prisma/schema.prisma
# 2. Créer une migration nommée
$ npx prisma migrate dev --name ajouter-champ-garantie

# 3. Régénérer le client Prisma (généré dans src/generated/prisma)
$ npx prisma generate

# 4. Inspecter les données
$ npx prisma studio
```

En production, **jamais** de `migrate dev` : c'est `prisma migrate deploy` qui
s'exécute, déjà câblé dans le script `vercel-build`.

### 5.4 Règles d'or

- Une migration = un commit, avec un nom explicite.
- Les migrations sont **versionnées dans Git** (`prisma/migrations/`).
- Une migration destructrice (suppression de colonne) se fait en deux temps :
  d'abord arrêter d'écrire dans la colonne, déployer, puis supprimer.
- Sauvegardez la base avant toute migration en production (§15).

---

## 6. Cloudinary : photos et vidéos des véhicules

1. Créer un compte Cloudinary → **Dashboard** : `cloud name`, `API key`, `API secret`.
2. Renseigner les quatre variables `CLOUDINARY_*` du `.env`.
3. Autoriser le domaine des images dans `next.config.ts` (déjà fait ici) :

```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
}
```

Bonnes pratiques photo pour un site de vente de voitures :

- 8 à 15 photos par véhicule, format paysage 3:2, même cadrage pour tous.
- Une photo « héro » 3/4 avant, puis extérieur, intérieur, compteur, défauts éventuels.
- Laissez Cloudinary gérer la compression et le WebP/AVIF : envoyez l'original.
- Nommez les dossiers par véhicule (`vehicles/<slug>/`) pour pouvoir tout supprimer
  proprement quand la voiture est vendue.

---

## 7. Développer : structure du code et bonnes pratiques

```
src/
  app/
    (site)/        pages publiques : accueil, véhicules, services, à propos, contact
    admin/         espace d'administration protégé
  components/
    ui/            composants génériques (button, card, badge, accordion…)
    layout/        header, footer, container
    sections/      sections de page (hero, services, faq, reviews…)
    vehicles/      galerie, cartes et explorateur de véhicules
    forms/         formulaires
  lib/             prisma, auth, format, utilitaires, données statiques
  types/           types partagés
  proxy.ts         protection des routes /admin
prisma/            schéma + migrations
public/            fichiers statiques servis tels quels
```

Conventions du projet :

- **TypeScript strict** : pas de `any` de confort.
- Un composant = un fichier, nommé en `kebab-case.tsx`.
- Les composants sont **serveur par défaut** ; `"use client"` uniquement quand il
  faut de l'état, un événement ou une animation.
- Les écritures en base passent par des **Server Actions** (`actions.ts`), jamais
  par un appel direct depuis le navigateur.
- Validation systématique des entrées avec **Zod**, côté serveur *aussi* (le
  contrôle côté navigateur n'est qu'un confort d'affichage).
- Les textes visibles sont en français, y compris les messages d'erreur.

---

## 8. Espace d'administration et authentification

Le dossier `src/app/admin/` contient la connexion (`login/`) et le tableau de bord
(`(dashboard)/` : véhicules, demandes de contact).

Le fichier `src/proxy.ts` intercepte toutes les requêtes `/admin/*`, vérifie le
cookie de session signé (`jose`, JWT HS256, 7 jours) et redirige vers
`/admin/login` si la session est absente ou invalide.

```ts
export const config = {
  matcher: ["/admin/:path*"],
};
```

Checklist sécurité avant livraison :

- [ ] `AUTH_SECRET` différent en local et en production, jamais commité.
- [ ] Mot de passe admin d'au moins 16 caractères, transmis au client via un
      gestionnaire de mots de passe (Bitwarden, 1Password), pas par e-mail.
- [ ] Toutes les Server Actions d'administration revérifient la session.
- [ ] Rien de sensible dans les logs (pas de mot de passe, pas de token).
- [ ] Page `/admin` non indexable (`robots`), et pas de lien public vers elle.

---

## 9. Workflow Git : branches, commits, pull requests

```bash
# Partir d'un main à jour
$ git checkout main
$ git pull origin main

# Une branche par sujet
$ git checkout -b feat/fiche-vehicule-galerie

# Travailler, puis committer par petites étapes cohérentes
$ git add src/components/vehicles/vehicle-gallery.tsx
$ git commit -m "Ajouter la galerie photo de la fiche véhicule"

$ git push -u origin feat/fiche-vehicule-galerie
```

Puis ouvrir une pull request :

```bash
$ gh pr create --fill
```

Conventions de commit utilisées dans ce dépôt : message à l'impératif, en
français, une idée par commit.

```
Ajouter la gestion des photos véhicules via Cloudinary
Corriger le 404 sur /admin en production
Brancher les pages publiques sur la vraie base de données
```

Règles :

- `main` doit toujours être déployable.
- Une PR = une fonctionnalité, relisez votre propre diff avant de demander une revue.
- Ne poussez jamais en force sur une branche partagée.
- Supprimez la branche après fusion (`gh pr merge --squash --delete-branch`).

---

## 10. Qualité : lint, build, revue de code, CI

Avant chaque push :

```bash
$ npm run lint
$ npm run build
```

Un build qui échoue en local échouera sur Vercel : ne poussez pas « pour voir ».

Automatisez avec GitHub Actions — `.github/workflows/ci.yml` :

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx prisma generate
      - run: npm run lint
      - run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_CI }}
```

Points de contrôle avant de considérer une page « terminée » :

- [ ] Affichage correct sur mobile (360 px), tablette et desktop.
- [ ] Textes réels, pas de lorem ipsum, pas de fausse coordonnée.
- [ ] Images avec `alt` descriptif.
- [ ] Formulaires : états vide / en cours / erreur / succès testés.
- [ ] Aucun avertissement rouge dans la console du navigateur.

---

## 11. Déploiement sur Vercel

### 11.1 Premier déploiement

1. <https://vercel.com/new> → **Import Git Repository** → choisir `bdtest1`.
2. Framework détecté : Next.js. Laissez les réglages par défaut : le script
   `vercel-build` du `package.json` prend la main et exécute
   `prisma generate && prisma migrate deploy && next build`.
3. **Environment Variables** : recopier toutes les variables du `.env`
   (sans échapper les `$`), pour les environnements *Production* **et** *Preview*.
4. **Deploy**.

### 11.2 Le cycle ensuite

| Action Git | Résultat Vercel |
|---|---|
| push sur une branche | déploiement **Preview** avec une URL unique |
| pull request | commentaire automatique avec le lien de preview |
| fusion dans `main` | déploiement **Production** |

Les URLs de preview sont l'outil idéal pour faire valider le travail au client
avant la mise en ligne réelle.

### 11.3 En cas de problème

- **Build en échec** : onglet *Deployments* → *Building* → lire le log complet ;
  90 % des cas = variable d'environnement manquante ou erreur TypeScript.
- **Erreur base de données au build** : `DATABASE_URL` absente ou migration en
  attente ; vérifier que `prisma migrate deploy` passe.
- **Retour arrière immédiat** : *Deployments* → un déploiement sain → *Promote to
  Production*. Aucun `git revert` n'est nécessaire dans l'urgence.

---

## 12. Nom de domaine, e-mails et HTTPS

1. Acheter le domaine (ex. `bdautomobile.be`) chez OVH, Gandi ou Cloudflare.
   Un `.be` coûte ~12 €/an. Prenez-le au nom du client si possible (voir §19).
2. Vercel → projet → **Settings → Domains** → *Add* → saisir le domaine.
3. Créer chez le registrar les enregistrements DNS indiqués par Vercel :

```
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

4. Attendre la propagation (quelques minutes à 24 h). Le certificat HTTPS
   Let's Encrypt est émis et renouvelé automatiquement par Vercel.
5. Choisir une version canonique (`www` ou non) et rediriger l'autre.
6. **E-mails** : Vercel n'héberge pas d'e-mails. Ajoutez chez le registrar les
   MX de la solution retenue (Google Workspace, Microsoft 365, ou la messagerie
   du registrar) pour `contact@bdautomobile.be`.

Vérification :

```bash
$ dig bdautomobile.be +short
$ curl -I https://bdautomobile.be
```

---

## 13. SEO, performance et analytics

### Base technique

- Un `<title>` et une `<meta description>` uniques par page (métadonnées Next.js).
- URLs lisibles et stables : `/vehicules/bmw-serie-1-118i-2021`.
- `sitemap.xml` et `robots.txt` générés, `/admin` exclu de l'indexation.
- Données structurées **JSON-LD** : `AutoDealer` pour le garage, `Vehicle` +
  `Offer` pour chaque annonce → éligibilité aux résultats enrichis Google.
- Balises Open Graph pour un partage propre sur Facebook et WhatsApp.

### SEO local (décisif pour un garage)

- Fiche **Google Business Profile** complétée : horaires, photos, adresse exacte
  à Eghezée, catégorie « Concessionnaire automobile ».
- Nom, adresse et téléphone **identiques** partout (site, Google, annuaires).
- Page « À propos » et page « Contact » avec l'adresse en texte, pas en image.
- Récolter des avis Google : ils alimentent la section avis du site.

### Performance

Objectifs Lighthouse : Performance ≥ 90, Accessibilité ≥ 95, SEO = 100.

- Images servies par Cloudinary + composant image de Next.js, jamais de JPEG 5 Mo.
- Animations Framer Motion réservées aux éléments visibles au premier écran.
- Polices auto-hébergées via le chargeur de polices de Next.js.

### Mesure

- **Vercel Analytics** (sans cookie, RGPD-friendly) ou **Plausible**.
- Google Search Console : soumettre le sitemap, surveiller les erreurs d'indexation.
- Suivre l'objectif business réel : nombre de demandes de contact par véhicule.

---

## 14. Obligations légales (Belgique / RGPD)

Un site commercial belge doit afficher :

- **Mentions légales** : dénomination sociale, adresse du siège, **numéro
  d'entreprise (BCE/TVA)**, e-mail et téléphone de contact.
- **Politique de confidentialité** : quelles données (nom, e-mail, téléphone,
  message), pourquoi (répondre à une demande), combien de temps, qui y accède,
  et comment exercer ses droits (accès, rectification, effacement).
- **Bandeau cookies** uniquement si vous déposez des cookies non essentiels
  (publicité, Google Analytics). Avec Vercel Analytics ou Plausible, il n'est pas
  nécessaire — c'est un argument de vente, dites-le au client.
- **Formulaire de contact** : mention de la finalité + case de consentement non
  précochée si vous réutilisez l'adresse à d'autres fins (newsletter).
- **Vente de véhicules d'occasion à un particulier** : garantie légale de 12 mois
  minimum en Belgique ; le site doit refléter fidèlement l'état du véhicule
  (kilométrage, contrôle technique, historique d'entretien).

> Ces éléments sont une base de travail, pas un avis juridique. Faites relire les
> conditions par un juriste si le client vend en ligne.

---

## 15. Sauvegardes et plan de reprise

| Élément | Sauvegarde | Fréquence |
|---|---|---|
| Code | GitHub (+ clone local) | à chaque push |
| Base de données | export `pg_dump` ou snapshots Neon | quotidien |
| Photos | Cloudinary (+ copie des originaux) | à chaque ajout |
| Variables d'environnement | gestionnaire de mots de passe | à chaque changement |

```bash
# Export manuel de la base
$ pg_dump "$DATABASE_URL" -Fc -f backup-$(date +%F).dump

# Restauration
$ pg_restore -d "$DATABASE_URL" --clean backup-2026-09-12.dump
```

Testez une restauration **avant** la livraison : une sauvegarde jamais restaurée
n'est pas une sauvegarde.

---

## 16. Préparer la vente : chiffrage et devis

### Ce que vous vendez réellement

Pas « un site » : un outil qui apporte des demandes de contact qualifiées et
remplace les annonces payantes sur les portails automobiles. C'est l'angle du devis.

### Trois modèles de tarification

| Modèle | Principe | Pour qui |
|---|---|---|
| **Forfait** | prix fixe pour un périmètre défini | client qui veut un budget certain — le plus courant |
| **Régie** | taux journalier × jours | périmètre flou, évolutions continues |
| **Forfait + abonnement** | création + mensualité (hébergement, maintenance, évolutions) | le plus rentable sur la durée |

### Grille indicative (indépendant, marché belge)

| Prestation | Fourchette |
|---|---|
| Site vitrine 5 pages | 1 500 – 3 000 € |
| Site vitrine + catalogue véhicules + admin (ce projet) | 3 500 – 8 000 € |
| Identité visuelle / logo | 500 – 1 500 € |
| Rédaction et photos | 500 – 2 000 € |
| Maintenance + hébergement | 50 – 200 €/mois |

Ajoutez les coûts récurrents refacturés : domaine (~15 €/an), Vercel Pro
(~20 €/mois), base Neon (0–19 €/mois), Cloudinary (0–80 €/mois).

### Structure du devis

1. Contexte et objectif en une phrase (« vendre plus de véhicules sans dépendre
   des portails d'annonces »).
2. Périmètre détaillé, page par page et fonctionnalité par fonctionnalité.
3. **Ce qui n'est pas inclus** (aussi important que le reste) : rédaction des
   textes, photos professionnelles, campagnes publicitaires, refonte du logo.
4. Livrables : code sur GitHub, site en ligne, accès admin, formation 1 h,
   documentation.
5. Planning avec jalons.
6. Prix HTVA, TVA 21 %, total TVAC.
7. Échéancier : **30 % à la commande, 40 % à la validation de la maquette,
   30 % à la mise en ligne**.
8. Durée de validité du devis (30 jours) et conditions de paiement (30 jours).

---

## 17. Contrat, cession des droits et conditions

Un devis signé « bon pour accord » vaut contrat, mais un contrat séparé évite les
litiges. À y faire figurer :

- **Périmètre et livrables**, avec renvoi au devis.
- **Nombre d'allers-retours inclus** (ex. 2 séries de corrections par page) ;
  au-delà, tarif horaire.
- **Délais et obligations du client** : fournir textes, photos, logo, accès. Le
  planning ne court pas tant que ces éléments manquent.
- **Propriété intellectuelle** : la cession des droits sur le code et les visuels
  produits intervient **au paiement intégral**, pas avant. Précisez ce qui reste
  vôtre (composants génériques, bibliothèque interne) et ce que vous cédez.
- **Licences tierces** : polices, photos d'illustration, bibliothèques open source
  — listez-les, le client hérite de leurs conditions.
- **Recette** : le client dispose de X jours pour signaler les anomalies ; passé
  ce délai, la livraison est réputée acceptée.
- **Garantie** : correction gratuite des bugs pendant 1 à 3 mois après la mise en
  ligne ; les évolutions ne sont pas des bugs.
- **Résiliation, pénalités de retard, droit applicable** (droit belge, tribunal
  compétent).
- **Référence** : droit de citer le projet dans votre portfolio — demandez-le
  explicitement.

---

## 18. Livraison, recette et formation du client

### Recette technique (à faire avant de montrer le site)

- [ ] Toutes les pages répondent, aucun lien mort (`npx linkinator https://…`).
- [ ] Formulaire de contact testé de bout en bout : la demande arrive bien en base
      et est visible dans l'admin.
- [ ] Fiches véhicules : photos, prix, kilométrage, statut (disponible / réservé /
      vendu) corrects.
- [ ] Mobile, tablette, desktop ; Chrome, Safari, Firefox.
- [ ] Lighthouse ≥ 90 en performance.
- [ ] Mentions légales et politique de confidentialité en ligne.
- [ ] Page 404 soignée.
- [ ] HTTPS actif, redirection `www` en place.
- [ ] Sauvegarde de la base réalisée et restaurée avec succès.

### Recette client

Envoyez l'URL de preview avec une **liste de points à vérifier**, pas un simple
« dis-moi ce que tu en penses » : vous obtiendrez des retours exploitables et
limiterez les demandes hors périmètre. Consignez chaque retour dans une issue
GitHub, avec une réponse : *corrigé*, *hors périmètre (devis complémentaire)*,
ou *à discuter*.

### Formation (1 heure, en visio, enregistrée)

1. Se connecter à `/admin/login`.
2. Ajouter un véhicule : champs obligatoires, rédaction de la description,
   points forts, « à savoir ».
3. Envoyer les photos, choisir la photo principale, réordonner.
4. Passer un véhicule en *réservé* puis *vendu*.
5. Consulter et traiter les demandes de contact.
6. Que faire en cas de problème : qui contacter, sous quel délai.

Laissez un **mémo d'une page** (`docs/guide-admin.md`) : le client ne reverra pas
l'enregistrement, il relira la page.

---

## 19. Transfert des accès et facturation

### Transférer les comptes (après paiement intégral)

| Élément | Comment |
|---|---|
| **Dépôt GitHub** | *Settings → General → Transfer ownership* vers le compte du client, ou l'ajouter en admin |
| **Projet Vercel** | créer une Team au nom du client et transférer le projet ; les variables d'environnement suivent, revérifiez-les |
| **Nom de domaine** | code de transfert (auth code) chez le registrar, ou ajouter le client comme propriétaire |
| **Base de données** | transférer le projet Neon ou créer un compte au nom du client et restaurer un dump |
| **Cloudinary** | compte au nom du client, ou sous-compte dédié |
| **Mots de passe** | via un coffre partagé, jamais par e-mail ou WhatsApp |

Après transfert : **retirez vos accès personnels** de ce que vous ne maintenez plus,
et gardez trace écrite de la date du transfert.

### Facturer (Belgique)

Mentions obligatoires d'une facture :

- Numéro séquentiel et date d'émission.
- Vos coordonnées + **numéro de TVA** ; idem pour le client.
- Description claire des prestations et période d'exécution.
- Montant HTVA, taux (21 %), montant de TVA, total TVAC.
- Date d'échéance et coordonnées bancaires (IBAN/BIC), communication structurée.
- Mention d'**autoliquidation** si le client est assujetti dans un autre État membre.

Conservez les factures 7 ans. Facturez les jalons dès qu'ils sont atteints :
une facture émise tard est payée tard.

---

## 20. Après la vente : maintenance et évolutions

### Proposer un contrat de maintenance (c'est là qu'est la marge)

| Formule | Contenu | Prix indicatif |
|---|---|---|
| **Essentiel** | hébergement, sauvegardes, mises à jour de sécurité, 1 h de support/mois | 50–80 €/mois |
| **Confort** | + petites évolutions (2 h/mois), suivi SEO, rapport trimestriel | 120–200 €/mois |
| **Sur mesure** | développements récurrents, SLA de réponse | sur devis |

### Routine de maintenance

```bash
# Vérifier les vulnérabilités
$ npm audit

# Mettre à jour prudemment, puis tester
$ npm outdated
$ npm update
$ npm run lint && npm run build
```

- Mettez à jour sur une branche, validez sur l'URL de preview, jamais directement
  sur `main`.
- Surveillez les logs Vercel et les erreurs 500.
- Point trimestriel avec le client : trafic, demandes reçues, véhicules vendus,
  pistes d'amélioration. C'est aussi l'occasion de vendre la suite.

### Évolutions typiques à revendre plus tard

Estimation de reprise en ligne, comparateur de véhicules, financement simulé,
export des annonces vers les portails, multilingue FR/NL, blog conseils,
newsletter, espace client.

---

## 21. Checklist finale

**Technique**

- [ ] Dépôt privé, `main` protégé, `.env` jamais commité
- [ ] CI verte (lint + build)
- [ ] Migrations appliquées en production
- [ ] Variables d'environnement complètes en Production et Preview
- [ ] Domaine branché, HTTPS actif, redirections en place
- [ ] Sauvegardes automatiques configurées **et testées**
- [ ] Lighthouse ≥ 90, sitemap soumis à la Search Console

**Contenu**

- [ ] Vrais textes, vraies photos, vraies coordonnées
- [ ] Fiches véhicules complètes et exactes
- [ ] Mentions légales + politique de confidentialité

**Commercial**

- [ ] Devis signé et contrat en place
- [ ] Recette validée par écrit
- [ ] Formation réalisée, mémo remis
- [ ] Accès transférés (GitHub, Vercel, domaine, base, Cloudinary)
- [ ] Facture finale émise
- [ ] Contrat de maintenance proposé
- [ ] Autorisation d'utiliser le projet en référence

---

*Document maintenu dans `docs/`. Mettez-le à jour à chaque changement de stack ou
de procédure de déploiement.*
