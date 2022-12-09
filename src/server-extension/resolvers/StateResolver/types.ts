import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class ProcessorState {
  @Field(() => Int, { nullable: false })
  lastProcessedBlock!: number

  @Field(() => Int, { nullable: false })
  chainHead!: number
}
