import { EntityManager } from 'typeorm'
import { Channel, MemberMetadata } from '../../model'
import { ConfigVariable, config } from '../config'

export const getNotificationAvatar = async (
  em: EntityManager,
  type: 'channelId' | 'membershipId',
  param: string
): Promise<string> => {
  if (type === 'channelId') {
    const channel = await em.getRepository(Channel).findOneBy({ id: param })
    const avatar = channel?.avatarPhoto

    if (!avatar || !avatar.isAccepted || !avatar.resolvedUrls[0]) {
      const notificationAssetRoot = await config.get(ConfigVariable.AppAssetStorage, em)
      return `${notificationAssetRoot}/placeholder/avatar.png`
    }

    return avatar.resolvedUrls[0]
  }

  const member = await em.getRepository(MemberMetadata).findOneBy({ id: param })
  const avatar = member?.avatar

  // AvatarObject is not yet supported
  if (!avatar || avatar.isTypeOf === 'AvatarObject') {
    const notificationAssetRoot = await config.get(ConfigVariable.AppAssetStorage, em)
    return `${notificationAssetRoot}/placeholder/avatar.png`
  }

  return avatar.avatarUri
}
