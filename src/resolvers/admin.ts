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
  @Field({ description: 'Hex string from UInt8Array', nullable: true })
  assets?: string
  @Field({ description: 'Hex string from UInt8Array', nullable: true })
  rawAction?: string
  @Field({ description: 'Hex string from UInt8Array', nullable: true })
  rawAppActionMetadata?: string
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
    @Args() { rawAppActionMetadata, rawAction, assets, creatorId, nonce }: AppActionSignatureInput
  ) {
    if (
      (assets && !isHex(assets)) ||
      (rawAction && !isHex(rawAction)) ||
      (rawAppActionMetadata && !isHex(rawAppActionMetadata))
    ) {
      throw new Error('One of input is not hex: assets, rawAction, rawAppActionMetadata')
    }
    const message = generateAppActionCommitment(
      nonce,
      creatorId,
      hexToU8a(assets),
      rawAction ? createType('Bytes', rawAction) : undefined,
      rawAppActionMetadata ? createType('Bytes', rawAppActionMetadata) : undefined
    )
    const signature = ed25519Sign(message, config.appKeypair)
    return { signature: u8aToHex(signature) }
  }
}
