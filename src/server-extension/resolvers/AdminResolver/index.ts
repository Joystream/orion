import { generateAppActionCommitment } from '@joystream/js/utils'
import { AppAction } from '@joystream/metadata-protobuf'
import { hexToU8a, isHex, u8aToHex } from '@polkadot/util'
import { ed25519PairFromString, ed25519Sign } from '@polkadot/util-crypto'
import { Context } from '@subsquid/openreader/lib/context'
import { getObjectSize } from '@subsquid/openreader/lib/limit.size'
import { parseObjectTree } from '@subsquid/openreader/lib/opencrud/tree'
import { EntityByIdQuery } from '@subsquid/openreader/lib/sql/query'
import { getResolveTree } from '@subsquid/openreader/lib/util/resolve-tree'
import { GraphQLResolveInfo } from 'graphql'
import 'reflect-metadata'
import { Args, Ctx, Info, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { EntityManager, In, Not, UpdateResult } from 'typeorm'
import { videoRelevanceManager } from '../../../mappings/utils'
import {
  Channel,
  OperatorPermission,
  User,
  Video,
  VideoCategory,
  Account,
  ChannelRecipient,
  NftFeaturedOnMarketPlace,
  VideoFeaturedInCategory,
  VideoHero as VideoHeroEntity,
} from '../../../model'
import { ConfigVariable, config } from '../../../utils/config'
import { withHiddenEntities } from '../../../utils/sql'
import { VideoHero } from '../baseTypes'
import { OperatorOnly } from '../middleware'
import {
  AppActionSignatureInput,
  AppRootDomain,
  ChannelWeight,
  ExcludableContentType,
  ExcludeContentArgs,
  ExcludeContentResult,
  GeneratedSignature,
  GrantOperatorPermissionsInput,
  GrantOrRevokeOperatorPermissionsResult,
  KillSwitch,
  MaxAttemptsOnMailDelivery,
  RestoreContentArgs,
  RestoreContentResult,
  RevokeOperatorPermissionsInput,
  SetCategoryFeaturedVideosArgs,
  SetCategoryFeaturedVideosResult,
  SetChannelsWeightsArgs,
  SetFeaturedNftsInput,
  SetFeaturedNftsResult,
  SetKillSwitchInput,
  SetMaxAttemptsOnMailDeliveryInput,
  SetNewAppAssetStorageInput,
  SetNewAppAssetStorageResult,
  SetNewAppNameAltInput,
  SetNewAppNameAltResult,
  SetNewNotificationAssetRootInput,
  SetNewNotificationAssetRootResult,
  SetRootDomainInput,
  SetSupportedCategoriesInput,
  SetSupportedCategoriesResult,
  SetVideoHeroInput,
  SetVideoHeroResult,
  SetVideoViewPerUserTimeLimitInput,
  SetVideoWeightsInput,
  VideoViewPerUserTimeLimit,
  VideoWeights,
} from './types'
import { parseVideoTitle } from '../../../mappings/content/utils'
import { addNotification } from '../../../utils/notification'
import { processCommentsCensorshipStatusUpdate } from './utils'
import { model } from '../model'

@Resolver()
export class AdminResolver {
  // Set by dependency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @UseMiddleware(OperatorOnly())
  @Mutation(() => SetNewAppAssetStorageResult)
  async setAppAssetStorage(
    @Args() args: SetNewAppAssetStorageInput
  ): Promise<SetNewAppAssetStorageResult> {
    const em = await this.em()
    await config.set(ConfigVariable.AppAssetStorage, args.newAppAssetStorage, em)
    return { newAppAssetStorage: args.newAppAssetStorage }
  }

  @UseMiddleware(OperatorOnly())
  @Mutation(() => SetNewAppNameAltResult)
  async setAppNameAlt(@Args() args: SetNewAppNameAltInput): Promise<SetNewAppNameAltResult> {
    const em = await this.em()
    await config.set(ConfigVariable.AppNameAlt, args.newAppNameAlt, em)
    return { newAppNameAlt: args.newAppNameAlt }
  }

  @UseMiddleware(OperatorOnly())
  @Mutation(() => SetNewNotificationAssetRootResult)
  async setNewNotificationAssetRoot(
    @Args() args: SetNewNotificationAssetRootInput
  ): Promise<SetNewNotificationAssetRootResult> {
    const em = await this.em()
    await config.set(ConfigVariable.NotificationAssetRoot, args.newNotificationAssetRoot, em)
    return { newNotificationAssetRoot: args.newNotificationAssetRoot }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.GRANT_OPERATOR_PERMISSIONS))
  @Mutation(() => GrantOrRevokeOperatorPermissionsResult)
  async grantPermissions(
    @Args() args: GrantOperatorPermissionsInput
  ): Promise<GrantOrRevokeOperatorPermissionsResult> {
    const em = await this.em()
    const user = await em.findOne(User, { where: { id: args.userId } })
    if (!user) {
      throw new Error('User not found')
    }

    // Add only new permissions that the user doesn't have yet
    user.permissions = Array.from(new Set([...(user.permissions || []), ...args.permissions]))

    await em.save(user)
    return { newPermissions: user.permissions }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.REVOKE_OPERATOR_PERMISSIONS))
  @Mutation(() => GrantOrRevokeOperatorPermissionsResult)
  async revokePermission(
    @Args() args: RevokeOperatorPermissionsInput
  ): Promise<GrantOrRevokeOperatorPermissionsResult> {
    const em = await this.em()
    const user = await em.findOne(User, { where: { id: args.userId } })
    if (!user) {
      throw new Error('User not found')
    }

    user.permissions = (user.permissions || []).filter((perm) => !args.permissions.includes(perm))

    await em.save(user)
    return { newPermissions: user.permissions }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_VIDEO_WEIGHTS))
  @Mutation(() => VideoWeights)
  async setVideoWeights(@Args() args: SetVideoWeightsInput): Promise<VideoWeights> {
    const em = await this.em()
    await config.set(
      ConfigVariable.RelevanceWeights,
      [
        args.newnessWeight,
        args.viewsWeight,
        args.commentsWeight,
        args.reactionsWeight,
        [args.joysteamTimestampSubWeight, args.ytTimestampSubWeight],
        args.defaultChannelWeight,
      ],
      em
    )
    await videoRelevanceManager.updateVideoRelevanceValue(em, true)
    return { isApplied: true }
  }

  @UseMiddleware(OperatorOnly())
  @Mutation(() => Int)
  async setMaxAttemptsOnMailDelivery(
    @Args() args: SetMaxAttemptsOnMailDeliveryInput
  ): Promise<MaxAttemptsOnMailDelivery> {
    const em = await this.em()
    if (args.newMaxAttempts < 1) {
      throw new Error('Max attempts cannot be less than 1')
    }
    await config.set(ConfigVariable.EmailNotificationDeliveryMaxAttempts, args.newMaxAttempts, em)
    return { maxAttempts: args.newMaxAttempts }
  }

  @UseMiddleware(OperatorOnly())
  @Mutation(() => AppRootDomain)
  @Mutation(() => Int)
  async setNewNotificationCenterPath(
    @Args() args: SetMaxAttemptsOnMailDeliveryInput
  ): Promise<MaxAttemptsOnMailDelivery> {
    const em = await this.em()
    if (args.newMaxAttempts < 1) {
      throw new Error('Max attempts cannot be less than 1')
    }
    await config.set(ConfigVariable.EmailNotificationDeliveryMaxAttempts, args.newMaxAttempts, em)
    return { maxAttempts: args.newMaxAttempts }
  }

  @UseMiddleware(OperatorOnly())
  @Mutation(() => AppRootDomain)
  async setNewAppRootDomain(@Args() args: SetRootDomainInput): Promise<AppRootDomain> {
    const em = await this.em()
    await config.set(ConfigVariable.AppRootDomain, args.newRootDomain, em)
    return { isApplied: true }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_CHANNEL_WEIGHTS))
  @Mutation(() => [ChannelWeight])
  async setChannelsWeights(@Args() { inputs }: SetChannelsWeightsArgs): Promise<ChannelWeight[]> {
    const em = await this.em()

    const results: ChannelWeight[] = []

    // Process each SetChannelWeightInput
    for (const weightInput of inputs) {
      const { channelId, weight } = weightInput

      // Update the channel weight in the database
      const updateResult: UpdateResult = await em.transaction(
        async (transactionalEntityManager) => {
          return transactionalEntityManager
            .createQueryBuilder()
            .update(Channel)
            .set({ channelWeight: weight })
            .where('id = :id', { id: channelId })
            .execute()
        }
      )

      // Push the result into the results array
      results.push({
        channelId,
        isApplied: !!updateResult.affected,
      })
    }

    return results
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_KILL_SWITCH))
  @Mutation(() => KillSwitch)
  async setKillSwitch(@Args() args: SetKillSwitchInput): Promise<KillSwitch> {
    const em = await this.em()
    await config.set(ConfigVariable.KillSwitch, args.isKilled, em)
    return { isKilled: await config.get(ConfigVariable.KillSwitch, em) }
  }

  @Query(() => KillSwitch)
  async getKillSwitch(): Promise<KillSwitch> {
    const em = await this.em()
    return { isKilled: await config.get(ConfigVariable.KillSwitch, em) }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_VIDEO_VIEW_PER_USER_TIME_LIMIT))
  @Mutation(() => VideoViewPerUserTimeLimit)
  async setVideoViewPerUserTimeLimit(
    @Args() args: SetVideoViewPerUserTimeLimitInput
  ): Promise<VideoViewPerUserTimeLimit> {
    const em = await this.em()
    await config.set(ConfigVariable.VideoViewPerUserTimeLimit, args.limitInSeconds, em)
    return {
      limitInSeconds: await config.get(ConfigVariable.VideoViewPerUserTimeLimit, em),
    }
  }

  @Query(() => VideoHero, { nullable: true })
  async videoHero(
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context
  ): Promise<VideoHero | undefined> {
    const tree = getResolveTree(info)
    const fields = parseObjectTree(model, 'VideoHero', info.schema, tree)

    ctx.openreader.responseSizeLimit?.check(() => getObjectSize(model, fields) + 1)

    const em = await this.em()
    const { id: currentHeroId } =
      (
        await em.getRepository(VideoHeroEntity).find({
          select: { id: true },
          order: { activatedAt: 'DESC' },
          take: 1,
        })
      )[0] || {}

    if (currentHeroId === undefined) {
      return undefined
    }

    const entityByIdQuery = new EntityByIdQuery(
      model,
      ctx.openreader.dialect,
      'VideoHero',
      fields,
      currentHeroId
    )

    return ctx.openreader.executeQuery(entityByIdQuery)
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_VIDEO_HERO))
  @Mutation(() => SetVideoHeroResult)
  async setVideoHero(@Args() args: SetVideoHeroInput): Promise<SetVideoHeroResult> {
    const em = await this.em()
    const [currentHero] = await em.getRepository(VideoHeroEntity).find({
      order: { activatedAt: 'DESC' },
      take: 1,
    })
    // Create sequential id
    const id = (parseInt(currentHero?.id || '0', 36) + 1).toString(36)
    const videoHero = new VideoHeroEntity({
      id,
      activatedAt: new Date(),
      heroPosterUrl: args.heroPosterUrl,
      heroTitle: args.heroTitle,
      heroVideoCutUrl: args.videoCutUrl,
      video: new Video({ id: args.videoId }),
    })

    await em.save(videoHero)

    return { id }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_CATEGORY_FEATURED_VIDEOS))
  @Mutation(() => SetCategoryFeaturedVideosResult)
  async setCategoryFeaturedVideos(
    @Args() args: SetCategoryFeaturedVideosArgs
  ): Promise<SetCategoryFeaturedVideosResult> {
    const em = await this.em()
    const { categoryId } = args

    const deleteResult = await em.getRepository(VideoFeaturedInCategory).delete({
      category: {
        id: categoryId,
      },
      video: {
        id: Not(In(args.videos.map((v) => v.videoId))),
      },
    })
    const numberOfFeaturedVideosUnset = deleteResult.affected || 0

    const newRows = args.videos.map(
      ({ videoId, videoCutUrl }) =>
        new VideoFeaturedInCategory({
          id: `${videoId}-${categoryId}`,
          category: new VideoCategory({ id: categoryId }),
          video: new Video({ id: videoId }),
          videoCutUrl,
        })
    )
    await em.save(newRows)

    return {
      categoryId,
      numberOfFeaturedVideosSet: newRows.length,
      numberOfFeaturedVideosUnset,
    }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_SUPPORTED_CATEGORIES))
  @Mutation(() => SetSupportedCategoriesResult)
  async setSupportedCategories(
    @Args()
    {
      supportNewCategories,
      supportNoCategoryVideos,
      supportedCategoriesIds,
    }: SetSupportedCategoriesInput
  ): Promise<SetSupportedCategoriesResult> {
    const em = await this.em()
    let newNumberOfCategoriesSupported = 0
    if (supportedCategoriesIds) {
      await em
        .createQueryBuilder()
        .update(`admin.video_category`)
        .set({ is_supported: false })
        .execute()
      if (supportedCategoriesIds.length) {
        const result = await em
          .createQueryBuilder()
          .update(`admin.video_category`)
          .set({ is_supported: true })
          .where({ id: In(supportedCategoriesIds) })
          .execute()
        newNumberOfCategoriesSupported = result.affected || 0
      }
    }
    if (supportNewCategories !== undefined) {
      await config.set(ConfigVariable.SupportNewCategories, supportNewCategories, em)
    }
    if (supportNoCategoryVideos !== undefined) {
      await config.set(ConfigVariable.SupportNoCategoryVideo, supportNoCategoryVideos, em)
    }
    return {
      newNumberOfCategoriesSupported,
      newlyCreatedCategoriesSupported: await config.get(ConfigVariable.SupportNewCategories, em),
      noCategoryVideosSupported: await config.get(ConfigVariable.SupportNoCategoryVideo, em),
    }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_FEATURED_NFTS))
  @Mutation(() => SetFeaturedNftsResult)
  async setFeaturedNfts(
    @Args() { featuredNftsIds }: SetFeaturedNftsInput
  ): Promise<SetFeaturedNftsResult> {
    const em = await this.em()
    return await setFeaturedNftsInner(em, featuredNftsIds)
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.EXCLUDE_CONTENT))
  @Mutation(() => ExcludeContentResult)
  async excludeContent(
    @Args()
    { ids, type }: ExcludeContentArgs
  ): Promise<ExcludeContentResult> {
    const em = await this.em()

    return withHiddenEntities(em, async () => {
      const result = await em
        .createQueryBuilder()
        .update(type)
        .set({ isExcluded: true })
        .where({ id: In(ids) })
        .execute()

      if (type === ExcludableContentType.Comment) {
        await processCommentsCensorshipStatusUpdate(em, ids)
      }

      return {
        numberOfEntitiesAffected: result.affected || 0,
      }
    })
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.RESTORE_CONTENT))
  @Mutation(() => RestoreContentResult)
  async restoreContent(
    @Args()
    { ids, type }: RestoreContentArgs
  ): Promise<ExcludeContentResult> {
    const em = await this.em()

    return withHiddenEntities(em, async () => {
      const result = await em
        .createQueryBuilder()
        .update(type)
        .set({ isExcluded: false })
        .where({ id: In(ids) })
        .execute()

      if (type === ExcludableContentType.Comment) {
        await processCommentsCensorshipStatusUpdate(em, ids)
      }

      return {
        numberOfEntitiesAffected: result.affected || 0,
      }
    })
  }

  @Mutation(() => GeneratedSignature)
  async signAppActionCommitment(
    // FIXME: In the initial implementation we require the user to provide the nonce
    // and don't verify it in any way, but this should be changed in the future
    @Args() { nonce, rawAction, assets, creatorId, actionType }: AppActionSignatureInput
  ) {
    const em = await this.em()
    if (!isHex(assets) || !isHex(rawAction)) {
      throw new Error('One of input is not hex: assets, rawAction')
    }

    const message = generateAppActionCommitment(
      nonce,
      `${creatorId}`,
      actionType,
      actionType === AppAction.ActionType.CREATE_CHANNEL
        ? AppAction.CreatorType.MEMBER // only members are supported as channel owners for now
        : AppAction.CreatorType.CHANNEL,
      hexToU8a(assets),
      hexToU8a(rawAction)
    )
    const appKeypair = ed25519PairFromString(await config.get(ConfigVariable.AppPrivateKey, em))
    const signature = ed25519Sign(message, appKeypair)
    return { signature: u8aToHex(signature) }
  }
}

