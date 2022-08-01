import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class ReportVideoInfo {
  @Field(() => ID)
  id: string

  @Field(() => ID)
  videoId: string

  @Field()
  rationale: string

  @Field()
  createdAt: Date

  @Field()
  reporterIp: string
}
