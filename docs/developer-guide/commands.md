# Commands

## Make commands
- `make typegen` - generates event types (`src/types`) based on `typegen.json`
- `make codegen` - generates TypeORM models based on the [input schema](#input-schema)
- `make dbgen` - generates the `Data-{timestamp}.js` database migration in `db/migrations` (PostgreSQL service must be running) based on the difference between current database schema and the TypeORM models inside `src/models`
- `make migrate` - runs database migrations from `db/migrations` (PostgreSQL service must be running)
- `make build` - builds the code
- `make build-docker` - builds the `joystream/orion` docker image
- `make prepare` - runs `npm install + codegen + build`
- `make process` - executes `make migrate` and runs the processor locally (ie. not as a docker service)
- `make serve` - runs the GraphQL server locally (not as a docker service)
- `make serve-auth-api` - runs the `auth-api` service locally (not as a docker service)
- `make up-squid` - runs dockerized `orion_db`, `orion_processor`, `orion_graphql-server` and `orion_auth-api` services (`docker-compose up -d`)
- `make up-archive` - runs dockerized `archive_db`, `subsquid-gateway`, `archive-ingest` and `archive-explorer` services (`docker-compose -f archive/docker-compose.yml up -d`)
- `make up` - runs `up-squid` + `up-archive`
- `make down-squid` - removes docker services and volumes created by `up-squid`
- `make down-archive` - removes docker services and volumes created by `up-archive`
- `make down` - runs `down-squid` + `down-archive`

## NPM commands
- `npm run generate:schema` - converts schema files from `src/schema` into a single `schema.graphql` file (for [Squid Aquarium](https://docs.subsquid.io/deploy-squid/quickstart/) compatibility)
- `npm run generate:types:auth-api` - generates types for the `auth-api` service based on the OpenAPI schema (see: [Authentication API](./tutorials/authentication-api.md))
- `npm run generate:docs:auth-api` - generates markdown documentation for the `auth-api` service based on the OpenAPI schema (see: [Authentication API](./tutorials/authentication-api.md))
- `npm run build` - builds the code
- `npm run lint` - runs the linter (ESLint), see: [Code style](./code-style.md)
- `npm run format` - runs the code formatter (Prettier), see: [Code style](./code-style.md)
- `npm run checks` - runs basic checks (linting, formatting, type checking), see: [Code style](./code-style.md)
- `npm run db:migrate` - runs database migrations, same as `make migrate`
- `npm run processor-start` - similar to `make process`, but doesn't run migrations
- `npm run graphql-server-start` - similar to `make serve`
- `npm run auth-server-start` - same as `make serve-auth-api`
- `npm run tests:auth-api` - runs unit tests for the `auth-api` service (see: [Authentication API](./tutorials/authentication-api.md)).
- `npm run offchain-state:export` - performs the offchain state export, see: [Preserving offchain state](./tutorials/preserving-offchain-state.md)