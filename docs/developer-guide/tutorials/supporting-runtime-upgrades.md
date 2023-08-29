# Updating event handlers to support an incoming runtime upgrade

Each event handler has to support all versions of a given event.
If there is an incoming runtime upgrade and some existing event signature is going to change (for example, a new field will be added to `Members.MemberRemarked` event), you will need to:
- Update the `joystream.jsonl` file,
- Generate new types (`src/types/events.ts`) using `make typegen`,
- Adjust the event handler by adding support for the new version of the event.

Different versions of the same event are identified by the Joystream runtime spec version, which changes with each runtime upgrade.

## Existing example: `Members.MemberRemarked` event

Let's use the existing `Members.MemberRemarked` event as an example:
```typescript
export class MembersMemberRemarkedEvent {
    /* ... */

    get isV1000(): boolean {
        return this._chain.getEventHash('Members.MemberRemarked') === '455000da2c8f650044c433ea0fc69e39c5cb2db11e7a81e15e0fcba6f0757e16'
    }

    get asV1000(): [bigint, Uint8Array] {
        assert(this.isV1000)
        return this._chain.decodeEvent(this.event)
    }

    get isV2001(): boolean {
        return this._chain.getEventHash('Members.MemberRemarked') === '800e11437fa752c6c57a4245f54183c0c5c445b438324a6d5c2f2272b4bd0e2a'
    }

    get asV2001(): [bigint, Uint8Array, ([Uint8Array, bigint] | undefined)] {
        assert(this.isV2001)
        return this._chain.decodeEvent(this.event)
    }
}
```

As you can see, this particular event is currently supported in two versions: `V1000` and `V2001`.
You can use `isV1000` and `isV2001` getters to check the version of the event inside the event handler.
After you check the version, you can use `asV1000` and `asV2001` to decode the event data in a type-safe way.

**Important:** You should always check the version of the event before decoding it! If you try to decode an event using `asV1000` when the event is actually `V2001`, an error will be thrown!

- The `V1000` is version of the event at runtime spec version `1000`, which was the first spec version of the Joystream mainnet runtime. At the time, the event consisted of two fields: `memberId` (`bigint`) and `remark` (`Uint8Array`). **Important:** Note that since `1000` there was also a runtime upgrade to `1001`, but since the event signature didn't change at `1001`, `V1000` represents the event at both `1000` and `1001` spec versions.
- The `V2001` is version of the event at runtime spec version `2001`, which was the Ephesus runtime upgrade. At the time, a new field was introduced in the `Members.MemberRemarked` event: `Option<(AccountId, Balance)>` (decoded to `([Uint8Array, bigint] | undefined)`).

If you take a look at the current implementation of `Members.MemberRemarked` event handler, you will see that it supports both `V1000` and `V2001` versions of the event:
```typescript
export async function processMemberRemarkedEvent({
  /* ... */
  event,
}: EventHandlerContext<'Members.MemberRemarked'>) {
  const [memberId, message, payment] = event.isV2001 ? event.asV2001 : event.asV1000
  /* ... */
}
```

In this case, array destructuring works, because `payment` is an optional field and will always be `undefined` when the event version is `V1000`. However, in some cases you may need to separate the handler into multiple `if` statements with distinct logic for each version of the event.

## Possible future runtime upgrade scenario

Now let's imagine a scenario where the runtime is about to be upgraded to a spec version `3000` and the `Members.MemberRemarked` event signature is going to change again. To make things more complex, we won't be introducing a new field, but instead change the type of the existing `payment` field, so that the event signature will now look like this:
```
MemberRemarked(MemberId, Vec<u8>, Vec<(AccountId, Balance)>)
```

Where `Vec<(AccountId, Balance)>` will be a vector of payments, instead of a single optional payment.

In order to support this change in Orion, you will need to:
1. Update `joystream.jsonl` file.
    You can do that by running version `3000` of the Joystream runtime locally and then executing:
    ```bash
    npx squid-substrate-metadata-explorer --chain ws://localhost:9944 --output tmp.jsonl
    cat tmp.jsonl >> joystream.jsonl
    rm tmp.jsonl
    ```
    This will append the metadata associated with the new runtime spec version to the `joystream.jsonl` file.
2. Regenerate types using `make typegen`.
    This will update the `src/types/events.ts` file with the new class for `Members.MemberRemarked` event, including the new `isV3000` and `asV3000` getters.
3. Update `processMemberRemarkedEvent` event handler in `src/mappings/membership/index.ts`:
    ```typescript
    export async function processMemberRemarkedEvent({
        /* ... */
        event,
    }: EventHandlerContext<'Members.MemberRemarked'>) {
        if (event.isV1000 || event.isV2001) {
            const [memberId, message, payment] = event.isV2001 ? event.asV2001 : event.asV1000
            /* ... */
        }
        if (event.isV3000) {
            const [memberId, message, payments] = event.asV3000
            /* ... */
        }
    }
    ```

The processor should now be able to handle all three versions of the event.
**Important:** In case any other existing events were to change during a runtime upgrade to spec version `3000`, you would need to update their corresponding handlers in a similar way!
