import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'
import { ArgsType, ObjectType, Field } from 'type-graphql'

@ObjectType()
@ArgsType()
export class Admin {
  @prop({ required: true })
  @Field()
  isKilled: boolean
}

@ObjectType()
@ArgsType()
export class GeneratedSignature {
  @Field()
  signature: string
}

export const AdminModel = getModelForClass(Admin, { schemaOptions: { collection: 'admin' } })

export const getAdminDoc = async (): Promise<DocumentType<Admin>> => {
  const document = await AdminModel.findOne()
  if (!document) {
    return await AdminModel.create({ isKilled: false })
  }
  return document
}
