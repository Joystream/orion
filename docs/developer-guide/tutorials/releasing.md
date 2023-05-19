# Releasing Orion

## Before releasing

Make sure all those steps are completed before releasing a new version of Orion:
1. All pull requests you wish to include in the release are already merged into the `master` branch.
1. Orion version has been bumped, the release has been properly tagged on GitHub and the `CHANGELOG` file has been updated acording to instructions provided in [_Versioning_](../versioning.md).
1. In case of any changes related to environment variables or docker configuration, make sure a PR to update Orion setup in the [Joystream monorepo](https://github.com/Joystream/joystream) has been created and merged as well.

## Release process

The release process of Orion usually consists of the following steps:

1. Turn on the _kill switch_ (maintenance mode). This will prevent the users from interactig with the Gateway during the upgrade, as this could have undesired consequences (for example, due to processor not being fully synced). To do that you should execute `setKillSwitch(isKilled: true)` operator mutation using Orion's GraphQL API (you need to be [authenticated](./authentication-api.md) as Operator).
1. Watch out for changes in the `.env` file! The production instance of Orion should have different `.env` configuration values than the default ones. When pulling the latest `master` on the production instance make sure to:
    1. Preserve the currently set production values of the environment variables.
    2. Update values of any new environment variables introduced in the release to production values if needed.
1. Backup the databse! You can do that by executing the following command:
    ```bash
    docker exec orion_db pg_dumpall -p 23798 -U postgres > "orion-production-$(date '+%Y-%m-%d').bak"
    ```
1. Execute `make down` in order to export the [_Offchain state_](./preserving-offchain-state.md) and bring down the Orion services.
1. Execute `make prepare` to run all the install, codegen and build steps on the updated codebase.
1. Execute `make up` to bring up the Orion services.
1. Wait for the Orion processor to catch up with the Joystream blockchain before disabling the _kill switch_. You can follow the processor logs using:
    ```bash
    docker logs -f --tail 10 orion_processor
    ```
    You can also check the logs of other docker services to make sure they are running as expected.
1. After the processor is synced, run some test queries to make sure the new version is working as expected.
1. Once you're confident that the release was successful, disable the _kill switch_ by executing `setKillSwitch(isKilled: false)` operator mutation using Orion's GraphQL API.



## Restoring the previous version

In case something goes wrong during the upgrade, you can restore the database from backup created in step `5.` and switch back to the previous version of Orion by executing the following commands:
```bash
    # Bring down the Orion services
    docker-compose down -v
    # Remove the export.json file (if exists) as it may interfere with the restore process
    rm db/export.json
    # Switch back to the previous version
    # git checkout ...
    # Prepare the working directory
    make prepare
    # Start the db service
    docker-compose up -d orion_db
    # Copy the backup file to the db container
    # Replace the YYYY-mm-dd with the date of the backup you wish to restore
    docker cp "orion-production-YYYY-mm-dd.bak" orion_db:/tmp/orion-production.bak
    # Restore the database
    docker exec orion_db psql -p 23798 -f /tmp/orion-production.bak -U postgres postgres
    # Bring up the Orion services
    make up-squid
```