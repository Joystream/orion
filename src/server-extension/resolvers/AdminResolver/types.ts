import { AppAction } from '@joystream/metadata-protobuf'
import { ArgsType, Field, Float, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'
import { OperatorPermission } from '../../../model'
import { SumTo } from '../validators'

@InputType('ChannelRelevanceWeightsInput')
@ObjectType('ChannelRelevanceWeights')
export class ChannelRelevanceWeights {
  @Field(() => Float, { nullable: false })
  crtVolumeWeight!: number

  @Field(() => Float, { nullable: false })
  crtLiquidityWeight!: number

  @Field(() => Float, { nullable: false })
  followersWeight!: number

  @Field(() => Float, { nullable: false })
  revenueWeight!: number

  @Field(() => Float, { nullable: false })
  yppTierWeight!: number
}

@InputType('AgeSubWeightsInput')
@ObjectType('AgeSubWeights')
export class AgeSubWeights {
  @Field(() => Float, { nullable: false })
  joystreamAgeWeight!: number

  @Field(() => Float, { nullable: false })
  youtubeAgeWeight!: number
}

@InputType('VideoRelevanceWeightsInput')
@ObjectType('VideoRelevanceWeights')
export class VideoRelevanceWeights {
  @Field(() => Float, { nullable: false })
  ageWeight!: number

  @Field(() => AgeSubWeights, { nullable: false })
  @SumTo(1)
  ageSubWeights!: AgeSubWeights

  @Field(() => Float, { nullable: false })
  viewsWeight!: number

  @Field(() => Float, { nullable: false })
  commentsWeight!: number

  @Field(() => Float, { nullable: false })
  reactionsWeight!: number
}

@ArgsType()
export class SetRelevanceWeightsArgs {
  @Field(() => ChannelRelevanceWeights, { nullable: true })
  @SumTo(1)
  channel?: ChannelRelevanceWeights

  @Field(() => VideoRelevanceWeights, { nullable: true })
  @SumTo(1, { omit: ['ageSubWeights'] })
  video?: VideoRelevanceWeights
}

@ObjectType()
export class RelevanceWeights {
  @Field(() => ChannelRelevanceWeights, { nullable: false })
  channel!: ChannelRelevanceWeights

  @Field(() => VideoRelevanceWeights, { nullable: false })
  video!: VideoRelevanceWeights
}

@ObjectType()
export class SetRelevanceWeightsResult {
  @Field(() => RelevanceWeights, { nullable: false })
  updatedWeights!: RelevanceWeights
}

@ArgsType()
export class SetRelevanceServiceConfigArgs {
  @Field(() => Int, { nullable: true })
  populateBackgroundQueueInterval?: number

  @Field(() => Int, { nullable: true })
  updateLoopInterval?: number

  @Field(() => Int, { nullable: true })
  channelsPerIteration?: number

  @Field(() => Int, { nullable: true })
  videosPerChannelLimit?: number

  @Field(() => Int, { nullable: true })
  videosPerChannelSelectTop?: number

  @Field(() => Int, { nullable: true })
  ageScoreHalvingDays?: number
}

@ObjectType()
export class RelevanceServiceConfig {
  @Field(() => Int, { nullable: false })
  populateBackgroundQueueInterval!: number

  @Field(() => Int, { nullable: false })
  updateLoopInterval!: number

  @Field(() => Int, { nullable: false })
  channelsPerIteration!: number

  @Field(() => Int, { nullable: false })
  videosPerChannelLimit!: number

  @Field(() => Int, { nullable: false })
  videosPerChannelSelectTop!: number

  @Field(() => Int, { nullable: false })
  ageScoreHalvingDays!: number
}

@ObjectType()
export class SetRelevanceServiceConfigResult {
  @Field(() => RelevanceServiceConfig, { nullable: false })
  updatedConfig!: RelevanceServiceConfig
}

@ArgsType()
export class SetTipTierAmountsInput {
  @Field(() => Int, { nullable: true })
  SILVER?: number

  @Field(() => Int, { nullable: true })
  GOLD?: number

  @Field(() => Int, { nullable: true })
  DIAMOND?: number
}

@ObjectType()
export class CommentTipTiers {
  @Field(() => Int, { nullable: false })
  SILVER!: number

  @Field(() => Int, { nullable: false })
  GOLD!: number

  @Field(() => Int, { nullable: false })
  DIAMOND!: number
}

@ArgsType()
export class SetMaxAttemptsOnMailDeliveryInput {
  @Field(() => Int, { nullable: false })
  newMaxAttempts!: number
}

@ObjectType()
export class MaxAttemptsOnMailDelivery {
  @Field(() => Int, { nullable: false })
  maxAttempts!: number
}

@ArgsType()
export class SetRootDomainInput {
  @Field(() => String, { nullable: false })
  newRootDomain!: string
}

@ObjectType()
export class AppRootDomain {
  @Field(() => Boolean, { nullable: false })
  isApplied!: boolean
}

@ArgsType()
export class SetCrtMarketCapMinVolume {
  @Field(() => Int, { nullable: false })
  minVolumeJoy!: number
}

@ObjectType()
export class CrtMarketCapMinVolume {
  @Field(() => Int, { nullable: false })
  minVolumeJoy!: number
}

@ArgsType()
export class SetKillSwitchInput {
  @Field(() => Boolean, { nullable: false })
  isKilled!: boolean
}

@ObjectType()
export class KillSwitch {
  @Field(() => Boolean, { nullable: false })
  isKilled!: boolean
}

@ArgsType()
export class SetVideoViewPerUserTimeLimitInput {
  @Field(() => Int, { nullable: false })
  limitInSeconds!: number
}

@ObjectType()
export class VideoViewPerUserTimeLimit {
  @Field(() => Int, { nullable: false })
  limitInSeconds!: number
}

@ArgsType()
export class SetVideoHeroInput {
  @Field(() => String, { nullable: false })
  videoId!: string

  @Field(() => String, { nullable: false })
  heroTitle!: string

  @Field(() => String, { nullable: false })
  videoCutUrl!: string

  @Field(() => String, { nullable: false })
  heroPosterUrl!: string
}

@ObjectType()
export class SetVideoHeroResult {
  @Field(() => String, { nullable: false })
  id!: string
}

@ArgsType()
export class SetSupportedCategoriesInput {
  @Field(() => [String], {
    nullable: true,
    description: 'IDs of the video categories that should be supported by the Gateway',
  })
  supportedCategoriesIds?: string[]

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the newly created video categories should be supported by default',
  })
  supportNewCategories?: boolean

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the Gateway should support videos that have no category assigned',
  })
  supportNoCategoryVideos?: boolean
}

