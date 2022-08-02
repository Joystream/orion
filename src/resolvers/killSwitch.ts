import { Authorized, Field, Mutation, Query, Resolver, Args, ArgsType } from 'type-graphql'
import { getIsKilledDoc, KillSwitch } from '../models/KillSwitch'
import config from '../config'

@ArgsType()
class KillSwitchInput implements KillSwitch {
  @Field()
  isKilled: boolean
}

@Resolver()
export class KillSwitchResolver {
  @Query(() => KillSwitch, { nullable: false, description: 'Set killed instance' })
  async killSwitch() {
    return await getIsKilledDoc()
  }

  @Mutation(() => KillSwitch, { nullable: false })
  @Authorized(config.killerRole)
  async setKillSwitch(@Args() { isKilled }: KillSwitchInput) {
    const killSwitch = await getIsKilledDoc()
    killSwitch.isKilled = isKilled
    await killSwitch.save()
    return { isKilled }
  }
}
