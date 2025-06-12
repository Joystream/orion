import { ArgsType, Field, ObjectType, InputType, Int, registerEnumType } from 'type-graphql'
import { Channel, ChannelWhereInput, ChannelOrderByInput, Membership } from '../baseTypes'
import { MaxLength } from 'class-validator'
import { EntityReportInfo } from '../commonTypes'
import { DateTime } from '@subsquid/graphql-server'

@ObjectType()
export class ExtendedChannel {
  @Field(() => Channel, { nullable: false })
  channel!: Channel

  @Field(() => Int, { nullable: false })
  activeVideosCount!: number
}

@ObjectType()
export class TopSellingChannelsResult {
  @Field(() => Channel, { nullable: false })
  channel!: Channel

  @Field(() => String, { nullable: false })
  amount!: string

  @Field(() => Int, { nullable: false })
  nftSold!: number
}

@ObjectType()
export class ChannelNftCollector {
  @Field(() => Membership, { nullable: false })
  member!: Membership

  @Field(() => Int, { nullable: false })
  amount!: number
}

@InputType()
export class ExtendedChannelWhereInput {
  @Field(() => ChannelWhereInput, { nullable: true })
  channel?: Record<string, unknown>

  @Field(() => Int, { nullable: true })
  activeVideosCount_gt?: number
}

@ArgsType()
export class ExtendedChannelsArgs {
  @Field(() => ExtendedChannelWhereInput, { nullable: true })
  where?: ExtendedChannelWhereInput

  @Field(() => [ChannelOrderByInput], { nullable: true })
  orderBy?: ChannelOrderByInput[]

  @Field(() => Int, { nullable: true })
  limit?: number
}

@ArgsType()
export class MostRecentChannelsArgs {
  @Field(() => ExtendedChannelWhereInput, { nullable: true })
  where?: ExtendedChannelWhereInput

  @Field(() => [ChannelOrderByInput], { nullable: true })
  orderBy?: ChannelOrderByInput[]

  @Field(() => Int, { nullable: false })
  mostRecentLimit!: number

  @Field(() => Int, { nullable: true })
  resultsLimit?: number
}

@ArgsType()
export class TopSellingChannelsArgs {
  @Field(() => ExtendedChannelWhereInput, { nullable: true })
  where?: ExtendedChannelWhereInput

  @Field(() => Int, { nullable: false })
  limit!: number

  @Field(() => Int, { nullable: false })
  periodDays!: number
}

export enum ChannelNftCollectorsOrderByInput {
  amount_ASC,
  amount_DESC,
}
registerEnumType(ChannelNftCollectorsOrderByInput, {
  name: 'ChannelNftCollectorsOrderByInput',
})

@ArgsType()
export class ChannelNftCollectorsArgs {
  @Field(() => String, { nullable: false })
  channelId!: string

  @Field(() => ChannelNftCollectorsOrderByInput, { nullable: true })
  orderBy?: ChannelNftCollectorsOrderByInput

  @Field(() => Int, { nullable: true })
  limit?: number
}

@ArgsType()
export class ReportChannelArgs {
  @Field(() => String, { nullable: false })
  channelId!: string

  @Field(() => String, { nullable: false })
  @MaxLength(400, { message: 'Rationale cannot be longer than 400 characters' })
  rationale!: string
}

@ArgsType()
export class FollowChannelArgs {
  @Field(() => String, { nullable: false })
  channelId!: string
}

@ArgsType()
export class UnfollowChannelArgs {
  @Field(() => String, { nullable: false })
  channelId!: string
}

@ObjectType()
export class ChannelFollowResult {
  @Field(() => String, { nullable: false })
  followId!: string

  @Field(() => String, { nullable: false })
  channelId!: string

  @Field(() => Int, { nullable: false })
  follows!: number

  @Field(() => Boolean, { nullable: false })
  added!: boolean
}

@ObjectType()
export class ChannelUnfollowResult {
  @Field(() => String, { nullable: false })
  channelId!: string

  @Field(() => Int, { nullable: false })
  follows!: number

  @Field(() => Boolean, { nullable: false })
  removed!: boolean
}

@ObjectType()
export class ChannelReportInfo extends EntityReportInfo {
  @Field(() => String, { nullable: false })
  channelId!: string
}

@ObjectType()
export class ChannelsSearchResult {
  @Field(() => Channel, { nullable: false })
  channel!: Channel

  @Field(() => Int, { nullable: false })
  relevance!: number
}

@ArgsType()
export class ChannelsSearchArgs {
  @Field(() => String, { nullable: false })
  query!: string

  @Field(() => ChannelWhereInput, { nullable: true })
  where?: Record<string, unknown>

  @Field(() => Int, { nullable: true })
  limit?: number
}

export enum ChannelYppInputStatus {
  Suspended,
  Unverified,
  Empty,
  VerifiedBronze,
  VerifiedSilver,
  VerifiedGold,
  VerifiedDiamond,
}
registerEnumType(ChannelYppInputStatus, {
  name: 'ChannelYppInputStatus',
})

@InputType()
export class SetChannelYppStatusInput {
  @Field(() => String, { nullable: false })
  id!: string

  @Field(() => ChannelYppInputStatus, { nullable: false })
  status!: ChannelYppInputStatus
}

@ArgsType()
export class SetChannelYppStatusArgs {
  @Field(() => [SetChannelYppStatusInput], { nullable: false })
  channels!: SetChannelYppStatusInput[]

  @Field(() => Boolean, { nullable: true })
  skipNotification?: boolean
}

@ObjectType()
export class SetChannelYppStatusResult {
  @Field(() => String, { nullable: false })
  id!: string

  @Field(() => ChannelYppInputStatus, { nullable: false })
  previousStatus!: ChannelYppInputStatus

  @Field(() => ChannelYppInputStatus, { nullable: false })
  newStatus!: ChannelYppInputStatus

  @Field(() => DateTime, { nullable: true })
  timestamp?: Date

  @Field(() => Boolean, { nullable: false })
  updated!: boolean

  @Field(() => Boolean, { nullable: false })
  notificationAdded!: boolean
}

@ArgsType()
export class SetChannelYtSyncEnabledArgs {
  @Field(() => [String], { nullable: false })
  ids!: string[]

  @Field(() => Boolean, { nullable: false })
  isYtSyncEnabled!: boolean
}

@ObjectType()
export class SetChannelYtSyncEnabledResult {
  @Field(() => Int, { nullable: false })
  updatedChannels!: number
}