@ObjectType()
export class SetSupportedCategoriesResult {
  @Field(() => Int, {
    nullable: true,
    description:
      'The updated number of categories that are now explicitly supported by the Gateway',
  })
  newNumberOfCategoriesSupported?: number

  @Field(() => Boolean, {
    nullable: false,
    description: 'Whether or not newly created video categories will be automatically supported',
  })
  newlyCreatedCategoriesSupported!: boolean

  @Field(() => Boolean, {
    nullable: false,
    description: 'Whether or not vidoes w/o any category assigned will be supported',
  })
  noCategoryVideosSupported!: boolean
}

@InputType()
class FeaturedVideoInput {
  @Field(() => String)
  videoId!: string

  @Field({ nullable: true })
  videoCutUrl?: string
}

@ArgsType()
export class SetCategoryFeaturedVideosArgs {
  @Field(() => String)
  categoryId!: string

  @Field(() => [FeaturedVideoInput])
  videos!: FeaturedVideoInput[]
}

@ObjectType()
export class SetCategoryFeaturedVideosResult {
  @Field(() => String)
  categoryId!: string

  @Field(() => Int)
  numberOfFeaturedVideosUnset!: number

  @Field(() => Int)
  numberOfFeaturedVideosSet!: number
}

export enum ExcludableContentType {
  Channel = 'channel',
  Video = 'video',
  Comment = 'comment',
}
registerEnumType(ExcludableContentType, { name: 'ExcludableContentType' })

@ArgsType()
export class ExcludeContentArgs {
  @Field(() => ExcludableContentType, {
    nullable: false,
    description: 'Type of the content to exclude/hide',
  })
  type: ExcludableContentType

  @Field(() => [String], {
    nullable: false,
    description: 'IDs of the entities to be excluded (hidden)',
  })
  ids!: string[]
}

