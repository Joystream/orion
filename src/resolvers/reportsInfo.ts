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
import { ReportVideoInfo } from '../entities/ReportVideoInfo'
import { ReportedVideoModel, saveReportedVideo } from '../models/ReportedContent'
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
  rationale: string
}

enum VideoReportOrderByInput {
  createdAt_ASC = 'createdAt_ASC',
  createdAt_DESC = 'createdAt_DESC',
}

registerEnumType(VideoReportOrderByInput, { name: 'VideoReportOrderByInput' })

@InputType()
class VideoReportWhereInput {
  @Field(() => ID, { nullable: true })
  videoId?: string

  @Field(() => Date, { nullable: true })
  createdAt_lt?: Date

  @Field(() => Date, { nullable: true })
  createdAt_gt?: Date

  @Field({ nullable: true })
  reporterIp: string
}

@ArgsType()
class VideoReportsArgs {
  @Field(() => VideoReportWhereInput, { nullable: true })
  where: VideoReportWhereInput

  @Field(() => VideoReportOrderByInput, {
    nullable: true,
    defaultValue: VideoReportOrderByInput.createdAt_DESC,
  })
  orderBy: VideoReportOrderByInput

  @Field(() => Int, { nullable: true, defaultValue: 30 })
  limit: number

  @Field(() => Int, { nullable: true })
  skip: number
}

@Resolver()
export class ReportsInfosResolver {
  @Mutation(() => ReportVideoInfo, { description: 'Report a video' })
  @UseMiddleware(rateLimit(MAX_REPORTS_PER_HOUR))
  async reportVideo(
    @Args() { videoId, rationale }: ReportVideoArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ReportVideoInfo> {
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

  @Query(() => [ReportVideoInfo])
  @Authorized()
  async reportedVideos(
    @Args() { orderBy, where, limit, skip }: VideoReportsArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ReportVideoInfo[]> {
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
        reporterIp: ctx.remoteHost || '',
      })) || []
    )
  }
}
