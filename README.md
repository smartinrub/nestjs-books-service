# Books Service

## Installation

```bash
$ npm install
```

## Migrations

### Generate migrations from entitities

```bash
npm run migration:generate
```

### Create new migration

```bash
npm run migration:create --name=<REPLACE_WITH_MIGRATION_NAME>
```

## Seed database

```bash
# Run database
docker run -p 5432:5432 -e POSTGRES_USER=user1 -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=booksservice --rm postgres:16

# Run seeder
npm run seed:run
```

## Running the app

```bash
# Run database
docker run -p 5432:5432 -e POSTGRES_USER=user1 -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=booksservice --rm postgres:16

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
