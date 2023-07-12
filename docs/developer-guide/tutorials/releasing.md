# Releasing Orion

When releasing new version of Orion make sure that:
1. All pull requests you wish to include in the release are already merged into the `master` branch.
1. Orion version has been bumped and the `CHANGELOG` file has been updated acording to instructions provided in [_Versioning_](../versioning.md).
1. The `CHANGELOG` clearly states all changes included in the release that:
    - could break or in some other way significantly affect the behavior of previous versions of Atlas (ie. are affecting the GraphQL API / Auth API),
    - require additional steps to be taken by the Gateway operators that wish to upgrade to the new version. For example: 
        - introduction of new environment variables or changes to existing environment variables,
        - changes to database schema that would require the operators to execute non-standard migration steps,
        - changes to default docker-compose configuration that would require the Operators make adjustments to their current setup.
1. All other documentation has been porperly updated to reflect any significant changes introduced in the release. This includes both this documentation (the [Orion Developer Guide](../index.md)) and the [Orion Operator Guide](../../operator-guide/index.md).
1. In case of any changes related to environment variables or docker configuration, make sure a PR to update Orion docker setup in the [Joystream monorepo](https://github.com/Joystream/joystream) has been created and merged as well (example: https://github.com/Joystream/joystream/pull/4730)
1. In case any changes are affecting [Offchain data](../tutorials/preserving-offchain-state.md) schema in a non-backward-compatible way, make sure a proper export data migration step was added accordingly to _[Introducing breaking changes to Offchain data schema](../tutorials/preserving-offchain-state.md#introducing-breaking-changes-to-offchain-data-schema)_.

Once all of those conditions are met, you can proceed with [creating a GitHub release](https://github.com/Joystream/orion/releases/new):

1. Create a new tag matching the version specified in [`package.json`](../../package.json) (for example: `2.3.0`) on the release commit.
1. Use the same version number as the release title as well.
1. When describing the release:
    - Add a note about whether the upgrade of Atlas is also required/recommended for the Gateway operators. If it is, make sure to specify the version of Atlas compatible with the new Orion version.
    - Make sure to describe any non-standard upgrading requirements / steps. By non-standard we mean any steps that are a deviation from [_Typical upgrade_](../../operator-guide/tutorials/upgrading-orion.md#typical-upgrade-process) process described in _Upgrading Orion_ tutorial inside the Orion Operator Guide.
    - Provide a link to the related [CHANGELOG](../../CHANGELOG.md) entry.

## Updating Orion for Gleev

When updating Orion instance used by the Gleev gateway, you should generally follow _[Upgrading Orion](../../operator-guide/tutorials/upgrading-orion.md)_ tutorial from the Orion Operator Guide. If you notice that any deviations from the standard upgrade process are required, make sure they are mentioned in the release notes as described above.