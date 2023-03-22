import { Args, ArgsType, Authorized, Field, Mutation, Query, Resolver, registerEnumType } from 'type-graphql'
import { Admin, GeneratedSignature, getAdminDoc } from '../models/Admin'
import config, { ADMIN_ROLE } from '../config'
import { ed25519Sign } from '@polkadot/util-crypto'
import { u8aToHex, hexToU8a, isHex } from '@polkadot/util'
import { generateAppActionCommitment } from '@joystream/js/utils'
import { AppAction } from '@joystream/metadata-protobuf'

@ArgsType()
class AdminInput implements Admin {
  @Field()
  isKilled: boolean
}

registerEnumType(AppAction.ActionType, { name: 'AppActionActionType' })

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
  @Field(() => AppAction.ActionType)
  actionType: AppAction.ActionType
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
    // FIXME: In the initial implementation we require the user to provide the nonce
    // and don't verify it in any way, but this should be changed in the future
    @Args() { nonce, rawAction, assets, creatorId, actionType }: AppActionSignatureInput
  ) {
    if (!isHex(assets) || !isHex(rawAction)) {
      throw new Error('One of input is not hex: assets, rawAction')
    }

    const message = generateAppActionCommitment(
      nonce,
      `${creatorId}`,
      actionType,
      actionType === AppAction.ActionType.CREATE_CHANNEL
        ? AppAction.CreatorType.MEMBER // only members are supported as channel owners for now
        : AppAction.CreatorType.CHANNEL,
      hexToU8a(assets),
      hexToU8a(rawAction)
    )
    const signature = ed25519Sign(message, config.appKeypair)
    return { signature: u8aToHex(signature) }
  }
}
