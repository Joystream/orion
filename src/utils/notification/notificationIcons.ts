import { EntityManager } from 'typeorm'
import { ConfigVariable, config } from '../config'

type NotificationIconType =
  | 'like'
  | 'dislike'
  | 'follow'
  | 'warning'
  | 'bell'
  | 'nft'
  | 'nft-alt'
  | 'payout'
  | 'reaction'
  | 'video'

export const getNotificationIcon = async (
  em: EntityManager,
  icon: NotificationIconType
): Promise<string> => {
  const notificationAssetRoot = await config.get(ConfigVariable.AppAssetStorage, em)
  return `${notificationAssetRoot}/icons/${icon}.png`
}
