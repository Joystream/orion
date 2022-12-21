import { IMemberRemarked, IMembershipMetadata, MemberRemarked } from '@joystream/metadata-protobuf'
import { AvatarUri, MemberMetadata, Membership, MetaprotocolTransactionResult } from '../../model'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { isSet } from '@joystream/metadata-protobuf/utils'
import { EntitiesCollector } from '../../utils/EntitiesCollector'
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

export function processMembershipMetadata(
  ec: EntitiesCollector,
  member: Membership,
  metadata: DecodedMetadataObject<IMembershipMetadata>
) {
  if (!member.metadata) {
    member.metadata = new MemberMetadata({ id: member.id, member })
  }

  if (isSet(metadata.avatarUri)) {
    member.metadata.avatar = metadata.avatarUri
      ? new AvatarUri({ avatarUri: metadata.avatarUri })
      : null
  }

  if (isSet(metadata.name)) {
    // On empty string, set to `null`
    member.metadata.name = metadata.name || null
  }

  if (isSet(metadata.about)) {
    // On empty string, set to `null`
    member.metadata.about = metadata.about || null
  }

  ec.collections.MemberMetadata.push(member.metadata)
}

export async function processMemberRemark(
  ec: EntitiesCollector,
  block: SubstrateBlock,
  indexInBlock: number,
  txHash: string | undefined,
  memberId: string,
  decodedMessage: DecodedMetadataObject<IMemberRemarked>
): Promise<MetaprotocolTransactionResult> {
  if (decodedMessage.reactVideo) {
    return processReactVideoMessage(ec, block, memberId, decodedMessage.reactVideo)
  }

  if (decodedMessage.reactComment) {
    return processReactCommentMessage(ec, memberId, decodedMessage.reactComment)
  }

  if (decodedMessage.createComment) {
    return processCreateCommentMessage(
      ec,
      block,
      indexInBlock,
      txHash,
      memberId,
      decodedMessage.createComment
    )
  }

  if (decodedMessage.editComment) {
    return processEditCommentMessage(
      ec,
      block,
      indexInBlock,
      txHash,
      memberId,
      decodedMessage.editComment
    )
  }

  if (decodedMessage.deleteComment) {
    return processDeleteCommentMessage(ec, memberId, decodedMessage.deleteComment)
  }

  if (decodedMessage.createVideoCategory) {
    return processCreateVideoCategoryMessage(
      ec,
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
