import {
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  ID,
  InputType,
  Int,
  MiddlewareFn,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { ChannelReportInfo, VideoReportInfo } from '../entities/EntityReportsInfo'
import { MaxLength } from 'class-validator'
import {
  ReportedChannelModel,
  ReportedVideoModel,
  saveReportedChannel,
  saveReportedVideo,
} from '../models/ReportedContent'
import { OrionContext } from '../types'

const ONE_HOUR = 60 * 60 * 1000
const MAX_REPORTS_PER_HOUR = 50

export const rateLimit: (limit: number) => MiddlewareFn<OrionContext> =
  (limit: number) =>
  async ({ context: { remoteHost } }, next) => {
    const reportsCountPerVideo = await ReportedVideoModel.count({
      reporterIp: remoteHost,
      timestamp: {
        $gte: new Date(Date.now() - ONE_HOUR),
      },
    })

    if (reportsCountPerVideo > limit) {
      throw new Error('You have exceeded the maximum number of requests per hour')
    }
    return next()
  }

@ArgsType()
class ReportVideoArgs {
  @Field(() => ID)
  videoId: string

  @Field()
  @MaxLength(400, { message: 'Rationale cannot be longer than 400 characters' })
  rationale: string
}

@ArgsType()
class ReportChannelArgs {
  @Field(() => ID)
  channelId: string

  @Field()
  @MaxLength(400, { message: 'Rationale cannot be longer than 400 characters' })
  rationale: string
}

enum VideoReportOrderByInput {
  createdAt_ASC = 'createdAt_ASC',
  createdAt_DESC = 'createdAt_DESC',
}
registerEnumType(VideoReportOrderByInput, { name: 'VideoReportOrderByInput' })

enum ChannelReportOrderByInput {
  createdAt_ASC = 'createdAt_ASC',
  createdAt_DESC = 'createdAt_DESC',
}
registerEnumType(ChannelReportOrderByInput, { name: 'ChannelReportOrderByInput' })

@InputType()
class ReportsWhereInput {
  @Field(() => Date, { nullable: true })
  createdAt_lt?: Date

  @Field(() => Date, { nullable: true })
  createdAt_gt?: Date

  @Field({ nullable: true })
  reporterIp: string
}

@ArgsType()
class ReportsArgs {
  @Field(() => Int, { nullable: true, defaultValue: 30 })
  limit: number

  @Field(() => Int, { nullable: true })
  skip: number
}

@InputType()
class VideoReportsWhereInput extends ReportsWhereInput {
  @Field(() => ID, { nullable: true })
  videoId?: string
}
@ArgsType()
class VideoReportsArgs extends ReportsArgs {
  @Field(() => VideoReportsWhereInput, { nullable: true })
  where: VideoReportsWhereInput

  @Field(() => VideoReportOrderByInput, {
    nullable: true,
    defaultValue: VideoReportOrderByInput.createdAt_DESC,
  })
  orderBy: VideoReportOrderByInput
}

@InputType()
class ChannelReportsWhereInput extends ReportsWhereInput {
  @Field(() => ID, { nullable: true })
  channelId?: string
}

@ArgsType()
class ChannelReportsArgs extends ReportsArgs {
  @Field(() => ChannelReportsWhereInput, { nullable: true })
  where: ChannelReportsWhereInput

  @Field(() => ChannelReportOrderByInput, {
    nullable: true,
    defaultValue: ChannelReportOrderByInput.createdAt_DESC,
  })
  orderBy: ChannelReportOrderByInput
}

@Resolver()
export class ReportsInfosResolver {
  @Mutation(() => VideoReportInfo, { description: 'Report a video' })
  @UseMiddleware(rateLimit(MAX_REPORTS_PER_HOUR))
  async reportVideo(
    @Args() { videoId, rationale }: ReportVideoArgs,
    @Ctx() ctx: OrionContext
  ): Promise<VideoReportInfo> {
    const createdAt = new Date()
    const reportedVideo = await saveReportedVideo({
      rationale,
      videoId,
      reporterIp: ctx.remoteHost || '',
      timestamp: createdAt,
    })

    return {
      rationale,
      videoId,
      createdAt,
      id: reportedVideo.id,
      reporterIp: ctx.remoteHost || '',
    }
  }

  @Mutation(() => ChannelReportInfo, { description: 'Report a channel' })
  @UseMiddleware(rateLimit(MAX_REPORTS_PER_HOUR))
  async reportChannel(
    @Args() { channelId, rationale }: ReportChannelArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ChannelReportInfo> {
    const createdAt = new Date()
    const reportedVideo = await saveReportedChannel({
      rationale,
      channelId,
      reporterIp: ctx.remoteHost || '',
      timestamp: createdAt,
    })

    return {
      rationale,
      channelId,
      createdAt,
      id: reportedVideo.id,
      reporterIp: ctx.remoteHost || '',
    }
  }

  @Query(() => [VideoReportInfo])
  @Authorized()
  async reportedVideos(@Args() { orderBy, where, limit, skip }: VideoReportsArgs): Promise<VideoReportInfo[]> {
    const reportedVideosDocument = await ReportedVideoModel.find({
      ...(where?.videoId ? { videoId: where?.videoId } : {}),
      ...(where?.createdAt_gt ? { timestamp: { $gte: where.createdAt_gt } } : {}),
      ...(where?.createdAt_lt ? { timestamp: { $lte: where.createdAt_lt } } : {}),
      ...(where?.reporterIp ? { reporterIp: where?.reporterIp } : {}),
    })
      .skip(skip)
      .limit(limit)
      .sort({ timestamp: orderBy.split('_').at(-1) })

    return (
      reportedVideosDocument.map((reportedVideo) => ({
        rationale: reportedVideo.rationale,
        videoId: reportedVideo.videoId,
        createdAt: reportedVideo.timestamp,
        id: reportedVideo.id,
        reporterIp: reportedVideo.reporterIp,
      })) || []
    )
  }
  @Query(() => [ChannelReportInfo])
  @Authorized()
  async reportedChannels(@Args() { orderBy, where, limit, skip }: ChannelReportsArgs): Promise<ChannelReportInfo[]> {
    const reportedChannelsDocument = await ReportedChannelModel.find({
      ...(where?.channelId ? { channelId: where?.channelId } : {}),
      ...(where?.createdAt_gt ? { timestamp: { $gte: where.createdAt_gt } } : {}),
      ...(where?.createdAt_lt ? { timestamp: { $lte: where.createdAt_lt } } : {}),
      ...(where?.reporterIp ? { reporterIp: where?.reporterIp } : {}),
    })
      .skip(skip)
      .limit(limit)
      .sort({ timestamp: orderBy.split('_').at(-1) })

    return (
      reportedChannelsDocument.map((reportedChannel) => ({
        rationale: reportedChannel.rationale,
        channelId: reportedChannel.channelId,
        createdAt: reportedChannel.timestamp,
        id: reportedChannel.id,
        reporterIp: reportedChannel.reporterIp,
      })) || []
    )
  }
}
