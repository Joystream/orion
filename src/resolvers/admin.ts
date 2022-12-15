import { Arg, Args, ArgsType, Authorized, Field, Mutation, Query, Resolver } from 'type-graphql'
import { Admin, GeneratedSignature, getAdminDoc } from '../models/Admin'
import config, { ADMIN_ROLE } from '../config'
import { cryptoIsReady, base64Encode, sr25519Sign, sr25519PairFromSeed } from '@polkadot/util-crypto'

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
  async generateSignature(@Arg('bytes', () => String) bytes: string) {
    if (!config.appPrivateKey) throw new Error('No PRIVATE_KEY provided to generate signature')

    if (!cryptoIsReady()) {
      throw new Error('@polkadot/util-crypto is not ready')
    }

    const keypair = sr25519PairFromSeed(config.appPrivateKey)
    const key = sr25519Sign(bytes, keypair)

    return { signature: base64Encode(key) }
  }
}
