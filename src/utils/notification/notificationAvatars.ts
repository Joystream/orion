import { memoize } from 'lodash'
import { EntityManager } from 'typeorm'

import { Channel, MemberMetadata, StorageDataObject } from '../../model'
import { getAssetUrls } from '../../server-extension/resolvers/AssetsResolver/utils'
import { ConfigVariable, config } from '../config'

export const getNotificationAvatar = memoize(
  async (em: EntityManager, type: 'channelId' | 'membershipId', id: string): Promise<string> => {
    switch (type) {
      case 'channelId': {
        const channel = await em.getRepository(Channel).findOneBy({ id })
        const objectId = channel?.avatarPhotoId
        if (!objectId) break

        const object = await em.getRepository(StorageDataObject).findOneBy({ id: objectId })
        const avatarUrls = await getAssetUrls(objectId, object?.storageBagId, { limit: 1 })
        if (!avatarUrls?.[0]) break

        return avatarUrls[0]
      }

      case 'membershipId': {
        const member = await em.getRepository(MemberMetadata).findOneBy({ id })
        const avatar = member?.avatar

        // AvatarObject is not yet supported
        if (!avatar || avatar.isTypeOf !== 'AvatarUri') break

        return avatar.avatarUri
      }
    }

    // Fallback to a placeholder
    const notificationAssetRoot = await config.get(ConfigVariable.AppAssetStorage, em)
    return `${notificationAssetRoot}/placeholder/avatar.png`
  },
  (_, type, id) => `${type}:${id}`
)
