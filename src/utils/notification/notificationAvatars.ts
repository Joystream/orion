import { EntityManager } from 'typeorm'
import { Channel, MemberMetadata, StorageDataObject } from '../../model'
import { ConfigVariable, config } from '../config'

export const getNotificationAvatar = async (
  em: EntityManager,
  type: 'channelId' | 'membershipId',
  param: string
): Promise<string> => {
  switch (type) {
    case 'channelId': {
      const channel = await em.getRepository(Channel).findOneBy({ id: param })

      if (!channel?.avatarPhotoId) break

      const avatar = await em
        .getRepository(StorageDataObject)
        .findOneBy({ id: channel.avatarPhotoId })

      if (!avatar || !avatar.isAccepted || !avatar.resolvedUrls[0]) break

      return avatar.resolvedUrls[0]
    }

    case 'membershipId': {
      const member = await em.getRepository(MemberMetadata).findOneBy({ id: param })
      const avatar = member?.avatar

      // AvatarObject is not yet supported
      if (!avatar || avatar.isTypeOf !== 'AvatarUri') break

      return avatar.avatarUri
    }
  }

  // Fallback to a placeholder
  const notificationAssetRoot = await config.get(ConfigVariable.AppAssetStorage, em)
  return `${notificationAssetRoot}/placeholder/avatar.png`
}
