import {
  Event,
  MetaprotocolTransactionResultFailed,
  MetaprotocolTransactionStatusEventData,
} from '../../model'
import { EventHandlerContext } from '../../utils/events'
import { LeadRemarked } from '@joystream/metadata-protobuf'
import { deserializeMetadata, genericEventFields } from '../utils'
import { processLeadRemark } from './metadata'

export async function processLeadRemarkedEvent({
  overlay,
  block,
  indexInBlock,
  extrinsicHash,
  event: { asV1000: message },
}: EventHandlerContext<'ContentWorkingGroup.LeadRemarked'>) {
  const metadata = deserializeMetadata(LeadRemarked, message)
  const result = metadata
    ? await processLeadRemark(overlay, block, indexInBlock, metadata)
    : new MetaprotocolTransactionResultFailed({
        errorMessage: 'Could not decode the metadata',
      })
  const eventRepository = overlay.getRepository(Event)
  eventRepository.new({
    ...genericEventFields(overlay, block, indexInBlock, extrinsicHash),
    data: new MetaprotocolTransactionStatusEventData({
      result,
    }),
  })
}
