# Preserving _Offchain data_

We can divide the data stored in Orion's database into 2 categories:
- **Chain data**: the data that is a result of processing the Joystream blockchain events. This data, even if lost, can be reconstructed given an archival Joystream node endpoint or a Subsquid archive endpoint.
- **Offchain data**: the data specific to a given Gateway, which cannot be reconstructed from the chain data. It includes: categories supported by the Gateway and other Gateway configuration values, video views, channel follows, user accounts, other authentication data etc.

Making changes to the [input schema](./updating-schema.md), intoducing [new event handlers](./adding-new-event-handlers.md) or updating the existing event handlers, will usually require all the Joystream blockchain events to be reprocessed by Orion and the _Chain data_ to be reconstructed from scratch. At the same time, we usually want to preserve the _Offchain data_.

To support that, Orion provides the `OffchainState` service ([`src/utils/offchainState.ts`](../../../src/utils/offchainState.ts)), which is responsible for exporting and importing the _Offchain data_ during Orion upgrades which involve event reprocessing.

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

It's possible to preserve all relations between the _Offchain data_ and _Chain data_ because when the data is exported, the number of the last processed block at the time is saved as part of the export JSON file (`db/export.json`).

The data is then automatically imported after all events up until (and including) this block are already processed, to make sure the database includes all the expected entities during import.

After the data is imported, the export file is renamed to `export.json.imported` to prevent the processor from trying to import the same data again.

**The _Offchain data_ is automatically exported when you run `make down` or `make down-squid` to bring down the current Orion services (but it's NOT exported when you use `docker-compose down`!)**