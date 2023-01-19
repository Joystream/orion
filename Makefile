process: migrate
	@SQD_DEBUG=sqd:processor:mapping node -r dotenv-expand/config lib/processor.js

install:
	@npm install

build:
	@npm run build

build-processor-image:
	@docker build . --target processor -t orion-processor

build-query-node-image:
	@docker build . --target query-node -t orion-api

build-images: build-processor-image build-query-node-image

serve:
	@npx squid-graphql-server --subscriptions

migrate:
	@npx squid-typeorm-migration apply

dbgen:
	@npx squid-typeorm-migration generate

codegen:
	@npx squid-typeorm-codegen


typegen:
	@npx squid-substrate-typegen typegen.json

prepare: install codegen build

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
