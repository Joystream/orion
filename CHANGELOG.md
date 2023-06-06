# 2.3.0

### Features:
- **Change:**  The video relevance score formula has been updated. Now `Video.publishedBeforeJoystream` can be taken into account when calculating the value of the `newness` parameter. The new formula for `newness` is:
    ```
    -(dsPOJ * jcw + dsPBJ * ycw) / (jcw + ycw)

    Where:
    dsPOJ - days since published on Joystream (Video.createdAt)
    jcw - joystream creation weight
    dsPBJ - days since published before Joystream (Video.publishedBeforeJoystream)
    ycw - YouTube creation weight
    ```

### Config values:
- **Change:** `RELEVANCE_WEIGHTS` config value now has a new format:
    ```diff
    [
        1, # newness weight,
        0.03, # views weight
        0.3, # comments weight
        0.5, # reactions weight
    +   [7,3] # [joystream creation weight, YouTube creation weight]
    ]
    ```
    If the value of `[joystream creation weight, YouTube creation weight]` is not provided, it is set to `[7,3]` by default.

### Schema/API changes:
- **Change:** `setVideoWeights` operator mutation now accepts 2 new arguments: `joysteamTimestampSubWeight` and `ytTimestampSubWeight`

### Mappings:
- `videoRelevanceManager` is now used in `processVideoCreatedEvent` to calculate `videoRelevance` (to avoid code duplication)

### DB Optimalizations:
- Changes in `postgres.conf` to improve query execution time in current production deployments:
    - Turn off JIT compilation which was usually uneffective
    - Lower `random_page_cost` to `1.0`, as the database still fits into the memory
    - Increase `shared_buffers` to `2GB` 
- New indexes added to `db/migrations/2100000000000-Indexes.js` (`auction_type`, `member_metadata_avatar`, `owned_nft_auction`)

### Fixes:
- `scripts/generate-schema-file.sh` has been made executable w/o bash to avoid error during docker build
- The issue w/ _Offchain State_ not being imported if the `export.json` contained empty `update` tables (an error was thrown in this case) has been fixed

# 2.2.0

### Features:
- New feature: Video relevance. Video relevance is a score calculated based on the age of the video (time since upload) and the number of views, comments and reactions it has. The weight of each of these factors can be configured through `VideoRelevanceWeights` config value (using the new `setVideoWeights` mutation). The relevance score is automatically recalculated for a video:
    - every hour,
    - in case its number of views increased and is now divisible by `VideoRelevanceViewsTick` config value,
    - in case its number of vidoe's reactions / comments has changed.

### Config values:
- New config value: `VideoRelevanceWeights` - used to configure the weights of the factors used to calculate video relevance score.
- New config value: `VideoRelevanceViewsTick` - used to configure the number of views after which the video relevance score should be recalculated.

### Schema/API changes:
- New field: `Video.videoRelevance` - video relevance score.
- New mutation: `setVideoWeights` - used to set the value of `VideoRelevanceWeights` config.
- New query: `topSellingChannels` - used to retrieve channels with highest nft sales volume in a given period of time.
- New query: `endingAuctionsNfts` - used to retrieve nfts that are on active english auction, ordered by the time left until the auction ends.
- Changes to `mostViewedVideosConnection` query:
    - `INNER JOIN` to `video_view_events` table is now used, which means videos with `0` views will no longer appear in the results;
    - in case both `periodDays` arg is provided and `viewsNum` is part of the `orderBy` clause, the videos are now ordered by the number of views in the specified period (not the number of views in general)
- Added integration w/ the new relevance score recalculation service in terms of recalculating scores on `addVideoView`, `setVideoReactions` and `excludeContent` mutations.

### Mappings:
- Added integration w/ the new relevance score recalculation service, responsible for recalculating the score for all videos every hour, as well as in case of the following events:
    - `ReactVideo` metaprotocol message,
    - `CreateComment` metaprotocol message,
    - `DeleteComment` metaprotocol message,
    - `ModerateComment` metaprotocol message,

