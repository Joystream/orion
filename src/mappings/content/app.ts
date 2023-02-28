import { CreateApp, ICreateApp, IUpdateApp, UpdateApp } from '@joystream/metadata-protobuf'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { integrateMeta } from '@joystream/metadata-protobuf/utils'
import { App, MetaprotocolTransactionResult, MetaprotocolTransactionResultOK } from '../../model'
import { EntityManagerOverlay } from '../../utils/overlay'
import { metaprotocolTransactionFailure } from '../utils'

export async function processCreateAppMessage(
  overlay: EntityManagerOverlay,
  blockNumber: number,
  indexInBlock: number,
  decodedMessage: DecodedMetadataObject<ICreateApp>,
  memberId: string
): Promise<MetaprotocolTransactionResult> {
  const { name, appMetadata } = decodedMessage
  const appId = `${blockNumber}-${indexInBlock}`

  const appExists = await overlay.getRepository(App).getOneBy({ name })

  if (appExists) {
    return metaprotocolTransactionFailure(CreateApp, `App with this name already exists: ${name}`, {
      decodedMessage,
    })
  }

  overlay.getRepository(App).new({
    name,
    id: appId,
    ownerMemberId: memberId,
    websiteUrl: appMetadata?.websiteUrl || undefined,
    useUri: appMetadata?.useUri || undefined,
    smallIcon: appMetadata?.smallIcon || undefined,
    mediumIcon: appMetadata?.mediumIcon || undefined,
    bigIcon: appMetadata?.bigIcon || undefined,
    oneLiner: appMetadata?.oneLiner || undefined,
    description: appMetadata?.description || undefined,
    termsOfService: appMetadata?.termsOfService || undefined,
    platforms: appMetadata?.platforms || undefined,
    category: appMetadata?.category || undefined,
    authKey: appMetadata?.authKey || undefined,
  })

  return new MetaprotocolTransactionResultOK()
}

export async function processUpdateAppMessage(
  overlay: EntityManagerOverlay,
  decodedMessage: DecodedMetadataObject<IUpdateApp>,
  memberId: string
): Promise<MetaprotocolTransactionResult> {
  const { appId, appMetadata } = decodedMessage

  const app = await overlay.getRepository(App).getById(appId)

  if (!app) {
    return metaprotocolTransactionFailure(UpdateApp, `App doesn't exists: ${appId}`, {
      decodedMessage,
    })
  }

  if (app.ownerMemberId !== memberId) {
    return metaprotocolTransactionFailure(
      UpdateApp,
      `Cannot update app; app does not belong to the member: ${memberId}`,
      { decodedMessage, memberId }
    )
  }

  if (appMetadata) {
    integrateMeta(app, appMetadata, [
      'websiteUrl',
      'useUri',
      'smallIcon',
      'mediumIcon',
      'bigIcon',
      'oneLiner',
      'description',
      'termsOfService',
      'platforms',
      'category',
      'authKey',
    ])
  }

  return new MetaprotocolTransactionResultOK()
}
