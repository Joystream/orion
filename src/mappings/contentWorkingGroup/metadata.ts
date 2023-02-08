import { ILeadRemarked, LeadRemarked } from '@joystream/metadata-protobuf'
import { MetaprotocolTransactionResult } from '../../model'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { EntityManagerOverlay } from '../../utils/overlay'
import { metaprotocolTransactionFailure } from '../utils'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import {
  processCreateAppMessage,
  processDeleteAppMessage,
  processUpdateAppMessage,
} from '../content/app'

export async function processLeadRemark(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  decodedMessage: DecodedMetadataObject<ILeadRemarked>
): Promise<MetaprotocolTransactionResult> {
  if (decodedMessage.createApp) {
    return processCreateAppMessage(overlay, block.height, indexInBlock, decodedMessage.createApp)
  }

  if (decodedMessage.updateApp) {
    return processUpdateAppMessage(overlay, decodedMessage.updateApp)
  }

  if (decodedMessage.deleteApp) {
    return processDeleteAppMessage(overlay, decodedMessage.deleteApp)
  }

  // unknown message type
  return metaprotocolTransactionFailure(LeadRemarked, 'Unsupported remark action', {
    decodedMessage,
  })
}
