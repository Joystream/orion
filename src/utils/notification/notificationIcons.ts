import { EntityManager } from 'typeorm'

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

// TODO get the notifiaction url from `await config.get(ConfigVariable.NotificationAssetRoot, em)`
const NOTIFICATION_ASSET_ROOT =
  'https://raw.githubusercontent.com/Joystream/atlas-notification-assets/main/icons'
export const getNotificationIcon = async (
  em: EntityManager,
  icon: NotificationIconType
): Promise<string> => `${NOTIFICATION_ASSET_ROOT}/${icon}.png`
