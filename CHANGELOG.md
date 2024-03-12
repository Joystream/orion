# 3.7.0

## Schema changes
- Added `isShortDerived` field to `Video` entity indicating whether a video is a short format, vertical video or not. This field is computed in the mappings based on the video dimensions and duration when `isShort` is not set in the metadata.

## Misc

- update `setOrionLanguage` Custom migration script.

## Bug Fixes:
- Added fix to improve the accuracy of `Video.orionLanguage` field by reworking the `predictVideoLanguage` function in `src/utils/language.ts`
- Use UTC midnight epoch instead of current epoch to calculate video relevance score in `VideoRelevanceManager`


# 3.6.0

## Schema changes
- Added `includeInHomeFeed` field to `Video` entity indicating if the video should be included in the home feed/page.

## Mutations
### Additions
- `setOrUnsetPublicFeedVideos`: mutation to set or unset the `includeInHomeFeed` field of a video by the Operator. 

### Queries
#### Additions
- `dumbPublicFeedVideos`: resolver to retrieve random `N` videos from list of all homepage videos.

## DB Migrations
- Added partial index on `Video` entity to include only videos that are included in the home feed (in `db/migrations/2200000000000-Indexes.js`)

# 3.5.0

## Schema changes
- Added `isShort` field to `Video` entity indicating whether a video is a short format, vertical video or not.

## Misc
- Disable both in App and email notifications for `videoPosted` notifiations type by default.
- Remove unused `@joystream/metadata-protobuf` patch from assets/patches directory.

# 3.4.0

## Schema changes
- Added `@schema(name: "admin")` directive to hide entities (from public GRAPHQL API) in Graphql schema definitions.

## Misc
- Patch `@subsquid/typeorm-config` & `@subsquid/typeorm-migration` packages to change `squid-typeorm-migration apply` command to apply a single migrations file too using `--filename` option instead of applying the whole `db/migrations` directory.
- Patch `@subsquid/openreader` and `@subsquid/typeorm-codegen` dependencies to include the db schema `name` too in the generated typeorm/postgres migrations, and an optional `schema` directive to specify the schema of any GRAPHQL entity.

## DB Migrations
- Update `generate-migrations` makefile command. Now the existing `*-Data.js` will not be overwritten, instead a new `*-Data.js` migration file (containing only changes compared to the previous DB state) will be added whenever there are GRAPHQL schema changes. The `*-Views.js` migration file will also be updated whenever the GRAPHQL schema changes.
- Create `generateViewsMigration.js` script to create new `*-Views.js` migration file.
- Separate the view definitions(in `db/viewDefinitions.js`) from views migration file(`*-Views.js`).
- Add `*-Admin.js` migration file to create an `admin` schema & user, previously the `admin` schema and user was being created in the `*-Views.js` migration.
- Regenerate the postgres db migrations.