@ObjectType()
export class ExcludeContentResult {
  @Field(() => Int)
  numberOfEntitiesAffected!: number
}

@ArgsType()
export class RestoreContentArgs {
  @Field(() => ExcludableContentType, {
    nullable: false,
    description: 'Type of the content to restore',
  })
  type: ExcludableContentType

  @Field(() => [String], {
    nullable: false,
    description: 'IDs of the entities to be restored',
  })
  ids!: string[]
}

@ObjectType()
export class RestoreContentResult {
  @Field(() => Int)
  numberOfEntitiesAffected!: number
}

@ArgsType()
export class AppActionSignatureInput {
  @Field()
  nonce: number

  @Field()
  creatorId: string

  @Field({ description: 'Hex string from UInt8Array' })
  assets: string

  @Field({ description: 'Hex string from UInt8Array' })
  rawAction: string

  @Field(() => AppAction.ActionType)
  actionType: AppAction.ActionType
}

@ObjectType()
export class GeneratedSignature {
  @Field({ description: 'App signature converted to hexadecimal string.' })
  signature: string
}

registerEnumType(AppAction.ActionType, { name: 'AppActionActionType' })

@ArgsType()
export class SetFeaturedNftsInput {
  @Field(() => [String], {
    description: 'IDs of the NFTs that should be featured by the Gateway',
  })
  featuredNftsIds: string[]
}

@ArgsType()
export class SetFeaturedCrtsInput {
  @Field(() => [String], {
    description: 'IDs of the CRTs that should be featured by the Gateway',
  })
  featuredCrtsIds: string[]
}

@ObjectType()
export class SetFeaturedNftsResult {
  @Field(() => Int, {
    nullable: true,
    description: 'The updated number of nft that are now explicitly featured by the Gateway',
  })
  newNumberOfNftsFeatured?: number
}

@ObjectType()
export class SetFeaturedCrtsResult {
  @Field(() => Int, {
    nullable: true,
    description: 'The updated number of crts that are now explicitly featured by the Gateway',
  })
  newNumberOfCrtsFeatured?: number
}

@ArgsType()
export class SetNewAppAssetStorageInput {
  @Field(() => String, {
    nullable: false,
    description: 'The app asset storage link to be set',
  })
  newAppAssetStorage!: string
}

@ObjectType()
export class SetNewAppAssetStorageResult {
  @Field(() => String, {
    nullable: false,
    description: 'The app asset storage link just set',
  })
  newAppAssetStorage!: string
}

@ArgsType()
export class SetNewAppNameAltInput {
  @Field(() => String, {
    nullable: false,
    description: 'The app name alternative to be set',
  })
  newAppNameAlt!: string
}

@ObjectType()
export class SetNewAppNameAltResult {
  @Field(() => String, {
    nullable: false,
    description: 'The app name alternative just set',
  })
  newAppNameAlt!: string
}

@ArgsType()
export class SetNewNotificationAssetRootInput {
  @Field(() => String, {
    nullable: false,
    description: 'The notification asset root link to be set',
  })
  newNotificationAssetRoot!: string
}

@ObjectType()
export class SetNewNotificationAssetRootResult {
  @Field(() => String, {
    nullable: false,
    description: 'The notification asset root link just set',
  })
  newNotificationAssetRoot!: string
}

registerEnumType(OperatorPermission, { name: 'OperatorPermission' })

@ArgsType()
export class GrantOperatorPermissionsInput {
  @Field(() => String, {
    nullable: true,
    description: 'ID of the user that should be granted operator permissions',
  })
  userId!: string

  @Field(() => [OperatorPermission], {
    nullable: true,
    description: 'List of permissions that should be granted to the user',
  })
  permissions!: OperatorPermission[]
}

@ArgsType()
export class RevokeOperatorPermissionsInput {
  @Field(() => String, {
    nullable: true,
    description: 'ID of the user whose operator permissions should be revoked',
  })
  userId!: string

  @Field(() => [OperatorPermission], {
    nullable: true,
    description: 'List of operator permissions that should be revoked for the user',
  })
  permissions!: OperatorPermission[]
}

@ObjectType()
export class GrantOrRevokeOperatorPermissionsResult {
  @Field(() => [OperatorPermission])
  newPermissions!: OperatorPermission[]
}
