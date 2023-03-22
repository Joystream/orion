import { ArgsType, Field, ObjectType } from 'type-graphql'
import { MaxLength } from 'class-validator'
import { DateTime } from '@subsquid/graphql-server'

@ArgsType()
export class RequestFeaturedNftArgs {
  @Field(() => String, { nullable: false })
  nftId!: string

  @Field(() => String, { nullable: false })
  @MaxLength(400, { message: 'Rationale cannot be longer than 400 characters' })
  rationale!: string
}

@ObjectType()
export class NftFeaturedRequstInfo {
  @Field(() => String, { nullable: false })
  nftId!: string

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
