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
import { EntityManager, In, Not } from 'typeorm'
import {
  Account,
  ChannelRecipient,
  CreatorToken,
  NftFeaturedOnMarketPlace,
  OperatorPermission,
  OwnedNft,
  User,
  Video,
  VideoCategory,
  VideoFeaturedInCategory,
  VideoHero as VideoHeroEntity,
} from '../../../model'
import { ConfigVariable, config } from '../../../utils/config'
import { addNotification } from '../../../utils/notification'
import { withHiddenEntities } from '../../../utils/sql'
import { VideoHero } from '../baseTypes'
import { OperatorOnly } from '../middleware'
import { model } from '../model'
import {
  AppActionSignatureInput,
  AppRootDomain,
  CommentTipTiers,
  CrtMarketCapMinVolume,
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
  SetCrtMarketCapMinVolume,
  SetFeaturedCrtsInput,
  SetFeaturedCrtsResult,
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
  SetTipTierAmountsInput,
  SetVideoHeroInput,
  SetVideoHeroResult,
  SetVideoViewPerUserTimeLimitInput,
  VideoViewPerUserTimeLimit,
  SetRelevanceWeightsArgs,
  SetRelevanceWeightsResult,
  SetRelevanceServiceConfigResult,
  SetRelevanceServiceConfigArgs,
} from './types'
import { processCommentsCensorshipStatusUpdate } from './utils'
import { parseVideoTitle } from '../../../utils/notification/helpers'
import { relevanceQueuePublisher } from '../../utils'

