import { IMembershipMetadata } from '@joystream/metadata-protobuf'
import { AvatarUri, MemberMetadata, Membership } from '../../model'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { isSet } from '@joystream/metadata-protobuf/utils'
import { EntitiesCollector } from '../../utils'

export function processMembershipMetadata(
  ec: EntitiesCollector,
  member: Membership,
  metadata: DecodedMetadataObject<IMembershipMetadata>
) {
  if (!member.metadata) {
    member.metadata = new MemberMetadata({ id: member.id, member })
  }

  if (isSet(metadata.avatarUri)) {
    member.metadata.avatar = new AvatarUri({ avatarUri: metadata.avatarUri })
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
