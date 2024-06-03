import { MaxLength, Max } from 'class-validator'
import { ArgsType, Field, Int, ObjectType, registerEnumType } from 'type-graphql'
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

  @Field(() => [String], {
    nullable: true,
    description:
      'The list of video ids to skip/exclude from the public feed videos. Maybe because they are already shown to the user.',
  })
  skipVideoIds!: string[]

  @Field(() => Int, {
    nullable: true,
    defaultValue: 100,
    description: 'The number of videos to return',
  })
  limit?: number
}

export enum PublicFeedOperationType {
  SET = 'set',
  UNSET = 'unset',
}
registerEnumType(PublicFeedOperationType, { name: 'PublicFeedOperationType' })

@ArgsType()
export class SetOrUnsetPublicFeedArgs {
  @Field(() => [String], { nullable: false })
  videoIds!: string[]

  @Field(() => PublicFeedOperationType, {
    nullable: false,
    description: 'Type of operation to perform',
  })
  operation: PublicFeedOperationType
}

@ObjectType()
export class SetOrUnsetPublicFeedResult {
  @Field(() => Int)
  numberOfEntitiesAffected!: number
}
