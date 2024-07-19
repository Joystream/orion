import { ArgsType, Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class ProcessorState {
  @Field(() => Int, { nullable: false })
  lastProcessedBlock!: number
}

@ObjectType()
export class TopInteractedEntity {
  @Field({ nullable: false })
  entityId: string

  @Field({ nullable: false })
  interactionCount: number
}

@ArgsType()
export class TopInteractedEntityArgs {
  @Field(() => String, { nullable: false })
  type: string

  @Field(() => Int, { nullable: false })
  period: number
}

@ObjectType()
export class EarningStatsOutput {
  @Field({ nullable: false })
  crtSaleVolume: string

  @Field({ nullable: false })
  totalRewardsPaid: string

  @Field({ nullable: false })
  nftSaleVolume: string
}
