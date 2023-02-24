import { Field, ObjectType } from 'type-graphql'
import { DateTime } from '@subsquid/graphql-server'

@ObjectType()
export class EntityReportInfo {
  @Field(() => String, { nullable: false })
  id!: string

  @Field(() => String, { nullable: false })
  rationale!: string

  @Field(() => DateTime, { nullable: false })
  createdAt!: Date

  @Field(() => String, { nullable: false })
  reporterIp!: string

  @Field(() => Boolean, { nullable: false })
  created!: boolean
}