### Other:
- Fixed docker build and added automatic `joystream/orion` docker image publishing to docker hub.
- Improved data migration process during deployment w/ the new `OffchainMigration` service, which can export and import database entities as well as individual field values. 


# 2.1.0 (Ephesus release)

### Schema/API changes:
- `cumulativeRewardClaimed` field has been added to `Channel`
- new `event.data` types are now supported:
    - `ChannelRewardClaimedEventData`
    - `ChannelRewardClaimedAndWithdrawnEventData`
    - `ChannelFundsWithdrawnEventData`
    - `ChannelPayoutsUpdatedEventData`
    - `ChannelPaymentMadeEventData`
- New `MetaprotocolTransactionResult` variant: `MetaprotocolTransactionResultChannelPaid`
- New `DataObjectType` variant: `DataObjectTypeChannelPayoutsPayload`

### Mappings:
- Added support for handling both pre and post-Ephesus version of the following events updated in Ephesus:
    - `Members.MemberInvited`
    - `Members.MemberRemarked`
- New mappings for the following events:
    - `Content.ChannelPayoutsUpdated`
    - `Content.ChannelRewardUpdated`
    - `Content.ChannelRewardClaimedAndWithdrawn`
    - `Content.ChannelFundsWithdrawn`
- Support for new `MemberRemark` metaprotocol transaction type: `makeChannelPayment` (direct channel payment) 

### Bug fixes:
- Fixed: Events that had a relationship to an auction bid through `data->>'winningBid'` were not properly hidden when the bid was excluded from the visible data thorugh `excludeContent` functionality. This was causing errors such as `Cannot return null for non-nullable field OpenAuctionBidAcceptedEventData.winningBid` when querying for `OpenAuctionBidAcceptedEventData` events.

# 2.0.0

Orion v2 is a major architecture change compared to Orion v1:

