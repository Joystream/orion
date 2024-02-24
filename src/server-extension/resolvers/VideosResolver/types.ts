import { MaxLength } from 'class-validator'
import { ArgsType, Field, Int, ObjectType } from 'type-graphql'
import { Video, VideoOrderByInput, VideoWhereInput } from '../baseTypes'
import { EntityReportInfo } from '../commonTypes'

@ObjectType()
export class VideosSearchResult {
  @Field(() => Video, { nullable: false })
  video!: Video

  @Field(() => Int, { nullable: false })
  relevance!: number
}

@ArgsType()
export class VideosSearchArgs {
  @Field(() => String, { nullable: false })
  query!: string

  @Field(() => VideoWhereInput, { nullable: true })
  where?: Record<string, unknown>

  @Field(() => Int, { nullable: true })
  limit?: number
}

@ArgsType()
export class VideosConnectionArgs {
  @Field(() => String, { nullable: true })
  after?: string

  @Field(() => Int, { nullable: true })
  first?: number

  @Field(() => [VideoOrderByInput], { nullable: false })
  orderBy!: VideoOrderByInput[]

  @Field(() => VideoWhereInput, { nullable: true, simple: true })
  where?: Record<string, unknown>
}

@ArgsType()
export class MostViewedVideosConnectionArgs extends VideosConnectionArgs {
  @Field(() => Int, { nullable: true })
  periodDays?: number

  @Field(() => Int, { nullable: false })
  limit!: number
}

@ObjectType()
export class VideoReportInfo extends EntityReportInfo {
  @Field(() => String, { nullable: false })
  videoId!: string
}

@ObjectType()
export class AddVideoViewResult {
  @Field(() => String, { nullable: false })
  videoId!: string

  @Field(() => String, { nullable: false })
  viewId!: string

  @Field(() => Int, { nullable: false })
  viewsNum!: number

  @Field(() => Boolean, { nullable: false })
  added!: boolean
}

@ArgsType()
export class ReportVideoArgs {
  @Field(() => String, { nullable: false })
  videoId!: string

  @Field(() => String, { nullable: false })
  @MaxLength(400, { message: 'Rationale cannot be longer than 400 characters' })
  rationale!: string
}

@ArgsType()
export class ExcludeVideoArgs {
  @Field(() => String, { nullable: false })
  videoId!: string

  @Field(() => String, { nullable: false })
  @MaxLength(400, { message: 'Rationale cannot be longer than 400 characters' })
  rationale!: string
}

@ObjectType()
export class ExcludeVideoInfo extends EntityReportInfo {
  @Field(() => String, { nullable: false })
  videoId!: string
}

@ArgsType()
export class DumbPublicFeedArgs {
  @Field(() => VideoWhereInput, { nullable: true })
  where?: Record<string, unknown>

  @Field(() => Int, {
    nullable: true,
    defaultValue: 100,
    description: 'The number of videos to return',
  })
  limit?: number
}

@ArgsType()
export class SetPublicFeedArgs {
  @Field(() => [String], { nullable: false })
  videoIds!: string[]
}

@ObjectType()
export class SetPublicFeedResult {
  @Field(() => Int)
  numberOfEntitiesAffected!: number
}
