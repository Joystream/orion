# Adding new event handlers

You may want to introduce event handler functions for runtime events not previously supported by Orion, either because:
- new event(s) are going to be introduced in a runtime upgrade. In this case, you should first familiarize yourself with [Supporting runtime upgrades](supporting-runtime-upgrades.md) guide,
- you wish to extend Orion's functionality to support events that are emitted by the current runtime, but not yet supported by Orion.

Let's imagine a scenario where you want to add support for the `Content.CuratorGroupCreated` event, which is not yet supported by Orion. In order to do that, you will need to:
1. Update the `typegen.json` file to inform the [Subsquid typegen](https://docs.subsquid.io/substrate-indexing/squid-substrate-typegen/) (`make typegen`) that it should generate a new class for `Content.CuratorGroupCreated` event inside `src/types/events.ts` file.
2. Add a mapping from an event name to its constructor (class) to `eventConstructors` const inside `src/utils/events.ts`, ie.:
    ```typescript
    // src/utils/events.ts
    import { ContentCuratorGroupCreatedEvent } from '../types/events';
    // ...
    export const eventConstructors = {
        // ...
        'Content.CuratorGroupCreated': ContentCuratorGroupCreatedEvent,
    }
    ```

3. Add the event to `SubstrateBatchProcessor` instance via `addEvent` method inside `src/processor.ts` in order to instruct the processor to fetch those events from the archive gateway and include them in the queue of events to process:
    ```typescript
    // src/processor.ts
    // ...
    processor.addEvent('Content.CuratorGroupCreated', defaultEventOptions)
    ```
4. Implement a handler function inside `src/mappings` which takes `EventHandlerContext<'Content.CuratorGroupCreated'>` as argument:
    ```typescript
    // src/mappings/content/curatorGroups.ts
    import { EventHandlerContext } from '../../utils/events'
    // ...
    export async function processCuratorGroupCreatedEvent({
      overlay,
      event,
    }: EventHandlerContext<'Content.CuratorGroupCreated'>): Promise<void> {
      // Event handler logic...
    }
    ```
5. Add a mapping from event name to new handler function to `eventHandlers` const inside `src/processor.ts`:
    ```typescript
    // src/processor.ts
    // ...
    import { processCuratorGroupCreatedEvent } from './mappings/content/curatorGroups'
    // ...
    const eventHandlers: { [E in EventNames]: EventHandler<E> } = {
      // ...
      'Content.CuratorGroupCreated': processCuratorGroupCreatedEvent,
    }
    ```

Orion processor will now trigger the `processCuratorGroupCreatedEvent` function for each `Content.CuratorGroupCreated` event emitted by the runtime.

## Understanding the overlay

The _overlay_ ([`src/utils/overlay.ts`](../../../src/utils/overlay.ts)) is the processor's in-memory layer where the entities can be cached and from which they can be retrieved based on their id or relations to other entities. Entities can be updated multiple times within the overlay before the final state is persisted to the database.

This allows combining the result of multiple mutations that happen within the same batch of processed events (as the events are being processed in [batches](https://docs.subsquid.io/substrate-indexing/context-interfaces/#batchcontext-interface)) into a single database update. In also allows batching INSERT/UPDATE/DELETE operations for multiple entities at once. This can significantly reduce the processing speed.

The `EntityManagerOverlay` is part of the event handler context and is the main interface for managing (creating, updating, retrieving) entities within the event handlers.

The basic interface of the overlay is as follows:

```typescript
// Create a new Channel entity (to be inserted later) and store it in the overlay
overlay.getRepository(Channel).new({
  id,
  // ...
})

// Retrieve a Channel entity by id, either from the overlay (if available) or from the database
const channelById = await overlay.getRepository(Channel).getById(id)

// Retrieve a Channel entity by a unique field value (`rewardAccount` in this case)
const channelByRewardAccount = await overlay.getRepository(Channel).getOneBy({ rewardAccount })

// Retrieve Video entities by Channel entity id (OneToMany relation):
const videosInChannel = await overlay.getRepository(Video).getManyByRelation('channelId', channelId)

// Retrieve a VideoMetadata by Video entity id (OneToOne relation):
const videoMetadata = await overlay.getRepository(VideoMetadata).getOneByRelation('videoId', videoId)

// Update an entity retrieved from the overlay
channelById.title = 'New title'
// That's it! You don't need to do anything else! This change will be later persisted to the database.

// Remove an entity from the overlay (and later from the database)
overlay.getRepository(Channel).remove(channelById)
```

It is important to understand that although the `overlay` will always provide access to the latest state, you may receive stale state if you try to query the database directly:
  
```typescript
overlay.getRepository(Channel).new({
  id,
  // ...
})

const em = overlay.getEm()
// THE CHANNEL ENTITY IS NOT YET INSERTED TO THE DATABASE AND WILL NOT BE FOUND!
const channel = await em.getRepository(Channel).findOneBy({ id })
```

You can force the overlay to persist all changes into the database by calling:
```typescript
await overlay.updateDatabase()
```
But this should generally be avoided in event handlers, as it may negate the performance benefits the overlay tries to provide in the first place.

### `MAX_CACHED_ENTITIES` environment variable

You can limit the number of entities that the overlay will store in memory by setting the `MAX_CACHED_ENTITIES` environment variable. Increasing this value too much may cause the processor to run out of memory or result in SQL errors due to queries being too large.
