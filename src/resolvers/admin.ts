import { Arg, Args, ArgsType, Authorized, Field, Mutation, Query, Resolver } from 'type-graphql'
import { Admin, GeneratedSignature, getAdminDoc } from '../models/Admin'
import config, { ADMIN_ROLE } from '../config'
import { sr25519Sign } from '@polkadot/util-crypto'

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

  @Mutation(() => GeneratedSignature)
  async signAppActionCommitment(@Arg('message', () => String) message: string) {
    const signature = sr25519Sign(message, config.appKeypair)
    return { signature: Buffer.from(signature).toString('hex') }
  }
}
