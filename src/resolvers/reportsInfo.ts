import { Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver } from 'type-graphql'
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

@Resolver()
export class ReportsInfosResolver {
  @Mutation(() => ReportVideoInfo, { description: 'Report a video' })
  async reportVideo(
    @Args() { videoId, rationale }: ReportVideoArgs,
    @Ctx() ctx: OrionContext
  ): Promise<ReportVideoInfo> {
    saveReportedVideo({
      rationale,
      videoId,
      reporterIp: ctx.remoteHost || ' ',
      timestamp: new Date(),
    })

    return {
      rationale,
      videoId,
    }
  }
  @Query(() => [ReportVideoInfo], { description: 'Report a video' })
  async reportedVideos(): Promise<ReportVideoInfo[]> {
    const reportedVideosDocument = await ReportedVideoModel.find()

    return (
      reportedVideosDocument.map((reportedVideo) => ({
        rationale: reportedVideo.rationale,
        videoId: reportedVideo.videoId,
      })) || []
    )
  }
}
