# Preserving _Offchain data_

We can divide the data stored in Orion's database into 2 categories:
- **Chain data**: the data that is a result of processing the Joystream blockchain events. This data, even if lost, can be reconstructed given an archival Joystream node endpoint or a Subsquid archive endpoint.
- **Offchain data**: the data specific to a given Gateway, which cannot be reconstructed from the chain data. It includes: categories supported by the Gateway and other Gateway configuration values, video views, channel follows, user accounts, other authentication data etc.

Making changes to the [input schema](./updating-schema.md), introducing [new event handlers](./adding-new-event-handlers.md) or updating the existing event handlers, will usually require all the Joystream blockchain events to be reprocessed by Orion and the _Chain data_ to be reconstructed from scratch. At the same time, we usually want to preserve the _Offchain data_.

To support that, Orion provides the `OffchainState` service ([`src/utils/offchainState.ts`](../../../src/utils/offchainState.ts)), which is responsible for exporting and importing the _Offchain data_ during [Orion upgrades](../../operator-guide/tutorials/upgrading-orion.md) which involve event reprocessing.

The data to be exported is described by the `exportedStateMap` const. It's possible to export either the entire tables (like `user` or `account`) or just some specific fields of a given entity (like `is_featured` field of the `OwnedNft` entity).

In order to add a new table to be exported, you can add a new entry to the `exportedStateMap` const, where the key is the name of the TypeORM entity and the value is `true`. For example, if you added a new entity called `EmailNotification` to the input schema and you want all the data from the `email_notification` table to be preserved across Orion upgrades, you should add the following entry to the `exportedStateMap`:
```ts
// src/utils/offchainState.ts
// ...
const exportedStateMap = {
  // ...
  EmailNotification: true,
}
```

On the other hand, if you added some functionality which allows the Gateway operator to set the value of a new `isFeatured` flag which you added directly to the `Channel` entity (that mostly consists of the _Chain data_), you can modify the `exportedStateMap` in the following way:
```ts
// src/utils/offchainState.ts
// ...
const exportedStateMap = {
  // ...
  Channel: [
    // Notice we're using snake_case here, because we're referring to the database column name,
    // not the entity property name!
    'is_featured',
    // other exported properties of the Channel entity...
  ]
}
```

The export file can be generated via `npm run offchain-state:export` command and is saved to `db/export/export.json`.

It has a structure like this:
```json
{
  "orionVersion": "2.2",
  "blockNumber": 123,
  "data": {
    "VideoViewEvent": {
      "type": "insert",
      "values": [
        {
          "id": "1-1",
          "videoId": "1",
          "ip": "::ffff:10.201.11.1",
          "timestamp": "2023-06-01T09:10:09.284Z"
        },
        {
          "id": "2-1",
          "videoId": "2",
          "ip": "::ffff:10.201.11.1",
          "timestamp": "2023-06-01T09:10:12.869Z"
        }
      ]
    },
    "Video": {
      "type": "update",
      "values": [
        {
          "id": "1",
          "is_excluded": false,
          "views_num": 1
        },
        {
          "id": "2",
          "is_excluded": false,
          "views_num": 1
        }
      ]
    }
  }
}
```

The data from the export file is automatically imported by Orion processor once the block specified in `blockNumber` property (which is set to the last processed block at the time of the export) is processed. Once imported, the export file is renamed to `export.json.imported` to prevent the processor from trying to import the same data again.

This allows preserving any relations between the _Offchain data_ and _Chain data_ because the _Chain data_ state in the database at the time of the import should be at the same stage as it was at the time of the export.

## Introducing breaking changes to _Offchain data_ schema

In case you're introducing some breaking changes to the _Offchain data_ schema, like:
- adding a new required field to an existing entity,
- removing an existing entity,
- removing a field from an existing entity,
- changing the type of an existing entity field,
- etc.

You should specify additional migration steps to be executed on `OffchainState.import`.

Suppose that a new release of Orion is coming: `2.3.0` (we're assuming that the currently released version is `2.2.0`). As one of the changes introduced in this release, the `Session.os` field is going to be split into  `Session.osName` and `Session.osVersion` fields, ie.:
```diff
type Session @entity {
  # ...
-  "Operating system (as determined based on user-agent header)"
-  os: String!
+  "Operating system name (as determined based on user-agent header)"
+  osName: String!
+
+  "Operating system version (as determined based on user-agent header)"
+  osVersion: String!
}
```

In that case we can imagine that a Gateway operator who will try to upgrade from `2.2.0` to `2.3.0` will create an export file in which the `Session` entity will still have the old `os` field instead of the new `osName` and `osVersion` fields. You should therefore write a function which will convert the data from such export to the new schema, so that it can be imported without any issues, ie.:

```ts
// src/utils/offchainState.ts
// ...
function migrateExportDataV230(data: ExportedData): ExportedData {
  data.Session.values.forEach((sessionData) => {
    const [osName, osVersion] = (sessionData.os as string).split(' ')
    delete sessionData.os
    sessionData.os_name = osName
    sessionData.os_version = osVersion
  })
  return data
}
```

Then you should add a new entry to `OffchainState.migrations` map, where the key is the new version of Orion that's going to be released (`2.3.0`) and the value is the migration function you just wrote:
```ts
// src/utils/offchainState.ts
// ...
export class OffchainState {
  // ...
  private migrations: Migrations = {
    '2.3.0': migrateExportDataV230,
  }
}
```

During the import, the `OffchainState` service will execute all of the migration functions for versions between the one specified in the `orionVersion` field of the export file (exclusive) and the current version (inclusive), in the ascending order.

For example, if the export file has `orionVersion` set to `2.3.0`, the current version is `2.4.0` and the migrations map contains the following entries:
```ts
{
  '2.4.0': migrateExportDataV240,
  '2.3.1': migrateExportDataV231,
  '2.3.0': migrateExportDataV230,
}
```
Then the `OffchainState` service will first convert the export data using `migrateExportDataV231` and then run `migrateExportDataV240` on the result of that conversion (`migrateExportDataV230` will be skipped because in this case the export was already made on version `2.3.0`).
