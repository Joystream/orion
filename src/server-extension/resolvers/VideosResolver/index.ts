import 'reflect-metadata'
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { EntityManager, MoreThan } from 'typeorm'
import {
  AddVideoViewResult,
  MostViewedVideosConnectionArgs,
  ReportVideoArgs,
  VideoReportInfo,
  VideosSearchArgs,
  VideosSearchResult,
} from './types'
import { VideosConnection } from '../baseTypes'
import { Context } from '@subsquid/openreader/lib/context'
import { VideoViewEvent, Video } from '../../../model'

// How much time has to pass before a video view from the same ip
// will be considered a new view
const SAME_IP_VIDEO_VIEW_IGNORE_TIME = 24 * 60 * 60 * 1000 // one day

@Resolver()
export class VideosResolver {
  // Set by depenency injection
  constructor(private em: () => Promise<EntityManager>) {}

  @Query(() => [VideosSearchResult!])
  async searchVideos(@Args() args: VideosSearchArgs): Promise<VideosSearchResult[]> {
    // TODO: Implement
    return []
  }

  @Query(() => VideosConnection)
  async mostViewedVideosConnection(
    @Args() args: MostViewedVideosConnectionArgs
  ): Promise<VideosConnection> {
    // TODO: Implement
    return {
      totalCount: 0,
    }
  }

  @Mutation(() => AddVideoViewResult)
  async addVideoView(
    @Arg('videoId', () => String, { nullable: false }) videoId: string,
    @Ctx() ctx: Context
  ): Promise<AddVideoViewResult> {
    const em = await this.em()
    const ip = ctx.req.ip
    return em.transaction(async (em) => {
      // Check if the video actually exists & lock it for update
      const video = await em.findOne(Video, {
        where: { id: videoId },
        lock: { mode: 'pessimistic_write' },
      })
      if (!video) {
        throw new Error(`Video by id ${videoId} does not exist`)
      }
      // See if there is already a recent view of this video by this ip
      const recentView = await em.findOne(VideoViewEvent, {
        where: {
          ip,
          video: { id: videoId },
          timestamp: MoreThan(new Date(Date.now() - SAME_IP_VIDEO_VIEW_IGNORE_TIME)),
        },
      })
      // If so - just return the result
      if (recentView) {
        return {
          videoId,
          viewsNum: video.viewsNum,
          viewId: recentView.id,
          added: false,
        }
      }
      // Otherwise create a new VideoViewEvent and increase the videoViews counter
      video.viewsNum += 1
      const newView = new VideoViewEvent({
        ip,
        timestamp: new Date(),
        video,
      })
      await em.save([video, newView])
      return {
        videoId,
        viewsNum: video.viewsNum,
        viewId: newView.id,
        added: true,
      }
    })
  }

  @Mutation(() => VideoReportInfo)
  async reportVideo(@Args() args: ReportVideoArgs): Promise<VideoReportInfo> {
    // TODO: Implement
    return {
      id: '0',
      videoId: args.videoId,
      createdAt: new Date(),
      rationale: args.rationale,
      reporterIp: '127.0.0.1',
    }
  }
}
