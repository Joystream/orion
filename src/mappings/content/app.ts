import { CreateApp, ICreateApp, IUpdateApp, UpdateApp } from '@joystream/metadata-protobuf'
import { DecodedMetadataObject } from '@joystream/metadata-protobuf/types'
import { integrateMeta } from '@joystream/metadata-protobuf/utils'
import {
  Channel,
  App,
  MetaprotocolTransactionResult,
  MetaprotocolTransactionResultOK,
} from '../../model'
import { EntityManagerOverlay, Flat } from '../../utils/overlay'
import { metaprotocolTransactionFailure } from '../utils'

export async function processCreateAppMessage(
  overlay: EntityManagerOverlay,
  blockNumber: number,
  indexInBlock: number,
  channel: Flat<Channel>,
  decodedMessage: DecodedMetadataObject<ICreateApp>
): Promise<MetaprotocolTransactionResult> {
  const { name, appMetadata } = decodedMessage
  const appId = createAppId(blockNumber, indexInBlock)

  const appExists = await overlay.getRepository(App).getOneBy({ name })

  if (appExists) {
    return metaprotocolTransactionFailure(CreateApp, `App with this name already exists: ${name}`, {
      decodedMessage,
    })
  }

  overlay.getRepository(App).new({
    name,
    id: appId,
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
    channelId: channel.id,
  })

  return new MetaprotocolTransactionResultOK()
}

function createAppId(blockNumber: number, indexInBlock: number): string {
  return `${blockNumber}-${indexInBlock}`
}

export async function processUpdateApp(
  overlay: EntityManagerOverlay,
  channel: Flat<Channel>,
  decodedMessage: DecodedMetadataObject<IUpdateApp>
): Promise<MetaprotocolTransactionResult> {
  const { appId, appMetadata } = decodedMessage

  const app = await overlay.getRepository(App).getById(appId)

  if (!app) {
    return metaprotocolTransactionFailure(UpdateApp, `App doesn't exists: ${appId}`, {
      decodedMessage,
    })
  }
  if (app.channelId !== channel.id) {
    return metaprotocolTransactionFailure(
      UpdateApp,
      `Cannot update app; app does not belong to the channelId: ${channel.id}`,
      { decodedMessage }
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
