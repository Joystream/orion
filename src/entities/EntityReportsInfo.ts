import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class EntityReportInfo {
  @Field(() => ID)
  id: string

  @Field()
  rationale: string

  @Field()
  createdAt: Date

  @Field()
  reporterIp: string
}

@ObjectType()
export class VideoReportInfo extends EntityReportInfo {
  @Field(() => ID)
  videoId: string
}

@ObjectType()
export class ChannelReportInfo extends EntityReportInfo {
  @Field(() => ID)
  channelId: string
}
