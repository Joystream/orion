# Upgrading Orion

You'll usually be upgrading Orion together with Atlas in case there is a new release and you would like to take advantage of the new features and bug fixes introduced in the new version.

## Staying up-to-date with the latest releases

Orion follows the release process described in _[Releasing Orion](../../developer-guide/tutorials/releasing.md)_ tutorial inside the Orion Developer Guide.

You can check the list of all Orion releases on the [GitHub releases](https://github.com/Joystream/orion/releases) page of Orion repository.

The changes introduced in each of those releases are also described in the [CHANGELOG](../../../CHANGELOG.md).

On the Atlas side, you can check the list of releases [here](https://github.com/Joystream/atlas/releases) and the CHANGELOG can be found [here](https://github.com/Joystream/atlas/blob/master/CHANGELOG.md).

Always make sure the versions of Orion and Atlas you're planing to upgrade to are compatible with each other.

## Typical upgrade process (For Breaking Changes)

1. Turn on the _kill switch_ ([maintenance mode](./maintenance-mode.md)). This will prevent the users from interactig with the Gateway during the upgrade, as this could have undesired consequences (for example, due to processor not being fully synced). To do that you should execute `setKillSwitch(isKilled: true)` operator mutation using Orion's GraphQL API (you need to be authenticated as Operator first).

1. Make sure to update the `.env` file in case there are any new environment variables introduced or a change in some existing environment variable value is required. This should be mentioned in the [CHANGELOG](../../../CHANGELOG.md) and/or the [release notes](https://github.com/Joystream/orion/releases).

1. **Backup the databse** before the upgrade. You can do that by executing the following command on the production server:
    ```bash
    docker exec orion_db pg_dumpall -U postgres -p 23798 > "orion-production-$(date '+%Y-%m-%d').bak"
    ```
    Make sure the backup file was successfully created in the current directory.
1. Stop the processor and create [Offchain data export](../../developer-guide/tutorials/preserving-offchain-state.md) file:
    ```bash
    docker-compose stop orion_processor
    docker-compose run --rm orion_processor npm run offchain-state:export
    ```
    Make sure the export file was created successfully under `./db/export/export.json`
1. Download the latest Orion docker image:
    ```bash
    docker tag joystream/orion:latest joystream/orion:previous
    docker pull joystream/orion:latest
    ```
1. Bring down all of the currently running Orion services:
    ```bash
    docker-compose down -v
    ```
1. Start the new Orion services:
    ```bash
    docker-compose up -d
    ```
1. Wait for the Orion processor to catch up with the Joystream blockchain before disabling the _kill switch_. You can follow the processor logs using:
    ```bash
    docker logs -f --tail 10 orion_processor
    ```
    You can also check the logs of other docker services, ie. `orion_graphql-api`, `orion_auth-api` and `orion_db` to make sure they are running as expected.
1. After the processor is synced, you can run some test queries on `https://query.mygateway.com/graphql` (first you'll need to authenticate, for example through `https://auth.mygateway.com/playground`) to make sure the new version is working as expected.
1. Once you're confident that the release was successful, disable the _kill switch_ by executing `setKillSwitch(isKilled: false)` operator mutation using Orion's GraphQL API.

## Restoring the previous version

In case something goes wrong during the upgrade, you can restore the database from backup created in step `2.` and switch back to the previous version of Orion by executing the following commands:
```bash
    # Bring down the Orion services
    docker-compose down -v
    # Remove the export.json file (if exists) as it may interfere with the restore process
    rm ./db/export/export.json
    # Switch back to the previous version of joystream/orion docker image
    docker tag joystream/orion:previous joystream/orion:latest
    # Start the orion-db service
    docker-compose up -d orion_db
    # Copy the backup file to the orion-db container
    # Replace the YYYY-mm-dd with the date of the backup you wish to restore
    docker cp "orion-production-YYYY-mm-dd.bak" orion_db:/tmp/orion-production.bak
    # Restore the database
    docker exec orion_db psql -f /tmp/orion-production.bak -U postgres -p 23798 postgres
    # Bring up the Orion services
    docker-compose up -d
```


## Upgrade Process (For Non-breaking Changes)

The non breaking changes include examples such as adding nullable field to the entity or making the change to the mappings that does not require processor re-syncing. In this case, you just new to restart the services to deploy new changes:

```bash
# Restart the Orion services to apply latest code changes
docker restart orion_processor orion_graphql-server orion_auth-api
```
