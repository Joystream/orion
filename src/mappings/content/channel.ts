import { Channel, Membership } from '../../model'
import { deserializeMetadata } from '../utils'
import { ChannelMetadata } from '@joystream/metadata-protobuf'
import { processChannelMetadata } from './metadata'
import { encodeAddress } from '@polkadot/util-crypto'
import { EventHandlerContext } from '../../utils'

export async function processChannelCreatedEvent({
  ec,
  block,
  event: {
    asV1000: [
      channelId,
      { owner, dataObjects, channelStateBloatBond },
      channelCreationParameters,
      rewardAccount,
    ],
  },
}: EventHandlerContext<'Content.ChannelCreated'>) {
  // create entity
  const channel = new Channel({
    id: channelId.toString(),
    isCensored: false,
    createdAt: new Date(block.timestamp),
    createdInBlock: block.height,
    ownerMember:
      owner.__kind === 'Member' ? new Membership({ id: owner.value.toString() }) : undefined,
    rewardAccount: encodeAddress(rewardAccount),
    channelStateBloatBond: channelStateBloatBond.amount,
    followsNum: 0,
    videoViewsNum: 0,
  })

  // deserialize & process metadata
  if (channelCreationParameters.meta !== undefined) {
    const metadata = deserializeMetadata(ChannelMetadata, channelCreationParameters.meta) || {}
    await processChannelMetadata(ec, block, channel, metadata, dataObjects)
  }

  ec.collections.Channel.push(channel)
}
