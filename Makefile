process: migrate
	@SQD_DEBUG=sqd:processor:mapping node -r dotenv-expand/config lib/processor.js

install:
	@rm -rf node_modules # clean up node_modules to avoid issues with patch-package
	@npm install

build:
	@npm run build

build-docker:
	@docker build . -t joystream/orion

serve:
	@npm run graphql-server-start

serve-auth-api:
	@npm run auth-server-start

migrate:
	@npx squid-typeorm-migration apply

dbgen:
	@npx squid-typeorm-migration generate

generate-migrations: 
	@rm db/migrations/*-Data.js || true
	@docker run -d --name temp_migrations_db \
		-e POSTGRES_DB=squid \
		-e POSTGRES_HOST_AUTH_METHOD=trust \
		-v temp_migrations_db_volume:/var/lib/postgresql/data \
		-v ./db/postgres.conf:/etc/postgresql/postgresql.conf \
		-p 5555:5555 postgres:14 postgres -p 5555 || true
	@export DB_PORT=5555 && sleep 5 && npx squid-typeorm-migration generate
	@docker rm temp_migrations_db -vf || true
	@docker volume rm temp_migrations_db_volume || true

codegen:
	@npm run generate:schema || true
	@npx squid-typeorm-codegen


typegen:
	@npx squid-substrate-typegen typegen.json

prepare: install typegen codegen build

up-squid:
	@docker network create joystream_default || true
	@docker-compose up -d

up-archive:
	@docker network create joystream_default || true
	@docker-compose -f archive/docker-compose.yml up -d

up: up-archive up-squid

down-squid:
	@docker-compose down -v
	
down-archive:
	@docker-compose -f archive/docker-compose.yml down -v

down: down-squid down-archive

.PHONY: build serve process migrate codegen typegen prepare up-squid up-archive up down-squid down-archive down
