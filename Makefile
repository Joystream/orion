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
	@npx squid-graphql-server --subscriptions

serve-auth-api:
	@npm run auth-server-start

serve-interactions-api:
	@npm run interactions-server-start

migrate:
	@npx squid-typeorm-migration apply

dbgen:
	@npx squid-typeorm-migration generate

codegen:
	@npm run generate:schema || true
	@npx squid-typeorm-codegen

setup-recommendations:
	@npm run recommendations:setup

typegen:
	@npx squid-substrate-typegen typegen.json

prepare: install codegen build setup-recommendations

up-squid:
	@set -a; \
	source .env; \
	set +a; \
	docker network create joystream_default || true; \
	if [ -z "$$RECOMMENDATION_SERVICE_PRIVATE_KEY" ] && [ -z "$$RECOMMENDATION_SERVICE_DATABASE"]; then \
		docker-compose up -d; \
	else \
		docker-compose --profile interactions up -d; \
	fi \

up-archive:
	@docker network create joystream_default || truee
	@docker-compose -f archive/docker-compose.yml up -d

up: up-archive up-squid

down-squid:
	@docker-compose down -v --remove-orphans

down-archive:
	@docker-compose -f archive/docker-compose.yml down -v

down: down-squid down-archive

.PHONY: build serve process migrate codegen typegen prepare up-squid up-archive up down-squid down-archive down
