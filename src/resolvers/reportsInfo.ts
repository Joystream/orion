import {
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
} from 'type-graphql'
import { ReportVideoInfo } from '../entities/ReportVideoInfo'
import { ReportedVideoModel, saveReportedVideo } from '../models/ReportedContent'
import { OrionContext } from '../types'

@ArgsType()
class ReportVideoArgs {
  @Field(() => ID)
  videoId: string

  @Field()
  rationale: string
}

enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(Order, { name: 'Order' })

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

  @Field(() => Order, { nullable: true, defaultValue: Order.DESC })
  order: Order

  @Field(() => Int, { nullable: true, defaultValue: 30 })
  limit: number

  @Field(() => Int, { nullable: true })
  skip: number
}

@Resolver()
export class ReportsInfosResolver {
  @Mutation(() => ReportVideoInfo, { description: 'Report a video' })
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
    @Args() { order, where, limit, skip }: VideoReportsArgs,
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
      .sort({ timestamp: order })

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
