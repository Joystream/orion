import { Authorized, Field, Mutation, Query, Resolver, Args, ArgsType } from 'type-graphql'
import { getAdminDoc, Admin } from '../models/Admin'
import { ADMIN_ROLE } from '../config'

@ArgsType()
class AdminInput implements Admin {
  @Field()
  isKilled: boolean
}

@Resolver()
export class AdminResolver {
  @Query(() => Admin, { nullable: false, description: 'Set killed instance' })
  async admin() {
    return await getAdminDoc()
  }

  @Mutation(() => Admin, { nullable: false })
  @Authorized(ADMIN_ROLE)
  async setKillSwitch(@Args() { isKilled }: AdminInput) {
    const killSwitch = await getAdminDoc()
    killSwitch.isKilled = isKilled
    await killSwitch.save()
    return { isKilled }
  }
}
