import 'reflect-metadata'
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import {
  MostViewedVideosConnectionArgs,
  ReportVideoArgs,
  VideoReportInfo,
  VideosSearchArgs,
  VideosSearchResult,
} from './types'
import { Video, VideosConnection } from '../baseTypes'

@Resolver()
export class VideosResolver {
  // Set by depenency injection
  constructor(private tx: () => Promise<EntityManager>) {}

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

  @Mutation(() => Video)
  async addVideoView(
    @Arg('videoId', () => String, { nullable: false }) videoId: string
  ): Promise<Video> {
    // TODO: Implement
    return { id: '0' }
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