@Resolver()
export class AdminResolver {
  // Set by dependency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_APP_CONFIGS))
  @Mutation(() => SetNewAppAssetStorageResult)
  async setAppAssetStorage(
    @Args() args: SetNewAppAssetStorageInput
  ): Promise<SetNewAppAssetStorageResult> {
    const em = await this.em()
    await config.set(ConfigVariable.AppAssetStorage, args.newAppAssetStorage, em)
    return { newAppAssetStorage: args.newAppAssetStorage }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_APP_CONFIGS))
  @Mutation(() => SetNewAppNameAltResult)
  async setAppNameAlt(@Args() args: SetNewAppNameAltInput): Promise<SetNewAppNameAltResult> {
    const em = await this.em()
    await config.set(ConfigVariable.AppNameAlt, args.newAppNameAlt, em)
    return { newAppNameAlt: args.newAppNameAlt }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_APP_CONFIGS))
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

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_RELEVANCE_WEIGHTS))
  @Mutation(() => SetRelevanceWeightsResult)
  async setRelevanceWeights(
    @Args() args: SetRelevanceWeightsArgs
  ): Promise<SetRelevanceWeightsResult> {
    const em = await this.em()
    const currentWeights = await config.get(ConfigVariable.RelevanceWeights, em)
    await config.set(
      ConfigVariable.RelevanceWeights,
      {
        channel: args.channel ?? currentWeights.channel,
        video: args.video ?? currentWeights.video,
      },
      em
    )
    const updatedWeights = await config.get(ConfigVariable.RelevanceWeights, em)
    await relevanceQueuePublisher.pushRestartRequest()
    return { updatedWeights }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_RELEVANCE_CONFIG))
  @Mutation(() => SetRelevanceServiceConfigResult)
  async setRelevanceServiceConfig(
    @Args() args: SetRelevanceServiceConfigArgs
  ): Promise<SetRelevanceServiceConfigResult> {
    const em = await this.em()
    const currentConfig = await config.get(ConfigVariable.RelevanceServiceConfig, em)
    await config.set(
      ConfigVariable.RelevanceServiceConfig,
      {
        ...currentConfig,
        ...args,
      },
      em
    )
    const updatedConfig = await config.get(ConfigVariable.RelevanceServiceConfig, em)
    await relevanceQueuePublisher.pushRestartRequest()
    return { updatedConfig }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_TIP_TIERS))
  @Mutation(() => CommentTipTiers)
  async setTipTierAmounts(@Args() args: SetTipTierAmountsInput): Promise<CommentTipTiers> {
    const em = await this.em()
    const tipTiers = await config.get(ConfigVariable.CommentTipTiers, em)
    const newTipTiers = { ...tipTiers, ...args }
    await config.set(ConfigVariable.CommentTipTiers, newTipTiers, em)
    return newTipTiers
  }

  @Query(() => CommentTipTiers)
  async tipTiers(): Promise<CommentTipTiers> {
    const em = await this.em()
    return config.get(ConfigVariable.CommentTipTiers, em)
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_APP_CONFIGS))
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

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_APP_CONFIGS))
  @Mutation(() => AppRootDomain)
  async setNewAppRootDomain(@Args() args: SetRootDomainInput): Promise<AppRootDomain> {
    const em = await this.em()
    await config.set(ConfigVariable.AppRootDomain, args.newRootDomain, em)
    return { isApplied: true }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_CRT_MARKETCAP_MIN_VOLUME))
  @Mutation(() => CrtMarketCapMinVolume)
  async setCrtMarketCapMinVolume(@Args() args: SetCrtMarketCapMinVolume) {
    const em = await this.em()
    await config.set(ConfigVariable.CrtMarketCapMinVolumeJoy, args.minVolumeJoy, em)
    return { minVolumeJoy: await config.get(ConfigVariable.CrtMarketCapMinVolumeJoy, em) }
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

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_CRT_MARKETCAP_MIN_VOLUME))
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
        .update<VideoCategory>(VideoCategory)
        .set({ isSupported: false })
        .execute()
      if (supportedCategoriesIds.length) {
        const result = await em
          .createQueryBuilder()
          .update<VideoCategory>(VideoCategory)
          .set({ isSupported: true })
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

  @UseMiddleware(OperatorOnly(OperatorPermission.SET_FEATURED_CRTS))
  @Mutation(() => SetFeaturedCrtsResult)
  async setFeaturedCrts(
    @Args() { featuredCrtsIds }: SetFeaturedCrtsInput
  ): Promise<SetFeaturedCrtsResult> {
    const em = await this.em()
    let newNumberOfCrtsFeatured = 0

    await em
      .createQueryBuilder()
      .update<CreatorToken>(CreatorToken)
      .set({ isFeatured: false })
      .where({ isFeatured: true })
      .execute()

    if (featuredCrtsIds.length) {
      const result = await em
        .createQueryBuilder()
        .update<CreatorToken>(CreatorToken)
        .set({ isFeatured: true })
        .where({ id: In(featuredCrtsIds) })
        .execute()
      newNumberOfCrtsFeatured = result.affected || 0
    }

    return {
      newNumberOfCrtsFeatured,
    }
  }

  @UseMiddleware(OperatorOnly(OperatorPermission.EXCLUDE_CONTENT))
  @Mutation(() => ExcludeContentResult)
  async excludeContent(
    @Args()
    { ids, type }: ExcludeContentArgs
  ): Promise<ExcludeContentResult> {
    // TODO: Consider adding rationale and notification
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
    // TODO: Consider adding rationale and notification
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

  const currentFeaturedNft = await em.find(OwnedNft, { where: { isFeatured: true } })
  const currentFeaturedNftIds = currentFeaturedNft.map((nft) => nft.id)

  await em
    .createQueryBuilder()
    .update<OwnedNft>(OwnedNft)
    .set({ isFeatured: false })
    .where({ isFeatured: true })
    .execute()

  if (featuredNftsIds.length) {
    const result = await em
      .createQueryBuilder()
      .update<OwnedNft>(OwnedNft)
      .set({ isFeatured: true })
      .where({ id: In(featuredNftsIds) })
      .execute()
    newNumberOfNftsFeatured = result.affected || 0

    // fetch all featured nfts and deposit notification for their creators
    for (const featuredNftId of featuredNftsIds) {
      const featuredNft = await em.getRepository<OwnedNft>(OwnedNft).findOne({
        where: { id: featuredNftId },
        relations: { video: { channel: true } },
      })
      const alreadyFeatured = currentFeaturedNftIds.includes(featuredNftId)
      // this will avoid duplicated notifications if the nft was reselected as featured
      if (!alreadyFeatured && featuredNft?.video?.channel) {
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
