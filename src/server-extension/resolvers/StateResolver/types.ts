import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class ProcessorState {
  @Field(() => Int, { nullable: false })
  lastProcessedBlock!: number
}
