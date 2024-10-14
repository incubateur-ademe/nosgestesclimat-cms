# nosgestesclimat-cms

Une application strapi qui gère la fonctionnalité blog de [nosgestesclimat-site-nextjs](https://github.com/incubateur-ademe/nosgestesclimat-site-nextjs).

## Dev

### Pré-requis

Ce projet utilise [node](https://nodejs.org), [yarn](https://yarnpkg.com/), [docker](https://www.docker.com/) et [docker-compose](https://docs.docker.com/compose/)

Pour l'utiliser en local, cloner ce repo et créer un fichier .env contenant les variables contenues dans le fichier [`.env.example`](./.env.example)

### Commandes utiles

Installe les dépendances

```bash
yarn install
```

Lance les services bases de données

```bash
docker-compose up
```

Builde le projet (requiert les dépendances)

```bash
yarn build
```

Lance le service (requiert les services)

```bash
yarn start
```

Lance le service en mode dev (requiert les services)

```bash
yarn develop
```

Formatte le code

```bash
yarn format
```

Lint le code

```bash
yarn lint
```
