# Services entre particuliers

Application web (React + TypeScript) de mise en relation pour des **services entre particuliers** : jardinage, courses, couture, bricolage, ménage, cours particuliers, garde d'animaux ou d'enfants...

Un utilisateur peut parcourir les annonces, les rechercher et les filtrer, consulter une fiche, sauvegarder ses favorites, **publier**, **modifier** et **supprimer** une annonce, et **réserver** un service avec un paiement fictif.

## Sommaire

1. [Sujet et API utilisée](#1-sujet-et-api-utilisée)
2. [Prérequis, installation et lancement](#2-prérequis-installation-et-lancement)
3. [Configuration](#3-configuration)
4. [Fonctionnalités](#4-fonctionnalités)
5. [Choix techniques et justifications](#5-choix-techniques-et-justifications)
6. [Architecture et flux de données](#6-architecture-et-flux-de-données)
7. [Rôle de chaque fichier](#7-rôle-de-chaque-fichier)
8. [Limites et problèmes connus](#8-limites-et-problèmes-connus)

---

## 1. Sujet et API utilisée

### Le sujet

Un site de ventes de **services entre particuliers**. Chaque annonce est proposée par une personne (le prestataire) : son titre, son type de service, son tarif horaire, sa localisation, ses coordonnées et sa note.

### L'API : DummyJSON

Le projet utilise [DummyJSON](https://dummyjson.com/), une API de données fictives imposée par le cahier des charges. **DummyJSON ne contient aucune notion de « service »** : il faut donc réinterpréter ses ressources.

| Ressource DummyJSON | Rôle dans l'application |
|---|---|
| `GET /users` | Chaque utilisateur est un **prestataire** : prénom, nom, âge, e-mail, téléphone, ville, région, pays, profession (`company.title`). C'est la ressource obligatoire. |
| `GET /recipes` | Chaque recette devient une **annonce de cuisine à domicile** proposée par son auteur (`userId`) : nom du plat, photo, cuisine, difficulté, temps, portions, note et nombre d'avis. |
| `GET /posts` | Les réactions (j'aime / je n'aime pas) aux publications d'un prestataire servent à calculer sa **note** sur 5. |
| `POST /users/add` | Création d'une annonce. |
| `PUT /users/:id` | Modification d'une annonce. |
| `DELETE /users/:id` | Suppression d'une annonce. |
| `POST /carts/add` | Enregistrement d'une **réservation** (paiement fictif). |

> DummyJSON **simule** les créations, modifications et suppressions : l'API répond comme si elles avaient réussi, mais ne les enregistre pas. L'interface est donc mise à jour à partir des réponses de l'API, et ces changements disparaissent au rechargement de la page (comportement prévu par le cahier des charges).

### Ce qui n'est pas dans l'API

Le **type de service**, le **tarif horaire**, le **titre** et la **description** des annonces non culinaires n'existent pas dans DummyJSON. Ce contenu éditorial est défini dans un seul fichier : [`src/config/serviceCatalog.ts`](src/config/serviceCatalog.ts).

---

## 2. Prérequis, installation et lancement

### Prérequis

- **Node.js** dans une version récente supportée par Vite (une version LTS ≥ 20.19 convient).
- **npm** (installé avec Node.js).

### Installation

```bash
# 1. Aller dans le dossier du projet
cd service-react

# 2. Installer les dépendances
npm install
```

### Lancement en développement

```bash
npm run dev
```

L'application est disponible sur <http://localhost:5173/>.

### Autres commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement avec rechargement à chaud. |
| `npm run build` | Vérifie le typage TypeScript (`tsc -b`) puis génère la version de production dans `dist/`. |
| `npm run preview` | Sert la version de production générée par `build`. |
| `npm run lint` | Lance Oxlint avec `--deny-warnings` : un avertissement fait échouer la commande. |
| `npm run format` | Reformate tout le code avec Prettier. |
| `npm run format:check` | Vérifie le formatage sans modifier les fichiers. |

### Vérification avant rendu

Le cahier des charges exige que le lint et le formatage passent sans erreur :

```bash
npm run lint
npm run format:check
npm run build
```

### Déploiement

L'application est une **SPA** : les URL comme `/services/12` n'existent que côté navigateur. Un hébergeur doit renvoyer `index.html` pour toute URL inconnue (règle de réécriture). `npm run dev` et `npm run preview` le font déjà.

---

## 3. Configuration

**Aucune variable d'environnement n'est nécessaire.** DummyJSON est public et ne demande pas de clé.

L'URL de l'API est une constante dans [`src/api/client.ts`](src/api/client.ts) (`API_URL`). Pour pointer vers un autre serveur, c'est le seul endroit à modifier.

Deux clés sont utilisées dans le `localStorage` du navigateur :

| Clé | Contenu |
|---|---|
| `saved-services` | Les annonces sauvegardées (objets complets). |
| `theme` | Le thème choisi : `light` ou `dark`. |

---

## 4. Fonctionnalités

### Cahier des charges

| Exigence | Réalisation |
|---|---|
| Page d'accueil avec en-tête et navigation | `Layout` + `Header` : Accueil, Sauvegardés, Publier une annonce, bascule de thème. |
| Liste de cartes (image + 3 infos textuelles minimum) | Image, type, titre, prestataire et ville, tarif, note. |
| Page de détail (≥ 5 infos, dont ≥ 2 absentes de la carte) | Description, âge, profession, e-mail, téléphone et, pour la cuisine, difficulté, temps, portions. |
| Page des éléments sauvegardés | `/saved`, avec accès à chaque fiche et retrait. |
| URL distinctes, accès direct et rechargement | `/services/:id` et `/saved` ; la liste est chargée au démarrage de l'application, quelle que soit l'URL d'entrée. |
| Pagination | 20 cartes par page, boutons précédent/suivant, « Page X sur Y ». |
| Recherche avec champ stylisé et ≥ 2 filtres | Texte + type de service + tarif maximum. |
| Critères cumulables, sur tous les résultats | Filtrage côté client sur l'ensemble des annonces (voir §5.4). |
| Retour à la page 1 à chaque changement de critère | `updateCriteria` remet la page à 1. |
| Critères conservés dans un contexte React | `SearchContext`, placé au-dessus du routeur. |
| Sauvegardes sans doublon, en `localStorage` | `SavedProvider`, déduplication par id, restauration au chargement. |
| Formulaire de création contrôlé et validé | `ServiceForm` + `validateServiceForm`. |
| `POST` JSON avec `Content-Type: application/json` | `sendJson` dans `api/client.ts`. |
| Indicateur d'envoi, bouton désactivé, retry sans perte | `ServiceForm` : état `submitting` / `error`, valeurs conservées. |
| Confirmation à partir de la réponse de l'API | `createService` construit l'annonce depuis la réponse. |
| Responsive, chargement, erreur avec retry, états vides | `AsyncContent`, `Message`, grille adaptative. |
| Accessibilité (labels, alt, clavier, focus) | Voir §5.17. |
| Linter + formateur, commentaires par fonction | Oxlint + Prettier ; chaque fonction est commentée. |
| TypeScript, CSS classique | Oui. |

### Bonus réalisés

| Bonus | État |
|---|---|
| CRUD complet (modification `PUT`, suppression `DELETE` avec confirmation) | Réalisé. |
| Mode sombre partagé par un contexte, sauvegardé en `localStorage` | Réalisé. |

### Fonctionnalité supplémentaire

**Réservation avec paiement fictif** : durée, date, carte bancaire validée (algorithme de Luhn, expiration, code), total calculé, commande enregistrée via l'API.

---

## 5. Choix techniques et justifications

Chaque choix est présenté avec **l'alternative écartée** et la raison.

### 5.1 Vite + React + TypeScript

- **Choix** : projet créé avec Vite (template `react-ts`).
- **Pourquoi pas Next.js** : le rendu serveur et le routage par fichiers n'apportent rien ici, puisque toutes les données viennent d'une API publique appelée depuis le navigateur.
- **TypeScript en mode strict** : imposé par le cahier des charges. Il attrape les erreurs de données (une annonce créée n'a pas toutes les propriétés d'une annonce de l'API) à la compilation.

### 5.2 DummyJSON `/users` comme source principale (et non `/products`)

- **Choix** : un utilisateur = un prestataire.
- **Pourquoi pas `/products`** : les produits donnent une application de supermarché (parfums, ordinateurs, aliments), ce qui contredit le sujet « services entre particuliers ».
- **Bonus** : les champs d'un utilisateur (nom, prénom, e-mail, ville) correspondent à ceux demandés dans le formulaire de création du cahier des charges.

### 5.3 Recettes et publications pour enrichir les données

- **Recettes (`/recipes`)** : l'auteur d'une recette (`userId`) devient un prestataire de **cuisine à domicile**. On obtient de **vraies photos**, des notes et des avis issus de l'API, ce qui limite les données inventées.
- **Publications (`/posts`)** : la note d'un prestataire est la part de réactions « j'aime » à ses publications ; le nombre d'avis est le nombre total de réactions. C'est une **interprétation** : DummyJSON n'a pas de notation de prestataires. Sans publication, l'annonce affiche « Pas encore d'avis » plutôt qu'une note inventée.
- **Pourquoi pas des formules sur l'id** (version précédente) : une note calculée à partir d'un identifiant n'a aucune signification. Mieux vaut une valeur dérivée de données réelles, ou rien.
- **Robustesse** : recettes et publications sont **facultatives**. Si leur requête échoue (`optional` dans `api/services.ts`), l'application continue sans elles. Seuls les utilisateurs sont indispensables.

### 5.4 Recherche, filtres et pagination côté client

- **Choix** : charger toutes les annonces une fois (`limit=0`, champs réduits avec `select`, ~200 éléments) puis filtrer et paginer en local.
- **Pourquoi pas côté API** :
  - DummyJSON ne combine pas une recherche textuelle (`/users/search`) et plusieurs filtres dans une même requête ;
  - le type de service et le tarif **n'existent pas dans l'API** : elle ne pourrait pas les filtrer.
- **Avantages** : tous les critères s'appliquent ensemble ; la recherche porte sur toutes les annonces, pas seulement sur la page visible ; le changement de page est instantané.
- **Limite** : ne conviendrait pas à des milliers d'éléments. Ici, ~200 petits objets pèsent très peu.
- **Détails** : la recherche ignore les accents et la casse (« menage » trouve « Ménage ») et porte sur le titre, la description, le type, le nom et la ville. Le texte est appliqué à la validation du formulaire, les filtres immédiatement.

### 5.5 Génération déterministe du contenu éditorial

- **Choix** : le type, le titre, la description et le tarif d'une annonce sont calculés à partir de l'**id** du prestataire (`utils/buildServices.ts`).
- **Pourquoi pas aléatoire** (`Math.random`) : l'annonce changerait à chaque chargement, la fiche ne correspondrait pas à la carte, et deux visiteurs verraient des données différentes.
- **Pourquoi pas un stockage** : un calcul pur évite d'avoir à sauvegarder quoi que ce soit.
- **Répartition** : le multiplicateur 7 est premier avec 11 et 12, ce qui répartit uniformément les types.

### 5.6 Illustrations générées en SVG

- **Choix** : chaque annonce non culinaire affiche un émoji sur fond coloré, généré en SVG (`utils/serviceImage.ts`).
- **Pourquoi pas l'avatar `image` des utilisateurs** : DummyJSON renvoie des motifs géométriques générés, pas des photos ; ils rendaient les cartes incohérentes.
- **Pourquoi pas un service d'images externe** (photos aléatoires) : dépendance supplémentaire, images sans rapport avec le service, risque de panne.
- **Résultat** : aucun fichier à héberger, un thème visuel cohérent par type de service, et des photos réelles pour la cuisine.

### 5.7 `fetch` et un hook maison plutôt que TanStack Query

- **Choix** : `fetch` et le hook `useRequest` (~40 lignes) qui gère chargement, erreur, annulation et nouvel essai.
- **Pourquoi pas TanStack Query** : l'application charge **une seule liste** au démarrage et la garde en mémoire dans un contexte. Le cache avancé, la revalidation ou les requêtes parallèles de TanStack Query ne seraient pas exploités. Le cahier des charges demande de pouvoir justifier toute bibliothèque ajoutée.
- **Annulation** : `AbortController` évite qu'une réponse tardive écrase l'état d'une page déjà quittée. Elle est gérée une fois dans `useRequest` et `client.ts`.

### 5.8 Modifications superposées aux données de l'API

- **Choix** : `ServicesProvider` garde les données de l'API **inchangées** et ajoute à part les annonces créées (`created`), les modifications (`overrides`) et les suppressions (`deletedIds`). La liste affichée est calculée à partir des trois.
- **Pourquoi pas modifier le tableau en place** : plus difficile à raisonner, et un rechargement de la requête écraserait les changements de façon imprévisible.

### 5.9 Annonces créées : id local et opérations sans requête

- **Choix** : une annonce créée reçoit un id `Date.now()` et le marqueur `local: true`.
- **Pourquoi** : DummyJSON renvoie toujours le même id simulé : deux annonces auraient la même clé, et la sauvegarde confondrait les deux.
- **Modification et suppression** : une annonce locale n'existe pas sur le serveur, qui répondrait 404. Ces opérations s'effectuent donc **sans requête** pour elle. Pour les annonces de l'API, la vraie requête `PUT` ou `DELETE` est envoyée.
- **Choix assumé** : l'URL d'une annonce créée contient un grand nombre (`/services/1745…`).

### 5.10 Sauvegardes : objet complet dans le `localStorage`

- **Choix** : stocker l'annonce entière, pas seulement son id.
- **Pourquoi pas l'id seul** : une annonce créée n'existe pas côté serveur ; avec l'id seul, elle serait introuvable après rechargement. Stocker l'objet permet aussi d'afficher la page « Sauvegardés » sans attendre le réseau.
- **Sécurité des lectures** : `loadSaved` valide le contenu (`try/catch`, tableau, objets avec `id` numérique) pour qu'une donnée corrompue ne fasse pas planter l'application.
- **Cohérence** : une modification met aussi à jour la copie sauvegardée ; une suppression la retire.

### 5.11 `react-router`

- **Choix** : routes déclaratives avec un `Layout` commun (`<Outlet />`).
- **Pourquoi** : le cahier des charges exige des URL distinctes, un accès direct et un rechargement fonctionnels.
- **Pourquoi un `Layout`** : l'en-tête et le `<main>` unique sont écrits une fois, ce qui évite plusieurs `<main>` par page (mauvais pour l'accessibilité).
- **`NavLink`** : ajoute automatiquement la classe `active` au lien de la page courante.

### 5.12 Formulaires contrôlés avec validation maison

- **Choix** : états React, `noValidate` sur le formulaire, fonctions de validation pures (`validateServiceForm`, `validatePayment`) qui renvoient un message par champ.
- **Pourquoi pas la validation native** du navigateur : messages non personnalisables, en anglais ou dans la langue du navigateur, et présentation incohérente.
- **Pourquoi pas React Hook Form ou Zod** : seulement deux formulaires, des règles simples ; deux fichiers de quelques dizaines de lignes suffisent et se testent facilement.
- **Affichage des erreurs** : elles n'apparaissent qu'après la première soumission, puis se mettent à jour en direct. L'utilisateur n'est donc pas accueilli par un formulaire entièrement rouge.
- **Un seul formulaire pour créer et modifier** : `ServiceForm` reçoit des valeurs initiales et une fonction d'envoi.

### 5.13 Boîte de dialogue native `<dialog>`

- **Choix** : `ConfirmDialog` s'appuie sur l'élément HTML `<dialog>` et `showModal()`.
- **Pourquoi pas `window.confirm`** : non stylable, bloquant, incompatible avec le thème sombre et avec l'affichage d'un état « Suppression… » ou d'une erreur.
- **Pourquoi pas une modale maison** : il faudrait recoder le piège de focus, la fermeture avec Échap et le fond assombri. `<dialog>` les fournit nativement.

### 5.14 Thème sombre par variables CSS

- **Choix** : toutes les couleurs sont des variables CSS (`styles/theme.css`) ; le thème sombre redéfinit ces variables via `:root[data-theme='dark']`.
- **Pourquoi pas des classes ou des styles en JavaScript** : aucun composant n'a à connaître le thème, il suffit de changer un attribut.
- **Pas de flash blanc** : un petit script dans `index.html` applique le thème enregistré (ou la préférence du système) avant que React ne s'affiche.
- **Valeur par défaut** : sans choix enregistré, c'est la préférence système (`prefers-color-scheme`).

### 5.15 Paiement fictif via `/carts/add`

- **Choix** : `POST /carts/add` enregistre la commande ; la validation de la carte se fait dans le navigateur.
- **Pourquoi `/carts/add`** : DummyJSON n'a ni paiement ni réservation ; c'est la ressource qui simule le mieux une commande (`userId` et produits `{id, quantity}`). L'annonce joue le rôle de produit et la durée en heures celui de quantité. L'id de l'annonce est ramené dans la plage 1 à 100 (voir `api/bookings.ts`).
- **Sécurité** : **aucune donnée de carte n'est envoyée** à l'API ; elles sont effacées de l'état dès le paiement accepté. Seuls les 4 derniers chiffres sont affichés dans la confirmation.
- **Validation réaliste** : algorithme de Luhn, date d'expiration non dépassée, code à 3 ou 4 chiffres. Le numéro de test `4242 4242 4242 4242` est accepté.
- **Saisie assistée** : le numéro est regroupé par 4 chiffres, la date reçoit automatiquement son « / ».

### 5.16 Accessibilité

| Mesure | Où |
|---|---|
| Labels associés à chaque champ (`htmlFor` / `id`) | `Field` |
| Erreurs et aides reliées au champ (`aria-describedby`, `aria-invalid`, `aria-required`) | `Field` |
| Texte alternatif pertinent sur les images | `getServiceImageAlt` |
| Carte entièrement cliquable avec un **vrai lien** (titre), utilisable au clavier | `ServiceCard.css` (lien étendu) |
| Bouton de sauvegarde distinct, avec `aria-label` précisant l'annonce | `SaveButton` |
| Focus visible partout, y compris sur la carte entière | `base.css`, `ServiceCard.css` |
| Messages annoncés par les lecteurs d'écran (`role="status"`, `role="alert"`, `aria-live`) | `Message`, `ResultsCount` |
| Lien d'évitement « Aller au contenu » | `Layout` |
| Un seul `<main>`, titre d'onglet par page | `Layout`, `useDocumentTitle` |
| Boîte de dialogue avec focus piégé | `ConfirmDialog` |
| Types de champ adaptés (`email`, `number`, `date`, `inputMode`, `autoComplete`) | formulaires |

### 5.17 CSS classique, un fichier par composant

- **Choix** : CSS simple, avec un fichier à côté de chaque composant, importé par lui, plus `theme.css` et `base.css` globaux.
- **Pourquoi pas un seul `index.css`** : fichier difficile à parcourir, où l'on ne sait plus quelle règle sert à quoi.
- **Pourquoi pas Tailwind, CSS Modules ou une bibliothèque de composants** : le cahier des charges demande du CSS classique ; les bibliothèques sont autorisées mais n'étaient pas nécessaires et auraient masqué le travail sur l'accessibilité et le thème.
- **Convention** : noms de classes en BEM (`card__title`, `button--danger`).
- **Responsive** : grille `auto-fill` et `minmax`, `flex-wrap`, et quelques `@media` ciblés.

### 5.18 Oxlint et Prettier

- **Choix** : Oxlint (proposé à la création du projet Vite) avec la règle `react/rules-of-hooks` en erreur, plus Prettier.
- **Pourquoi pas ESLint** : le cahier des charges cite ESLint en exemple (« par exemple »), Oxlint est un linter équivalent pour cet usage et beaucoup plus rapide.
- **`--deny-warnings`** : traite les avertissements comme des erreurs, pour que « le lint passe sans erreur » soit réel.
- **Prettier** : formatage unique pour tout le projet, sans débat de style.

### 5.19 Conventions de code

- **Commentaires** : une phrase d'explication par fonction et par composant, plus des commentaires aux endroits subtils (annulation de requêtes, id locaux, stratégie de filtrage).
- **Séparation des responsabilités** : `api/` parle au réseau, `utils/` contient des fonctions pures, `hooks/` et `context/` gèrent l'état, `components/` affiche, `pages/` assemble.
- **Fonctions pures testables** : `filterServices`, `buildServices`, `validatePayment`, `validateServiceForm` n'utilisent pas React.

---

## 6. Architecture et flux de données

```
index.html ── applique le thème avant le rendu
   └─ main.tsx
        └─ ThemeProvider
             └─ BrowserRouter
                  └─ SearchProvider        (texte, filtres, page)
                       └─ ServicesProvider (charge la liste via useRequest)
                            └─ SavedProvider (localStorage)
                                 └─ App → <Routes> → Layout → page
```

**Chargement des annonces**

```
ServicesProvider
  └─ useRequest('services', fetchServices)
        └─ api/services.fetchServices
              ├─ fetchUsers    (obligatoire)
              ├─ fetchRecipes  (facultatif)
              └─ fetchPosts    (facultatif)
              └─ utils/buildServices  → Service[]
```

**Affichage de la liste** : `HomePage` lit `services` (contexte Services) et `criteria` (contexte Search), applique `filterServices` puis `paginate`, et passe le résultat à `ServiceGrid`.

**Écriture** : un formulaire appelle `api/services` (`createService`, `updateService`, `deleteService`). En cas de succès, la page met à jour le contexte (`addService`, `replaceService`, `removeService`) et les sauvegardes (`updateSaved`, `removeSaved`).

**Dossiers** :

| Dossier | Responsabilité |
|---|---|
| `api/` | Appels réseau uniquement. |
| `config/` | Contenu éditorial fixe. |
| `types/` | Définition des types TypeScript. |
| `utils/` | Fonctions pures. |
| `hooks/` | Logique réutilisable avec état. |
| `context/` | États partagés. |
| `components/` | Éléments d'interface, par domaine. |
| `pages/` | Une page par route, qui assemble les composants. |
| `styles/` | CSS global (variables, base). |

---

## 7. Rôle de chaque fichier

### 7.1 Racine du projet

| Fichier | Rôle |
|---|---|
| `package.json` | Dépendances et scripts (`dev`, `build`, `lint`, `format`…). |
| `index.html` | Page unique de l'application ; contient le script qui applique le thème avant le rendu. |
| `vite.config.ts` | Configuration de Vite (fournie par le template). |
| `tsconfig*.json` | Configuration TypeScript (fournie par le template). |
| `.oxlintrc.json` | Règles d'Oxlint. |
| `.prettierrc` | Règles de formatage (guillemets simples, point-virgule, virgules finales). |

### 7.2 `src/` : point d'entrée

| Fichier | Rôle |
|---|---|
| `main.tsx` | Monte React, importe les styles globaux et empile les providers (thème, routeur, recherche, annonces, sauvegardes). |
| `App.tsx` | Déclare les routes ; toutes partagent le `Layout`. |

### 7.3 `src/api/` : accès réseau

| Fichier | Rôle |
|---|---|
| `client.ts` | `API_URL`, `request` (fetch + vérification HTTP), `sendJson` (POST/PUT en JSON), `HttpError`, `isAbortError`. |
| `users.ts` | `fetchUsers` : tous les utilisateurs, champs réduits. |
| `recipes.ts` | `fetchRecipes` : toutes les recettes. |
| `posts.ts` | `fetchPosts` : auteurs et réactions des publications. |
| `services.ts` | `fetchServices` (croise les trois ressources), `createService` (POST), `updateService` (PUT), `deleteService` (DELETE) ; contient le commentaire expliquant le filtrage côté client. |
| `bookings.ts` | `createBooking` : enregistre la réservation (POST `/carts/add`). |

### 7.4 `src/config/` : contenu éditorial

| Fichier | Rôle |
|---|---|
| `serviceCatalog.ts` | Les 12 types de services : libellé, émoji, couleur, modèles de titres et descriptions, fourchette de tarif. Exporte aussi `SERVICE_TYPES` et `COOKING_TYPE`. |

### 7.5 `src/types/` : types TypeScript

| Fichier | Rôle |
|---|---|
| `api.ts` | Forme brute des données DummyJSON (utilisateur, recette, publication). |
| `service.ts` | `Service` (une annonce) et `Dish` (un plat). |
| `search.ts` | `SearchCriteria` et `DEFAULT_CRITERIA`. |
| `serviceForm.ts` | Valeurs, erreurs et valeurs initiales du formulaire d'annonce. |
| `payment.ts` | Valeurs, erreurs, valeurs initiales du paiement et données de confirmation. |

### 7.6 `src/utils/` : fonctions pures

| Fichier | Rôle |
|---|---|
| `buildServices.ts` | Transforme utilisateurs, recettes et publications en liste d'annonces. |
| `filterServices.ts` | `filterServices` (texte, type, tarif ensemble), `paginate`, `PAGE_SIZE` (20). |
| `serviceOptions.ts` | Calcule les types présents et les paliers de tarif pour les filtres. |
| `serviceImage.ts` | Génère l'illustration SVG d'un type et le texte alternatif d'une image. |
| `format.ts` | Formatage des montants, tarifs horaires et notes. |
| `formatInput.ts` | Mise en forme pendant la saisie (numéro de carte, date d'expiration). |
| `toFormValues.ts` | Convertit une annonce en valeurs de formulaire (préremplissage de la modification). |
| `validateServiceForm.ts` | Règles de validation du formulaire d'annonce. |
| `validatePayment.ts` | Règles de validation du paiement (Luhn, expiration, code) et `todayISO`. |

### 7.7 `src/hooks/` : logique réutilisable

| Fichier | Rôle |
|---|---|
| `useRequest.ts` | Exécute une requête avec état (chargement, erreur, succès), annulation et nouvel essai. |
| `useService.ts` | Retrouve une annonce par id (liste, sauvegardes) et gère les cas introuvable, supprimée, chargement. |
| `useServices.ts` | Accès au contexte des annonces. |
| `useSaved.ts` | Accès au contexte des sauvegardes. |
| `useSearch.ts` | Accès au contexte de recherche. |
| `useTheme.ts` | Accès au contexte du thème. |
| `useDocumentTitle.ts` | Met à jour le titre de l'onglet. |

### 7.8 `src/context/` : états partagés

| Fichier | Rôle |
|---|---|
| `SearchContext.ts` / `SearchProvider.tsx` | Texte, filtres et page courante ; `updateCriteria` remet la page à 1. |
| `ServicesContext.ts` / `ServicesProvider.tsx` | Liste des annonces, état de chargement, création, modification, suppression. |
| `SavedContext.ts` / `SavedProvider.tsx` | Annonces sauvegardées, persistance dans le `localStorage`. |
| `ThemeContext.ts` / `ThemeProvider.tsx` | Thème clair ou sombre, persistance et application à `<html>`. |

### 7.9 `src/styles/` : CSS global

| Fichier | Rôle |
|---|---|
| `theme.css` | Variables de couleurs pour les thèmes clair et sombre. |
| `base.css` | Réinitialisation, focus visible, conteneur, textes partagés (`muted`, `service-type`, `service-price`). |

### 7.10 `src/components/ui/` : composants génériques

| Fichier | Rôle |
|---|---|
| `Button.tsx`, `buttonClass.ts`, `Button.css` | Bouton à variantes (principal, secondaire, danger) et tailles ; `buttonClass` partage les classes avec `LinkButton`. |
| `LinkButton.tsx` | Lien de navigation qui ressemble à un bouton. |
| `BackLink.tsx` | Lien « ← Retour… ». |
| `Message.tsx` | Encadré d'information ou d'erreur avec rôle ARIA. |
| `AsyncContent.tsx` | Affiche chargement, erreur avec « Réessayer », introuvable, ou le contenu. |
| `ConfirmationPanel.tsx` | Panneau de confirmation après une action. |
| `ConfirmDialog.tsx` | Boîte de dialogue de confirmation (`<dialog>` natif). |
| `DescriptionList.tsx` | Liste « libellé / valeur » (`<dl>`). |
| `Field.tsx` | Champ contrôlé (input, textarea, select) avec label, aide et erreur. |
| `Form.tsx` | Formulaire sans validation native, et `FormGrid` (grille de champs). |
| `RequiredNote.tsx` | Rappel des champs obligatoires. |
| `Pagination.tsx` | Précédent / Suivant et page courante. |

Chaque composant a son fichier `.css` associé (même nom).

### 7.11 `src/components/layout/`

| Fichier | Rôle |
|---|---|
| `Layout.tsx` | Lien d'évitement, en-tête, `<main>` unique et `<Outlet />`. |
| `Header.tsx` | Titre du site, navigation, bouton de thème. |
| `ThemeToggle.tsx` | Bouton de bascule clair / sombre. |

### 7.12 `src/components/services/`

| Fichier | Rôle |
|---|---|
| `ServiceCard.tsx` | Carte d'une annonce. |
| `ServiceGrid.tsx` | Grille de cartes. |
| `ResultsCount.tsx` | Nombre de résultats avec accord au pluriel. |
| `SearchPanel.tsx` | Formulaire de recherche (texte) qui contient les filtres. |
| `ServiceFilters.tsx` | Filtres de type et de tarif, plus bouton « Réinitialiser ». |
| `SaveButton.tsx` | Sauvegarder ou retirer une annonce. |
| `ServiceDetail.tsx` | Fiche détaillée : image, texte, actions, informations. |
| `ServiceActions.tsx` | Boutons de la fiche : réserver, sauvegarder, modifier, supprimer. |
| `ServiceInfoList.tsx` | Liste des informations de la fiche (adaptée aux données disponibles). |
| `DeleteServiceButton.tsx` | Suppression avec confirmation, appel à l'API et mise à jour de l'interface. |
| `ServiceSummary.tsx` | Récapitulatif d'une annonce dans les confirmations. |

### 7.13 `src/components/forms/` et `src/components/payment/`

| Fichier | Rôle |
|---|---|
| `forms/ServiceForm.tsx` | Formulaire d'annonce (création et modification) avec validation et gestion des états d'envoi. |
| `payment/BookingForm.tsx` | Formulaire de réservation et de paiement fictif, total en direct. |
| `payment/BookingConfirmation.tsx` | Confirmation de réservation. |

### 7.14 `src/pages/` : une page par route

| Fichier | Route | Rôle |
|---|---|---|
| `HomePage.tsx` | `/` | Recherche, filtres, grille et pagination. |
| `ServiceDetailPage.tsx` | `/services/:id` | Fiche d'une annonce. |
| `EditServicePage.tsx` | `/services/:id/edit` | Modification d'une annonce. |
| `PaymentPage.tsx` | `/services/:id/book` | Réservation et paiement. |
| `SavedPage.tsx` | `/saved` | Annonces sauvegardées. |
| `CreateServicePage.tsx` | `/new` | Publication d'une annonce. |
| `NotFoundPage.tsx` | `*` | URL inconnue. |

---

## 8. Limites et problèmes connus

| Limite | Explication |
|---|---|
| **Changements non persistants** | DummyJSON simule la création, la modification et la suppression. Après rechargement, une annonce créée ou modifiée disparaît, une annonce supprimée réapparaît. Les sauvegardes et le thème, eux, sont conservés. |
| **Localisations américaines** | Toutes les villes viennent de DummyJSON et sont aux États-Unis. |
| **Données de l'API en anglais** | Les professions et les noms de plats sont affichés tels que l'API les fournit. Seuls les textes du site et la difficulté des recettes sont traduits. |
| **Contenu éditorial fixe** | Types de services, titres, descriptions et fourchettes de tarifs sont définis dans `serviceCatalog.ts`, car l'API n'a pas de services. Plusieurs annonces partagent donc le même titre. |
| **Note = réactions aux publications** | Interprétation de données DummyJSON, pas un vrai système d'avis. |
| **Pas d'authentification** | Tout visiteur peut modifier ou supprimer n'importe quelle annonce. |
| **Réponses de `PUT` et `DELETE`** | Le code se fonde sur le succès HTTP ; pour tout champ absent de la réponse, il reprend la valeur envoyée. |
| **Paiement fictif** | Aucun débit réel ; la commande est simulée avec un identifiant de produit ramené dans la plage 1 à 100, et la confirmation n'est pas conservée (pas de page « Mes réservations »). |
| **Image de promotion** | Une seule URL est acceptée. Si le lien est cassé, l'image ne s'affiche pas (texte alternatif visible), sans image de repli. |
| **Annonces créées** | Leur URL contient un identifiant très long (basé sur l'heure). |
| **Recherche à la validation** | Le texte est appliqué à la soumission du formulaire. La recherche automatique avec délai (bonus) n'a pas été réalisée. |
| **Chargement complet de la liste** | Adapté à ~200 éléments ; à revoir avec un jeu de données plus volumineux (filtrage et pagination côté serveur). |