import {
  DataObjectTypeChannelAvatar,
  DataObjectTypeChannelCoverPhoto,
  DataObjectTypeVideoMedia,
  DataObjectTypeVideoSubtitle,
  DataObjectTypeVideoThumbnail,
} from '../../model'

export const ASSET_TYPES = {
  channel: [
    {
      DataObjectTypeConstructor: DataObjectTypeChannelCoverPhoto,
      metaFieldName: 'coverPhoto',
      schemaFieldName: 'coverPhoto',
    },
    {
      DataObjectTypeConstructor: DataObjectTypeChannelAvatar,
      metaFieldName: 'avatarPhoto',
      schemaFieldName: 'avatarPhoto',
    },
  ],
  video: [
    {
      DataObjectTypeConstructor: DataObjectTypeVideoMedia,
      metaFieldName: 'video',
      schemaFieldName: 'media',
    },
    {
      DataObjectTypeConstructor: DataObjectTypeVideoThumbnail,
      metaFieldName: 'thumbnailPhoto',
      schemaFieldName: 'thumbnailPhoto',
    },
  ],
  subtitle: {
    DataObjectTypeConstructor: DataObjectTypeVideoSubtitle,
    metaFieldName: 'newAsset',
    schemaFieldName: 'asset',
  },
} as const
