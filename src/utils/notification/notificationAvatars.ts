import { EntityManager } from 'typeorm'
import { Channel, MemberMetadata, Membership } from '../../model'

const PLACEHOLDER = 'https://example.com/avatar.png'

export const getNotificationAvatar = async (
  em: EntityManager,
  type: 'channelId' | 'membershipId' | 'membershipHandle',
  param: string
): Promise<string> => {
  if (type === 'channelId') {
    const channel = await em.getRepository(Channel).findOneBy({ id: param })
    const avatar = channel?.avatarPhoto

    if (!avatar || !avatar.isAccepted || !avatar.resolvedUrls[0]) {
      return PLACEHOLDER
    }

    return avatar.resolvedUrls[0]
  }

  const id =
    type === 'membershipId'
      ? param
      : (await em.getRepository(Membership).findOneBy({ handle: param }))?.id

  const member = id ? await em.getRepository(MemberMetadata).findOneBy({ id }) : undefined
  const avatar = member?.avatar

  // AvatarObject is not yet supported
  if (!avatar || avatar.isTypeOf === 'AvatarObject') {
    return PLACEHOLDER
  }

  return avatar.avatarUri
}
