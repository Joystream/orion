import { ArgsType, Field, ObjectType, Int } from 'type-graphql'
import { Video, VideoOrderByInput, VideoWhereInput } from '../baseTypes'
import { EntityReportInfo } from '../commonTypes'
import { MaxLength, Max } from 'class-validator'

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
export class CommonVideoQueryArgs {
  @Field(() => VideoWhereInput, { nullable: true })
  where?: Record<string, unknown>

  @Field(() => [VideoOrderByInput], { nullable: true })
  orderBy?: VideoOrderByInput[]

  @Field(() => Int, { nullable: true })
  limit?: number
}

@ArgsType()
export class HomepageVideoQueryArgs extends CommonVideoQueryArgs {
  @Field(() => String, { nullable: true })
  recommId?: string
}

@ArgsType()
export class SimiliarVideosQueryArgs extends CommonVideoQueryArgs {
  @Field(() => String, { nullable: true })
  videoId: string

  @Field(() => String, { nullable: true })
  recommId?: string
}

@ArgsType()
export class NextVideoQueryArgs {
  @Field(() => String, { nullable: true })
  videoId: string

  @Field(() => String, { nullable: true })
  recommId?: string

  @Field(() => VideoWhereInput, { nullable: true })
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
export class UpdateVideoViewArgs {
  @Field(() => String, { nullable: false })
  viewId!: string

  @Field(() => Int, { nullable: false })
  @Max(100, { message: 'View cannot reach over 100%' })
  percentage!: number
}

@ObjectType()
export class UpdateVideoViewResult {
  @Field(() => Boolean, { nullable: false })
  updated!: boolean
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
