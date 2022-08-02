import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'
import { ArgsType, ObjectType, Field } from 'type-graphql'

@ObjectType()
@ArgsType()
export class KillSwitch {
  @prop({ required: true })
  @Field()
  isKilled: boolean
}

export const IsKilledModel = getModelForClass(KillSwitch, { schemaOptions: { collection: 'isKilled' } })

export const getIsKilledDoc = async (): Promise<DocumentType<KillSwitch>> => {
  const document = await IsKilledModel.findOne()
  if (!document) {
    return await IsKilledModel.create({ isKilled: false })
  }
  return document
}
