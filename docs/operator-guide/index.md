# Orion operator guide

## What is Orion?

Orion is a backed node powering [Atlas](https://github.com/Joystream/atlas).

To learn how to run your own instance of Atlas, please refer to the [Atlas operator guide](https://github.com/Joystream/atlas/blob/master/docs/operator-guide.md).

## All tutorials

- [Running and testing Orion locally](./tutorials/local-testing.md)
- Gateway operator tasks:
    - [Setting supported categories](./tutorials/setting-supported-categories.md)
    - [Setting up _App attribution_](./tutorials/app-attribution.md)
    - [Managing maintenance mode](./tutorials/maintenance-mode.md)
    - [Changing configuration values](./tutorials/changing-config-values.md)
    - [Accessing user reports](./tutorials/reported-content.md)
    - [Excluding (censoring) content](./tutorials/excluding-content.md)
    - [Featuring content](./tutorials/featuring-content.md)
- Production deployment:
    - [Deploying Orion to production](./tutorials/deploying-orion.md)
    - [Upgrading Orion](./tutorials/upgrading-orion.md)


## Orion architecture

Orion is actually a set of services, many of which are part of its underlying framework, [Subsquid](https://docs.subsquid.io/).

The description of each of those services can be found in the [developer guide](./developer-guide/architecture-overview.md#services).

## Running Orion instance

### Running / testing locally

The easiest way to run the latest version of Orion locally is to use a [`joystream/orion` docker image](https://hub.docker.com/r/joystream/orion), which is automatically built and published to Docker Hub on each new Orion release.

You can find instructions on how to run Orion locally with Docker and test it together with [Atlas](https://github.com/Joystream/atlas) in the [Local testing](./tutorials/local-testing.md) tutorial.

To explore other ways of running Orion locally, which involve building the code from source, you can read _[Running local development instance](../developer-guide/running-local-instance.md)_ tutorial from the developer guide.

### Deploying to production

To learn how to deploy Orion to production, please read the _[Deployment](./tutorials/deploying-orion.md)_ tutorial.

### Upgrading a production instance

The process of upgrading a production instance of Orion in the event of a new release is described in the _[Upgrading](./tutorials/upgrading-orion.md)_ tutorial.