- **No proxying to external Query Node:** Event processing is now part of Orion, the state is unified in a single database (PostgreSQL) instead of being spread between Joystream Query Node and Orion.
- **[Subsquid](https://docs.subsquid.io/)** framework is now used for event processing and GraphQL api generation.

For detailed overview of the new architecture, see the [developer guide](docs/developer-guide.md)

## External api changes

### Queries

- Significantly improved query speed should be observed in most cases (the average query should be 2x faster in Orion v2, see [the latest benchmarking results](https://github.com/Joystream/orion/issues/77#issuecomment-1440447170))

#### Changes:
- Generally reduced set of supported queries and queryable entity fields. Only queries for the entities based on `members`, `content` and `storage` Joystream modules, which are relevant to Atlas, are now supported by Orion. Additionally, fields like `ownerCuratorGroup`, channel's `collaborators` etc., which are not yet supported by Atlas are also not yet supported in Orion v2.
- `Event` interface has been replaced with `EventData` union, as GraphQL interfaces are not supported in Subsquid. This affects the way `events` query works, as well as removes specific event queries (like `categoryCreatedEvents`, `videoReactedEvents` etc.)
- Some redundant relationships were removed (for example, entities that had relation to both `Video` and video's `Channel`, now may only have relation to a `Video`. Similarly, entities that contained `ownerMember`/`ownerCuratorGroup` fields, but also had a relation to `Channel`, no longer include redundant channel ownership information), which were previously required to workaround lack of deeply nested filtering. For the same reason, other relations were replaced with more specific ones (for exmaple `auction` instead of `video`). Some examples of this include:
    - Auction bid canceled event has a relation to `bid` instead of `video`,
    - Auction bid made event no longer has `bidAmount`, `previousTopBid` and `previousTopBidder`. They can all be derived from the related `bid` instead,
    - Auction canceled event has a relation to `auction` instead of `video`,
    - Event with `winningBid` field no longer contian relations like `video` or `winner`, as they can be derived from `winningBid`,
    - Most of other nft-related events now have a relation to `nft` instead of `video`.
- NFT's `transactionalStatus` and `transactionalStatusAuction` is now represented as a single `transactionalStatus` which includes `TransactionalStatusAuction` as one of the variants.
- Entity fields like `nftOwnerMember`, `isNftOwnerChannel`, `nftOwnerCuratorGroup` have been relaplaced with a single `NftOwner` union.
- `Channel.followsNum`, `Channel.videoViewsNum` and `Video.viewsNum` fields have been added and can now be used for filtering, sorting etc. (in Orion v1 fields like `Channel.follows`, `Channel.views` and `Video.views` also existed, but had limited functionality)
- Some small differences in the representation of empty values:
    - `Auction.buyNowPrice`: `0` => `null`
    - `Comment.reactionsCountByReactionId`: `[]` => `null`
    - `DistributionBucketFamilyMetadata.areas`: `[]` => `null`
    - `VideoCategory.description`: `''` => `null`
- Some small differences in types:
    - `StorageBag.owner.channelId`: `number` => `string`
- `DistributionBucketFamilyMetadata.areas` is now a `jsonb` field, so it was possible to skip one level of nesting:
    - `DistributionBucketFamilyMetadata.areas.area` => `DistributionBucketFamilyMetadata.areas`
- Some fileds were renamed:
    - `Event.createdAt` => `Event.timestamp`
    - `*Event.contentActor` => `*EventData.actor`
    - `NftBoughtEvent.member` => `NftBoughtEventData.buyer`
    - `Membership.memberBannedFromChannels` => `Membership.bannedFromChannels`
- Some entity ids are not backward-compatible:
    - `DistributionBucketFamilyMetadata`
    - `StorageBucketOperatorMetadata`
    - `DistributionBucketOperatorMetadata`
    - `MemberMetadata`
    - `Event`
- Some entities no longer have ids, as are now stored as `jsonb` objects in the parent table:
    - `GeoCoordinates`
    - `NodeLocationMetadata`
    - `DistributionBucketFamilyGeographicArea`
    - `CommentReactionsCountByReactionId`
    - `VideoReactionsCountByReactionType`
- In Orion v1 providing a non-existing category id resulted in a creation of empty video category (without any `name` or `description`). Such categories are no longer created, providing non-existing category as part of `ContentMetadata` results in setting `Video.category` to `null` instead.
- `Channel.activeVideoCounter` and `VideoCategory.activeVideoCounter` fields have been removed, instead custom `extendedChannels` and `extendedVideoCategories` queries have been introduced, which allow retrieving the number of active videos per channel/category.
- `createdAt` and `updatedAt` fields are no longer automatically added to entities in Subsquid, so most of the entities no longer include them (unless they were explicitly required by Atlas).
- `Many-to-Many` entity relationships are not supported in Subsquid, so those relationships were refactored to 2-side Many-to-One relationships with a specific "join entity". This means that some queries may now require one more level of nesting, ie.:
    - `Channel.bannedMembers.id` => `Channel.bannedMembers.member.id`
    - `Auction.whitelistedMembers.id` => `Auction.whitelistedMembers.member.id`
    - `Membership.whitelistedInAuctions.id` => `Membership.whitelistedInAuctions.auction.id`
    - `StorageBucket.bags.id` => `StorageBucket.bags.bag.id`
    - `DistributionBucket.bags.id` => `DistributionBucket.bags.bag.id`
    - `StorageBag.storageBuckets.id` => `StorageBag.storageBuckets.storageBucket.id`
    - `StorageBag.distributionBuckets.id` => `StorageBag.distributionBuckets.distributionBucket.id`
- `Language` entity has been removed. Language is now represented as a simple ISO code `string`.
- `DataTime` format is slightly different:
    - `2022-01-01T00:00:00.000Z` => `2022-01-01T00:00:00.000000Z`
- `{ entity { relatedEntityId } }` syntax is not supported in Subsquid, `{ entity { relatedEntity { id } } }` has to be used instead
- the type of entity `id` property is now `String` (previously `ID`)
- `entityByUniqueInput` queries are no longer supported. The new `entityById` queries can be used instead in some cases.
- `admin` query (kill switch) was renamed to `getKillSwitch`
- `categoryFeaturedVideos` and `allCategoriesFeaturedVideos` queries do not exist anymore. Instead, videos featured in a category can be accessed through `category.featuredVideos` relation
-  `mostViewedCategories` and `mostViewedCategoriesAllTime` queries have been removed (currently unused by Atalas)
- `discoverChannels` and `promisingChannels` queries has been removed in favor of a new more generic/reusable `mostRecentChannels` query (searching among X most recent channels)
- `popularChannels` query has been removed, as the same results can now be obtained with `channels`/`extendedChannels` query with `orderBy: videoViewsNum_DESC, limit: 15`
- `top10Channels` query has been removed as the same results can now be obtained with `channels`/`extendedChannels` query with `orderBy: followsNum_DESC, limit: 10`
- `mostViewedChannelsConnection` and `mostFollowedChannelsConnection` queries have been removed (currently unused by Atalas)
- `top10VideosThisWeek` and `top10VideosThisMonth` queries have been removed, as the same results can now be obtained with `mostViewedVideosConnection(limit: 10, where: $where, periodDays: (7|30), orderBy: createdAt_DESC)` query
- `search` query is temporarily not supported (unused by Atals)
- `channelNftCollectors` query now takes `channelId: String!` input instead of `where: ChannelNftCollectorsWhereInput`. `orderBy` variants have been reduced to `amount_ASC` and `amount_DESC`
- `ChannelFundsWithdrawnEventData.account` as well as `ChannelRewardClaimedAndWithdrawnEventData.account` are now `null` in case the funds destination was `Council` and account address otherwise (periously this field contained a json string representing the serialized `ChannelFundsDestination` enum)
- Event ids are now assigned sequentially (`00000001`, `00000002`, `00000003` etc.) instead of being `{blockNumber}-{indexInBlock}`. Because all events now live in the same database table, `{blockNumber}-{indexInBlock}` would no longer be a unique identifier when dealing with metaprotocol events (as there can be multiple metaprotocol events triggered by the same runtime event)
- `MetaprotocolTransactionStatus` has been renamed to `MetaprotocolTransactionResult` and now also includes variants that have been previously represented by optional fields of `MetaprotocolTransactionSuccessful` (`MetaprotocolTransactionResultCommentCreated`, `MetaprotocolTransactionResultCommentEdited` etc.). To check if the transaction was generally successful you can now use `event.result.isTypeOf !== 'MetaprotocolTransactionResultFailed'`
- `MetaprotocolTransactionErrored` variant has been replaced with `MetaprotocolTransactionResultFailed` and may include slightly different error messages. The error messages should be completely removed and replaced with error codes in the future.
- The default limit for number of returned rows when no limit was provided in Orion v1 was `50`. In Orion v2 there is no default limit(!)

#### New query features
- _(Subsquid)_ Deeply nested filtering (for example: `videos(where: { channel: { avatarPhoto: { storageBag: { storageBuckets_some: { id_eq: "1" } } } } })`) is now supported, as well as [nested field queries](https://docs.subsquid.io/query-squid/nested-field-queries/)
- _(Subsquid)_ There are a few new properties for `where` inputs of queries, like `filed_isNull`, `field_containsInsensitive`, `field_not_(eq|in|contains|containsInsensitive|endsWith|startsWith)`
- It is now possible to query the `resolvedUrls` property of any `StorageDataObject` (for example: `{ videoById(id: "1") { media { resolvedUrls } } }`). The Orion v2 GraphQL server will then resolve it to a list of available asset urls, based on its internal distributor nodes data cache. If you provide `x-client-loc` header, Orion v2 will additionally prioritize distributor nodes closest to the provided location when resolving the url. The value for `x-client-loc` should be provided in `lat,lon` format, where `lat` is the `latitude` (-90, 90) and `lon` is the `longitude` (-180, 180), for example: `x-client-loc: 42.557127,-103.886719`. You can also provide `x-asset-urls-limit` to specify the maximum number of urls to return per asset (by default all available urls will be returned).
- Censored channels and videos belonging to censored channels, as well as channels/videos excluded by the gateway operator via `excludeContent` mutation are now filtered-out from all query results by default. The same applies to videos belonging to categories not supported by the gateway (see: `setSupportedCategories` [operator mutation](#operator-mutations) and [operator queries](#operator-queries) for more details)
- Video comments can also be excluded by the gateway operator via `excludeContent` mutation, but they are not filtered out from the query results in that case. Instead, their `text` is hidden and they can be identified by having `isExcluded` property set to `true`.
- Entities like `VideoViewEvent`, `Report` and `ChannelFollow` are now part of the Subsquid GraphQL input schema / PostgreSQL database schema. In Orion v1 similar entities were stored in a local MongoDB database and some of them were exposed for the gateway operator via authorized queries like `reportedChannels`, `reportedVideos`. In Orion v2 the api includes autogenerated queries like `videoViewEvents`, `videoViewEventsConnection`, `reports`, `reportsConnection`, `channelFollows`, `channelFollowsConnection` etc. with all the features provided by Subsquid's Openreader. However, just like in Orion v1, this data is also hidden from the public view as it includes sensitive information like IP addresses of the users. Only the Gateway operator is able to query this hidden data (see [operator queries](#operator-queries) for more details).
- `VideoHero` entity includes additional fields (`video`, `activatedAt`)
- Featured nfts: `OwnedNft`s now have `isFeatured` property can be set by the Gateway operator.

#### New queries
- `getVideoViewPerIpTimeLimit`: allows retrieving the current value of `VideoViewPerIpTimeLimit` config value (see also: `setVideoViewPerIpTimeLimit` under [operator mutations](#operator-mutations))
- In order to optimize Atlas queries that do complex filtering of `Event` entities, like `GetNotifications`, `GetNftHistory` and `GetNftActivities`, a few new entities were introduced which include a reltionship to `Event` (this was not possible in Orion v1, as there wasn't a single `Event` entity). The new entities (and associated queries) are: `Notification` (`notifications`, `notificationsConnection`), `NftHistoryEntry` (`nftHistoryEntries`, `nftHistoryEntriesConnection`) and `NftActivity` (`nftActivities`, `nftActivitiesConnection`).
- historical `VideoHero` snapshots can now be queried using new autogenerated queries like `videoHeros`, `videoHeroById` etc.

#### Bug fixes
- `Auction.topBid` can no longer be a canceled bid (this was previously possible in `OpenAuction`). In case the top bid gets canceled, the next best bid is set as `Auction.topBid`. In case there is no next best bid, `Auction.topBid` is set to `null`.
- In Orion v1 (Query Node), when a member placed a bid in `OpenAuction`, it was possible for their bid in an old, already finalized auction for the same nft to get canceled (even if it was already a winning bid). Now this will no longer happen.
- `Video.pinnedComment` relation was incorrectly declared in Orion v1 (Query Node) input schema, which resulted in some comments, which were never actually pinned, being returned as `Video.pinnedComment`. This should no longer happen in Orion v2.
- In Orion v1 (Query Node) sometimes the `createdAt` field of an entity (like `Memberships`) would be incorrectly modified on update. This will no longer happen in Orion v2, as fields like `createdAt` need to be added explicitly in Subsquid and are no longer automatically managed.
- Using property aliases was not working in Orion v1 (for example: `channels { channelId: id }`), this is no longer an issue in Orion v2. 
- `OwnedNft.creatorRoyalty` was incorrectly calculated in Orion v1 (rounded down to nearest integer), this has been fixed in Orion v2, so that now `creatorRoyalty` can have non-integer value (like `0.5`).

### Operator queries

- An authorized operator, who provided a valid `x-operator-secret` HTTP header, can see any entities hidden from the public view in the query results (unless explicitly filtered out by the query `where` conditions or otherwise). Those include:
    - Censored (by the DAO) channels & videos and their related entities (nfts, auctions, comments, reactions, metadata entities etc.),
    - Excluded (censored by the Gateway) channels, videos and their related entities (nfts, auctions, reactions, metadata entities etc.),
    - Any content not belonging to a category currently supported by the Gateway,
    - Other entities hidden from public view for security reasons:
        - `VideoViewEvent`s,
        - `Report`s,
        - `ChannelFollow`s,
        - `NftFeaturingRequest`s.

### Subscriptions
- `stateSubscription` has been renamed to `processorState`, properties have been reduced to just `lastProcessedBlock`

### User Mutations

#### Changes
- `addVideoView`:
    - no longer requires `channelId` and `categoryId` as input
    - now only increases number of video views if the request is a unique request per ip-videoId pair in the last `Config.VideoViewPerIpTimeLimit` seconds (to prevent abuse). This limit can be set via environment variable or through `setVideoViewPerIpTimeLimit` operator mutation.
    - `added` boolean was added to mutation result to indicate whether a new view was added or not
- `followChannel`:
    - channel id is now returned in `channelId` field of the mutation result, instead of `id`
    - `cancelToken` is now returned as part of the mutation result. This token has to be used when unfollowing the channel to prevent arbitrarly triggering `unfollow` when there is not matching channel follow on the client side.
    - only one follow is now counted per client ip to prevent abuse.
    - `added` boolean was added to mutation result to indicate whether a new follow was added or not (depending on whether a matching follow already existed for given ip-channleId pair)
- `unfollowChannel`
    - now additionally requires `token` as input (see `followChannel` changes)
    - `removed` boolean was added to mutation result to indicate whether the follow was removed or not (it is only removed if there is a matching follow per token-channelId pair)
- `reportChannel`/`reportVideo`:
    - now only one report can be sent from given ip for given channel/video to prevent abuse.
    - `created` boolean was added to mutation result to indicate whether a new report was created

#### New mutations:
- `requestNftFeatured` - allows users to make a request for a given nft to be featured by the Gateway. Operator can then read those requests using the new queries like `nftFeaturingRequests`. Functionally this feature is similar to `reportChannel`/`reportVideo`.

### Operator mutations

#### Changes
- All operator mutations now require `x-operator-secret` HTTP header to be provided, with value equal to `OPERATOR_SECRET` environment value. There is currently no distinction between secret used for content featuring and other operator activities.
- `setVideoHero`
    - the history of video heros' set is now persisted in the database and is publicly accessible,
    - mutation result now only includes the id of the created `VideoHero` entity
- `setCategoryFeaturedVideos`
    - the mutation result now only includes `categoryId` and number of featured videos set / unset

#### New mutations
- `setSupportedCategories` - allows specifying which video categories are supported by the gateway. Content that doesn't belong to supported categories will not be displayed in query results. This includes the categories themselves, videos, nfts, auctions, comments, reactions etc.
- `setVideoViewPerIpTimeLimit` - allows specifying the time after which a video view triggered from the same ip address will be counted again (see: `addVideoView`)
- `excludeContent` - allows excluding specified channels/videos/comments from all query results. Can be used as a gateway-level mechanism to censor some of the content. Comments are the only entities that don't get completely filtered-out from query results when excluded. Instead, their `text` becomes hidden and `isExcluded` property is set to `true`.
- `restoreContent` - effectively the opposite of `excludeContent`, can be used to make content appear in the query results again (if previously excluded).
- `setFeaturedNfts` - allows the operator to provide the list of nfts (ids) that are currently featured by the Gateway. This will affect the `isFeatured` propety of the `OwnedNft` entity.