## Documentation
- Updated documentation for [upgrading-orion.md](docs/operator-guide/tutorials/upgrading-orion.md)
- Updated documentation for [entity-visibility.md#managing-entity-visibility](docs/developer-guide/tutorials/entity-visibility.md)

### Bug Fixes:
- read/write `export.json` file, containing the offchain state, using `big-json` package, instead using Javascript native `JSON.stringify` function which does not work on large JSON objects

# 3.3.0

## Schema
- `orionLanguage` property has been added.

## Mappings 
- Language detection is used to populate new property on video update and creation.

# 3.2.1

## Misc
- Added index on timestamp fields on `Video`, `Event` and `OwnedNft` entities
- update `docker.yml` github workflow to build and publish docker images.
- added `generate-migrations` makefile command to generate migrations
- adds OpenTelemetry tracing integration with `graphql-server` and `auth-server`
- update nodejs version to `node:18`

### Bug Fixes:
- Extend session based on activity after initial expiry is over.
- Fix/notification email title.
- Improves off-chain import/export script

# 3.2.0
This release adds notifications to the orion infrastructure...
## Schema changes
- Introduced `NotificationEmailDelivery` entity to handle email notifications. It includes fields for tracking the notification, delivery attempts, and a discard flag.
- Added `EmailDeliveryAttempt` entity to track each delivery attempt. It includes a status and timestamp.
- Created `DeliveryStatus` union type that can be either `EmailSuccess` or `EmailFailure` (which includes an error status).
- Introduced `Read` and `Unread` types to track if a notification has been read. Both are part of the `ReadOrUnread` union.
- Started defining a `Notification` entity. It includes fields for the account, notification type, event, status, in-app visibility, creation timestamp, and recipient.
- Defined RecipientType as a union of `MemberRecipient` and `ChannelRecipient`.
- Introduced various notification types as part of the NotificationType union. Each type has specific fields relevant to the notification.
- Added `ChannelSuspended, NftFeaturedOnMarketPlace, ChannelVerified, ChannelExcluded, VideoExcluded, NewChannelFollower, CommentPostedToVideo, VideoLiked, VideoDisliked, NftPurchased, CreatorReceivesAuctionBid, NftOffered, DirectChannelPaymentByMember, EnglishAuctionSettled, ChannelFundsWithdrawn, ChannelCreated, CommentReply, ReactionToComment, VideoPosted, NewAuction, NewNftOnSale, HigherBidPlaced, AuctionWon, AuctionLost, BidMadeCompletingAuction, NftRoyaltyPaid` types. Each type includes fields relevant to the specific notification.
- Introduced `AccountNotificationPreferences` type to handle user notification preferences.
- Added fields for each notification type, each of which is of `NotificationPreference` type.
- Channel notifications include: `channelExcludedFromApp, videoExcludedFromApp, nftFeaturedOnMarketPlace, newChannelFollower, videoCommentCreated, videoLiked, videoDisliked, yppChannelVerified, yppSignupSuccessful, yppChannelSuspended, nftBought, creatorTimedAuctionExpired, bidMadeOnNft, royaltyReceived, channelPaymentReceived, channelReceivedFundsFromWg, newPayoutUpdatedByCouncil, channelFundsWithdrawn`.
Member notifications include: `channelCreated, replyToComment, reactionToComment, videoPosted, newNftOnAuction, newNftOnSale, timedAuctionExpired, higherBidThanYoursMade, auctionWon, auctionLost, openAuctionBidCanBeWithdrawn, fundsFromCouncilReceived, fundsToExternalWalletSent, fundsFromWgReceived`.
- Introduced `ChannelYppStatus` as a union type in the GraphQL schema. This type represents the YouTube Partner Program (YPP) status of a channel.
The ChannelYppStatus can be one of three types: `YppUnverified, YppVerified, YppSuspended`.
## Resolvers 
- Ypp status mutation resolvers have been introduced, intended for the Ypp verification ops team:
    - Added `verifyChannel` mutation is protected by the `OperatorOnly` middleware, meaning it can only be accessed by operators returning a list of `VerifyChannelResults` (each contaning the `id` of the new suspension, the `channelId` of the suspended channel, and the `createdAt` timestamp of when the suspension was created)
    - Added `excludeChannel` mutation (protected by the `OperatorOnly` middleware) to the GraphQL schema. This mutation is used to exclude a channel. It takes channelId and rationale as arguments and returns an `ExcludeChannelResult` (contaning the `id` of the new suspension, the `channelId` of the suspended channel, and the `createdAt` timestamp of when the suspension was created)
    - Added `suspendChannels` mutation (protected by the `OperatorOnly` middleware) to the GraphQL schema. This mutation is used to suspend. It takes `channelIds` as an argument and returns a list of `SuspendChannelResult` (each contaning the `id` of the new suspension, the `channelId` of the suspended channel, and the `createdAt` timestamp of when the suspension was created)
- Notification-related resolvers (accessible only through the `AccountOnly` middleware) are intened for the use with the front end app:
    - Added `markNotificationsAsRead` mutation. This mutation marks specified notifications as read. It takes an array of `notificationIds` and returns an object with an array of IDs of notifications that were successfully marked as read.
    - Added `setAccountNotificationPreferences` mutation. This mutation updates the notification preferences for the current account. It takes an object of `newPreferences` and returns the updated notification preferences.
    - Both mutations are protected by the `AccountOnly` middleware, meaning they can only be accessed by authenticated accounts.
    - Added a helper function `maybeUpdateNotificationPreference` to update individual notification preferences if a new value is provided. This function is used in the `setAccountNotificationPreferences` mutation to update each preference.
- Notification email attepmts and assets
    - Added `setMaxAttemptsOnMailDelivery` mutation. This mutation sets the maximum number of attempts to deliver an email notification. It takes `newMaxAttempts` as an argument and returns the new maximum attempts. The mutation is protected by the `OperatorOnly` middleware.
    - Introduced `setNewNotificationCenterPath` mutation. This mutation sets the new notification center path. It takes `newMaxAttempts` as an argument and returns the new maximum attempts. The mutation is protected by the `OperatorOnly` middleware.
    - Added `setNewAppRootDomain` mutation. This mutation sets the new application root domain. It takes `newRootDomain` as an argument and returns an object indicating whether the new root domain was applied. The mutation is protected by the `OperatorOnly` middleware.
## Mail Scheduler module
- mail template generation using mjml (see `./src/auth-server/emails/templates/mjml/notification.html.mst.mjml`)
- Introduced functions to handle email notifications.
- Added `getMaxAttempts` function to fetch the maximum number of email delivery attempts from the configuration.
- Added `mailsToDeliver` function to fetch all email notifications that have not been discarded.
- Added `deliverEmails` function to process each email notification. It creates the email content, executes the delivery, and records the attempt. If the delivery is successful or the maximum number of attempts has been reached, the notification is discarded.
- The `deliverEmails` function is called in the `main` function, which logs the result of the email delivery process.
- The email delivery is meant (for the moment) to be scheduled via chron job (as explained on operator documentation)
## Misc
- several unit test have been introduced along with CI checks
- Improved Home page scoring schedule logic
- Refactored migration logic in order to migrate global account counter, which will be used also to migrate Notifications counters in future releases
## Environment
- Added `EMAIL_NOTIFICATION_DELIVERY_MAX_ATTEMPTS` environment variable to configure the maximum number of attempts to deliver an email notification, before the scheduler stops attending them
- Introduced `APP_ASSET_STORAGE` environment variable to specify the URL where the application's assets are stored.
- Added `APP_NAME_ALT` environment variable to set an alternative name for the application.
- Introduced `NOTIFICATION_ASSET_ROOT` environment variable to specify the URL where the notification icons are stored.
## Documentation
- added documentation for setting up the email scheduler having a [Sendgrid](https://sendgrid.com) account

# 3.1.0

### Entities
- Adds `User.permission` to the `User` entity, this however doesn't require migration logic.
- Adds `Channel.channelWeights` in order to boost channel relevance. This value can be set via the `setChannelWeights` mutation
### Resolvers
- Adds supports for new permissions model for gateway operator users. Now the root user can assign/revoke operator permission/s to users using `grantPermissions` & `revokePermissions` mutations
- Adds new `setChannelWeights` operator mutation to set weight/bias for any channel/s which will be used to calculate the Atlas homepage video relevance scores
### Performance
- Adds `Video.createdAt` as index in order to speed up Atlas home page queries 

# 3.0.4

### Misc
- sum channels rewards into a new `Channel.cumulativeReward` field
- start `Channel.cumulativeRewardClaimed` at zero instead of null

# 3.0.3
### Optimisation:
- Solves n+1 query issue on the `AssetResolver` `resolvedUrls` field resolver, by reusing `storageBagId` field if available. Resulting in faster query times and inpacting home page loading speed for front end application significantly. This fix involves only the `orion_graphql-server` microservice
### Misc
- adds `http://localhost:3000` and `http://127.0.0.1:3000` as authorized CORS origins for local front end testing 
# 3.0.2
### Bug Fixes:
- Store membership handles both as utf-8 string and raw bytes - [#4950](https://github.com/Joystream/joystream/pull/4950)
# 3.0.1
### Misc
- add migration for the `Account` id field
- exposes the grahql api to any unauthentcate user
- adds an index to the `videoRelevance` field for the `Video` entity, used when loading the home page by gateways

### Bug Fixes:
Fixed: Added the locking mechanism to prevent multiple asynchronous operation from having concurrent access to Overlay (Orion processor's in-memory cache layer), which otherwise could lead to one asynchronous operation overriding the changes made (to the cache) by the other asynchronous operation. 

# 3.0.0
This is a major release that will contains several breaking changes due to the 
introduction of the user account feature. Throught this release changelog the term
"registered account","account", "gateway account" will be used interchangeably in order
to denote a user that has registered its credential using the provided feature

### Architecture
The most prominent introduction is the new authentication api, which can be run as a docker service 

#### Authentication Api
A new authentication api in order to authenticate accounts has been introduced, based on the open-api specification
The `docs/developer-guide/tutorials/authentication-api.md` has a detailed description about this, I will just list
the routes provided by the api:

Version 1.0.0 

- Added new routes:
  - `/anonymous-auth`: Authenticate as an anonymous user, either using an existing user identifier or creating a new one.
  - `/login`: Login to a user's account by providing a message signed by the associated blockchain account.
  - `/artifacts`: Get wallet seed encryption artifacts.
  - `/session-artifacts`: Get and save wallet seed encryption artifacts for the current session.
  - `/account`: Create a new Gateway account. Requires anonymous authentication to be performed first.
  - `/confirm-email`: Confirm the account's email address provided during registration.
  - `/request-email-confirmation-token`: Request a token to be sent to the account's email address for email confirmation.
  - `/change-account`: Change the blockchain (Joystream) account associated with the Gateway account.
  - `/logout`: Terminate the current session.

- Implemented new methods:
  - `POST /anonymous-auth`: Perform anonymous authentication.
  - `POST /login`: Perform user login.
  - `GET /artifacts`: Retrieve wallet seed encryption artifacts.
  - `GET /session-artifacts`: Retrieve wallet seed encryption artifacts for the current session.
  - `POST /session-artifacts`: Save wallet seed encryption artifacts for the current session on the server.
  - `POST /account`: Create a new Gateway account.
  - `POST /confirm-email`: Confirm the account's email address.
  - `POST /request-email-confirmation-token`: Request a token for email confirmation.
  - `POST /change-account`: Change the blockchain (Joystream) account associated with the Gateway account.
  - `POST /logout`: Terminate the current session.

- Deprecated routes/methods:
  - None.

- Added comprehensive documentation for easy integration and usage inside `src/auth-api/docs`
- Added `src/auth-api/email` folder used for html template emails. Currently only registration email for a new gateway account is supported, 
but more email type will be supported in future releases

Note: For more detailed information about each route and method, please refer to the API documentation, inside `src/auth-api/docs`



#### Config Variables changes
- Orion archive `WS_SOURCE` default value has been changed to the public endpoint `wss://rpc.joystream.org:9944`
(before was pointing to the local host deployment at port `9944`)
- `ORION_ENV`: variables has been introduced to specify between `development` and `production` stages
- `DEV_DISABLE_SAME_SITE`: disables the "SameSite" attribute for cookies is used to control how cookies are sent in cross-site requests, when `ORION_DEV` is set to `development`
- `PROCESSOR_HOST` variable has been removed
- `DB_ADMIN_USER` and `DB_ADMIN_PASS` in order to create the `admin` user that has access to the `admin` schema
- `AUTH_API_PORT` for specifying port for the authentication api
- `APP_NAME`: Gateway name, it will be used in the email sent to the account owners.
- `VIDEO_VIEW_PER_IP_TIME_LIMIT` replaced by `VIDEO_VIEW_PER_USER_TIME_LIMIT`
- `SESSION_EXPIRY_AFTER_INACTIVITY_MINUTES` how much a session should last for an inactive user
- `SESSION_MAX_DURATION_HOURS` max session duration in hours
- `EMAIL_CONFIRMATION_ROUTE` api route for email confirmation
- `EMAIL_CONFIRMATION_TOKEN_EXPIRY_HOURS`: how many hours does a confirmation token lasts 
- EMAIL_CONFIRMATION_TOKEN_RATE_LIMIT`: how many requests for a new e-mail confirmation token can be made within
 `EMAIL_CONFIRMATION_TOKEN_EXPIRY_TIME_HOURS` for a given e-mail address
- `ACCOUNT_OWNERSHIP_PROOF_EXPIRY_TIME_SECONDS`
- `COOKIE_SECRET`: secret used to sign cookies, to make sure they come from Orion and have not been tampered with
- `TRUSTED_REVERSE_PROXY` variable has been superseeded by `TRUST_PROXY`
- `OPEN_API_PLAYGROUND` whether or not have a openapi playground on localhost
- `SENDGRID_API_KEY` API key from sendgrid, used for sending email to the gateway account owners (for the purpose of
email confirmation only at the moment)
- `OPERATOR_SECRET`: string used as identifier for the root user. Despite not being a new addition to the release now it is 
being stored in the database and it gives access to the hidden entities and `OperatorOnly` queries/mutations

#### Makefile
- A new rule for spinning up the auth api has been added as `make serve-auth-api`
- A new `joystream.jsonl` has been added. This file contains the metadata necessary for generating correct events with respective 
appropriate version numbers from the metadata via the `make typegen` command

### Entities
#### Changes
- `VideoViewEvent.ip: String` replaced by `VideoViewEvent.user: User` 
- `NftFeaturingRequest.ip: String` replaced by `NftFeaturingRequest.user: User` 
- `ChannelFollow.ip: String` replaced by `ChannelFollow.user: User` 
#### Additions
The following entities have been introduced together with the new account management system, more information about
them is provided in the developer guide
- `User`: basic representation of a client App / Oriol user,  it can be either an anonymous user (have no related Account) or a gateway account owner.
A User can be associated with activities such as viewing a video, or searching for specific content, 
which can be later used to provide a personalized experience to the user once they create an account.
- `EncryptionArtifacts`: SessionEncryptionArtifacts represents a set of encryption artifacts (cipherIv and cipherKey) 
associated with a given session, allowing the Client app to more securely store
Blockchain account's seed throughout the session 
- `SessionEncryptionArtifacts`: represents a set of encryption artifacts (cipherIv and encryptedSeed) 
which can be used by the Client app to decrypt the seed of a Blockchain account based on the account's
login credentials (email and password)
- `Session`: represents a specific activity period for a `User`
- `Account`: represents a Gateway Account which can be accessed by the Gateway account owner by logging in
- `Token`: represets a unique, securely random string generated by the Auth API for a given account, which allows
executing a specific action on the account's behalf without authentication
- `AccountData` short form version of `Account` displaying relevant account information
- `FollowedChannel` entities containing information about a channel being followed by an account

Furthermore:
- `GatewayConfig` entity has been added in order to allow persisting configuration variables of different types in 
the database. The logic of retrieving setting and updating configration variables is defined in `src/utils/config.ts`
Each configuration variable specified in `src/utils/config.ts` has a corresponding environment variable which serves as a 
default value in case the cnofig value is not set in the database. The information stored will be: `( config_variable_name, value, last_modified_at_timestamp)`

### Middleware
Following the introduction of user-accounts a new middleware authentication has been introduced, allowing the execution of resolvers
only to user that have registered an account on orion. In particular a new `MiddleWareFn` has been introduced `AccountOnly` for this 
purpose only. This means that some previously accessible queries / mutations now have been restricted to registered users only
### Queries
#### Additions
- `accountData`: resolver for which a registered account can gather information such as id, mail, joystream address, joystream memberid, 
and whether his email has been verified
#### Changes
- `getVideoPerIpLimit`: has been removed

###  Mutations
#### Changes
Several changes are due to the `ContextWithIp` type being replaced by a `Context` that contains user's sesion and 
possibly account information
- `followChannel`:
    - now executable only by registered account 
    - argument `ctx: ContextWithIp` has been replaced by a `ctx: Context` containing account informations
    - `ChannelFollowResult.cancelToken` field on the return type has been removed and `ChannelFollowResult.followId` has been added
- `unfollowChannel`: 
    - now executable only by registered account
    - context argument `ctx: ContextWithIp` has been replaced by  `ctx: Context` already containing registered account informations
    - `UnfollowChannelArgs.token` argument for the `unfollowChannel` resolver has been removed
- `requestNftFeatured` `ctx: ContextWithIp` arg has been replaced by `ctx: Context` in order to access user information and `NftFeatureRequestInfo.reporterId` field has been dropped
- `addVideoView` `ctx: ContextWithIp` argument has been replaced by a `ctx: Context` argument
- `reportVideo`:
    - `ctx: ContextWithIp` argument has been replaced by a `ctx: Context` argument
    - `VideoReportInfo.reporterIp: string` field on the return type been dropped
- `reportChannel`:
    - `ctx: ContextWithIp` argument has been replaced by a `ctx: Context` argument
    - `ChannelReportInfo.reporterIp: string` field on the return type been dropped
- `setVideoViewPerIpLimit`: 
    - has been renamed to `setVideoViewPerUserLimit`
    - argument changed from `VideoViewPerIpTimeLimitInput` to `VideoViewPerUserTimeLimitInput`

### Data migration
- `VideoView`, `Report` and `NftFeaturingRequest` entities will be persisted. However, they will all be assigned to a mock
"migration user", created during import (with `id: v2-migration-{random-id-string}`)
- `ChannelFollows` will not be persisted. In v3, you need to have a registered account in order to follow a channel. 

### Documentation
The `/doc` folder has been improved by adding several pieces of documentation, containing explainers and tutorials for both
developers and gateway operators
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
