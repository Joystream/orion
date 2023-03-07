import { ArgsType, Field, ObjectType } from 'type-graphql'
import { MaxLength } from 'class-validator'
import { EntityReportInfo } from '../commonTypes'

@ArgsType()
export class RequestFeaturedNftArgs {
  @Field(() => String, { nullable: false })
  nftId!: string

  @Field(() => String, { nullable: false })
  @MaxLength(400, { message: 'Rationale cannot be longer than 400 characters' })
  rationale!: string
}

@ObjectType()
export class NftFeaturedRequstInfo extends EntityReportInfo {
  @Field(() => String, { nullable: false })
  nftId!: string
}