export const setFeaturedNftsInner = async (em: EntityManager, featuredNftsIds: string[]) => {
  let newNumberOfNftsFeatured = 0

  await em
    .createQueryBuilder()
    .update(`admin.owned_nft`)
    .set({ is_featured: false })
    .where({ is_featured: true })
    .execute()

  if (featuredNftsIds.length) {
    const result = await em
      .createQueryBuilder()
      .update(`admin.owned_nft`)
      .set({ is_featured: true })
      .where({ id: In(featuredNftsIds) })
      .execute()
    newNumberOfNftsFeatured = result.affected || 0

    // fetch all featured nfts and deposit notification for their creators
    for (const featuredNftId of featuredNftsIds) {
      const featuredNft = await em.getRepository('OwnedNft').findOne({
        where: { id: featuredNftId },
        relations: { video: { channel: true } },
      })
      if (featuredNft?.video?.channel) {
        const notificationData = {
          videoId: featuredNft.video.id,
          videoTitle: parseVideoTitle(featuredNft.video),
        }
        const channelOwnerAccount = featuredNft.video.channel.ownerMemberId
          ? await em
              .getRepository(Account)
              .findOneBy({ membershipId: featuredNft.video.channel.ownerMemberId })
          : null
        await addNotification(
          em,
          channelOwnerAccount,
          new ChannelRecipient({ channel: featuredNft.video.channel.id }),
          new NftFeaturedOnMarketPlace(notificationData)
        )
      }
    }
  }

  return {
    newNumberOfNftsFeatured,
  }
}
