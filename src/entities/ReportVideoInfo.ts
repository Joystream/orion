import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class ReportVideoInfo {
  @Field(() => ID)
  videoId: string

  @Field()
  rationale: string
}
