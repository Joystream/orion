import { Args, ArgsType, Authorized, Field, Mutation, Query, Resolver } from 'type-graphql'
import { Admin, GeneratedSignature, getAdminDoc } from '../models/Admin'
import config, { ADMIN_ROLE } from '../config'
import { ed25519Sign } from '@polkadot/util-crypto'
import { u8aToHex, hexToU8a, isHex } from '@polkadot/util'
import { generateAppActionCommitment } from '@joystream/js/utils'
import { createType } from '@joystream/types'

@ArgsType()
class AdminInput implements Admin {
  @Field()
  isKilled: boolean
}

@ArgsType()
class AppActionSignatureInput {
  @Field()
  nonce: number
  @Field()
  creatorId: string
  @Field({ description: 'Hex string from UInt8Array' })
  assets: string
  @Field({ description: 'Hex string from UInt8Array' })
  rawAction: string
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
  async signAppActionCommitment(
    // FIXME: In the initial implementation we don't verify the nonce, but this should be changed in the future
    @Args() { nonce, rawAction, assets, creatorId }: AppActionSignatureInput
  ) {
    if (!isHex(assets) || !isHex(rawAction)) {
      throw new Error('One of input is not hex: assets, rawAction')
    }

    const message = generateAppActionCommitment(
      nonce,
      `m:${creatorId}`,
      hexToU8a(assets),
      createType('Bytes', rawAction)
    )
    const signature = ed25519Sign(message, config.appKeypair)
    return { signature: u8aToHex(signature) }
  }
}
