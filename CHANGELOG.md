# 2.0.0

Orion v2 is a major architecture change compared to Orion v1:

- **No proxying to external Query Node:** Event processing is now part of Orion, the state is unified in a single database (PostgreSQL) instead of being spread between Joystream Query Node and Orion
- **[Subsquid](https://docs.subsquid.io/)** framework is now used for event processing and GraphQL api generation

For detailed overview of the new architecture, see the [developer guide](docs/developer-guide.md)

## External api changes

### Queries

- Significantly improved query speed should be observed in most cases.
- Generally reduced set of supported queries and queryable entity fields. Only queries for the entities based on `members`, `content` and `storage` Joystream modules, which are relevant to Atlas, are now supported by Orion.
- `Event` interface has been replaced with `EventData` union, as GraphQL interfaces are not supported in Subsquid. This affects the way `events` query works, as well as removes specific event queries (like `categoryCreatedEvents`, `videoReactedEvents` etc.)
- Deeply nested filtering (for example: `videos(where: { channel: { avatarPhoto: { storageBag: { storageBuckets_some: { id_eq: "1" } } } } })`) is now supported, as well as [nested field queries](https://docs.subsquid.io/query-squid/nested-field-queries/)
- New properties for `where` inputs of queries, like `filed_isNull`, `field_containsInsensitive`, `field_not_(eq|in|contains|containsInsensitive|endsWith|startsWith)`
- Some redundant relationships were removed (for example, entities that had relation to both `Video` and video's `Channel`, now may only have relation to a `Video`), which were previously required to workaround lack of deeply nested filtering.
- Entity fields like `nftOwnerMember`, `isNftOwnerChannel`, `nftOwnerCuratorGroup` have been relaplace with a single `NftOwner` union.
- `Channel.followsNum`, `Channel.videoViewsNum` and `Video.viewsNum` fields have been added and can now be used for filtering, sorting etc.
- `Channel.activeVideoCounter` and `VideoCategory.activeVideoCounter` fields have been removed, instead custom `extendedChannels` and `extendedVideoCategories` queries have been introduced, which allow retrieving the number of active videos per channel/category.
- `createdAt` and `updatedAt` fields are no longer automatically added to entities in Subsquid, so most of the entities no longer include them (unless they were explicitly required by Atlas).
- `Many-to-Many` entity relationships are not supported in Subsquid, so relationships like `StorageBag.distributionBuckets`, `StorageBag.storageBuckets` etc. were refactored to 2-side Many-to-One relationships with a specific "join entity". This means that some queries may now require one more level of nesting, for example: `{ storageBags { storageBuckets { id } } }` => `{ storageBags { storageBuckets { storageBucket { id } } } }`
- `{ entity { relatedEntityId } }` syntax is not supported in Subsquid, `{ entity { relatedEntity { id } } }` has to be used instead
- the type of entity `id` property is now `String` (previously `ID`)
- `entityByUniqueInput` queries are no longer supported. The new `entityById` queries can be used instead in some cases.
- `admin` query (kill switch) was renamed to `getKillSwitch`
- `categoryFeaturedVideos` and `allCategoriesFeaturedVideos` queries do not exist anymore. Instead, videos featured in a category can be accessed through `category.featuredVideos` relation
- `reportedVideos` and `reportedChannels` authorized queries are temporarily not supported
-  `mostViewedCategories` and `mostViewedCategoriesAllTime` queries have been removed (currently unused by Atalas)
- `discoverChannels` and `promisingChannels` queries has been removed in favor of a new more generic/reusable `mostRecentChannels` query (searching among X most recent channels)
- `popularChannels` query has been removed, as the same results can now be obtained with `channels`/`extendedChannels` query with `orderBy: videoViewsNum_DESC, limit: 15`
- `top10Channels` query has been removed as the same results can now be obtained with `channels`/`extendedChannels` query with `orderBy: followsNum_DESC, limit: 10`
- `mostViewedChannelsConnection` and `mostFollowedChannelsConnection` queries have been removed (currently unused by Atalas)
- `top10VideosThisWeek` and `top10VideosThisMonth` queries have been removed, as the same results can now be obtained with `mostViewedVideosConnection(limit: 10, where: $where, periodDays: (7|30), orderBy: createdAt_DESC)` query
- `search` query is temporarily not supported (unused by Atals)
- `channelNftCollectors` query now takes `channelId: String!` input instead of `where: ChannelNftCollectorsWhereInput`. `orderBy` variants have been reduced to `amount_ASC` and `amount_DESC`
- Censored channels and videos belonging to censored channels are now filtered-out from query results by default
- `VideoHero` entity includes additional fields (`video`, `activatedAt`)
- historical `VideoHero` snapshots can now be queried using autogenerated queries like `videoHeros`, `videoHeroById` etc.

### Subscriptions
- `stateSubscription` has been renamed to `processorState`, properties have been reduced to `lastProcessedBlock` and `chainHead`

### Mutations

#### User mutations

- `addVideoView`:
    - no longer requires `channelId` and `categoryId` as input
    - now only increases number of video views if the request is an unique request per ip-videoId pair in the last 24 hours (to prevent abuse). 
    - `added` boolean was added to mutation result to indicate whether a new view was added or not
- `followChannel`:
    - channel id is now returned in `channelId` field of the mutation result, instead of `id`, in order to distinguish between `channelId` and `followId`
    - `cancelToken` is now returned as part of the mutation result. This token has to be used when unfollowing the channel to prevent arbitrarly triggering `unfollow` when there is not matching channel follow on the client side.
    - only one follow is now counted per client ip to prevent abuse.
    - `added` boolean was added to mutation result to indicate whether a new follow was added or not (depending on whether a matching follow already existed for given ip-channleId pair)
- `unfollowChannel`
    - now additionally requires `token` as input (see `followChannel` changes)
    - `removed` boolean was added to mutation result to indicate whether the follow was removed or not (it is only removed if there is a matching follow per token-channelId pair)
- `reportChannel`/`reportVideo`:
    - now only one report can be sent from given ip for given channel/video to prevent abuse.
    - `created` boolean was added to mutation result to indicate whether a new report was created

#### Operator mutations

- All operator mutations now require `x-operator-secret` HTTP header to be provided, with value equal to `OPERATOR_SECRET` environment value. There is currently no distinction between secret used for content featuring and other operator activities.
- `setVideoHero`
    - the history of video heros' set is now persisted in the database and is publicly accessible,
    - mutation result now only includes the id of the created `VideoHero` entity
- `setCategoryFeaturedVideos`
    - the mutation result now only includes `categoryId` and number of featured videos set / unset 
- **New mutation:** `setSupportedCategories` - allows specifying which video categories are supported by the gateway. Content that doesn't belong to supported categories will not be displayed in query results. This includes the categories themselves, videos, nfts, auctions, comments, reactions etc.
