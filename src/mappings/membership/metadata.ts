import { IMemberRemarked, IMembershipMetadata, MemberRemarked } from '@joystream/metadata-protobuf'
import { AvatarUri, MemberMetadata, MetaprotocolTransactionResult } from '../../model'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { isSet } from '@joystream/metadata-protobuf/utils'
import { EntityManagerOverlay } from '../../utils/overlay'
import { metaprotocolTransactionFailure } from '../utils'
import {
  processCreateCommentMessage,
  processCreateVideoCategoryMessage,
  processDeleteCommentMessage,
  processEditCommentMessage,
  processReactCommentMessage,
  processReactVideoMessage,
} from '../content/commentsAndReactions'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { processCreateAppMessage, processUpdateAppMessage } from '../content/app'
import { processChannelPaymentFromMember } from '../content/metadata'

export async function processMembershipMetadata(
  overlay: EntityManagerOverlay,
  memberId: string,
  metadataUpdate: DecodedMetadataObject<IMembershipMetadata>
) {
  const metadataRepository = overlay.getRepository(MemberMetadata)
  const memberMetadata =
    (await metadataRepository.getById(memberId)) ||
    metadataRepository.new({ id: memberId, memberId })

  if (isSet(metadataUpdate.avatarUri)) {
    memberMetadata.avatar = metadataUpdate.avatarUri
      ? new AvatarUri({ avatarUri: metadataUpdate.avatarUri })
      : null
  }

  if (isSet(metadataUpdate.name)) {
    // On empty string, set to `null`
    memberMetadata.name = metadataUpdate.name || null
  }

  if (isSet(metadataUpdate.about)) {
    // On empty string, set to `null`
    memberMetadata.about = metadataUpdate.about || null
  }
}

export async function processMemberRemark(
  overlay: EntityManagerOverlay,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  memberId: string,
  decodedMessage: DecodedMetadataObject<IMemberRemarked>,
  payment?: [string, bigint]
): Promise<MetaprotocolTransactionResult> {
  if (decodedMessage.createApp) {
    return processCreateAppMessage(
      overlay,
      block.height,
      indexInBlock,
      decodedMessage.createApp,
      memberId
    )
  }

  if (decodedMessage.updateApp) {
    return processUpdateAppMessage(overlay, decodedMessage.updateApp, memberId)
  }

  if (decodedMessage.reactVideo) {
    return processReactVideoMessage(
      overlay,
      block,
      indexInBlock,
      txHash,
      memberId,
      decodedMessage.reactVideo
    )
  }

  if (decodedMessage.reactComment) {
    return processReactCommentMessage(
      overlay,
      block,
      indexInBlock,
      txHash,
      memberId,
      decodedMessage.reactComment
    )
  }

  if (decodedMessage.createComment) {
    return processCreateCommentMessage(
      overlay,
      block,
      indexInBlock,
      txHash,
      memberId,
      decodedMessage.createComment
    )
  }

  if (decodedMessage.editComment) {
    return processEditCommentMessage(
      overlay,
      block,
      indexInBlock,
      txHash,
      memberId,
      decodedMessage.editComment
    )
  }

  if (decodedMessage.deleteComment) {
    return processDeleteCommentMessage(overlay, memberId, decodedMessage.deleteComment)
  }

  // Though the payments can be sent along with any arbitrary metadata message type,
  // however they will only be processed if the message type is 'makeChannelPayment'
  if (decodedMessage.makeChannelPayment) {
    if (!payment) {
      return metaprotocolTransactionFailure(
        MemberRemarked,
        `payment info should be set when sending remark with 'makeChannelPayment' message type`,
        { decodedMessage }
      )
    }

    return processChannelPaymentFromMember(
      overlay,
      block,
      indexInBlock,
      txHash,
      decodedMessage.makeChannelPayment,
      memberId,
      payment
    )
  }

  if (decodedMessage.createVideoCategory) {
    return processCreateVideoCategoryMessage(
      overlay,
      block,
      indexInBlock,
      decodedMessage.createVideoCategory
    )
  }

  // unknown message type
  return metaprotocolTransactionFailure(MemberRemarked, 'Unsupported remark action', {
    decodedMessage,
  })
}
