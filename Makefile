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
	@docker run -d --name temp_migrations_db \
		-e POSTGRES_DB=squid \
		-e POSTGRES_HOST_AUTH_METHOD=trust \
		-v temp_migrations_db_volume:/var/lib/postgresql/data \
		-v ./db/postgres.conf:/etc/postgresql/postgresql.conf \
		-p 5555:5555 postgres:14 postgres -p 5555 || true
	@sleep 5
	@export DB_PORT=5555 && npx squid-typeorm-migration apply --filename *-Admin.js
	@ls db/migrations > db/migrations_dir_before.txt
	@export DB_PORT=5555 && npx squid-typeorm-migration apply --filename *-Data.js
	@export DB_PORT=5555 && npx squid-typeorm-migration generate || true
	@ls db/migrations > db/migrations_dir_after.txt
	@if ! diff db/migrations_dir_before.txt db/migrations_dir_after.txt > /dev/null ; then \
		rm db/migrations/*-Views.js; \
		node db/generateViewsMigration.js; \
	fi;
	@docker rm temp_migrations_db -vf || true
	@docker volume rm temp_migrations_db_volume || true
	@rm db/migrations_dir_before.txt db/migrations_dir_after.txt || true

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
