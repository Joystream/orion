// Import the keyring as required
import { ApiPromise } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { u64, BTreeSet } from '@polkadot/types'

async function storageBucketsNumWitness(api: ApiPromise, channelId: string): Promise<number> {
  const channelBag = await api.query.storage.bags(
    api.createType('PalletStorageBagIdType', { Dynamic: { Channel: channelId } })
  )
  return channelBag.storedBy.size
}
async function getStorageBucketsAccordingToPolicy(api: ApiPromise): Promise<BTreeSet<u64>> {
  const { numberOfStorageBuckets } = await api.query.storage.dynamicBagCreationPolicies('Channel')
  const storageBuckets = api.createType('BTreeSet<u64>')
  for (let i = 0; numberOfStorageBuckets.toBn().gtn(i); ++i) {
    storageBuckets.add(api.createType('u64', 0))
  }
  return storageBuckets
}

export class TestContext {
  private _api: ApiPromise
  constructor(api: ApiPromise) {
    this._api = api
  }

  public async createVideoWithNft(
    memberId: string,
    channelId: string,
    sender: KeyringPair
  ): Promise<string> {
    const initTransactionalStatus = this._api.createType(
      'PalletContentNftTypesInitTransactionalStatusRecord',
      { Idle: null }
    )

    const expectedVideoStateBloatBond = await this._api.query.content.videoStateBloatBondValue()
    const expectedDataObjectStateBloatBond =
      await this._api.query.storage.dataObjectStateBloatBondValue()

    const videoCreationParams = this._api.createType('PalletContentVideoCreationParametersRecord', {
      assets: null,
      meta: null,
      expectedVideoStateBloatBond,
      expectedDataObjectStateBloatBond,
      autoIssueNft: {
        royalty: this._api.createType('Permill', 10),
        nftMetadata: '',
        nonChannelOwner: null,
        initTransactionalStatus,
      },
      storageBucketsNumWitness: await storageBucketsNumWitness(this._api, channelId),
    })

    const actor = this._api.createType('PalletContentPermissionsContentActor', { Member: memberId })

    let unsub: () => void
    let videoId = ''
    await new Promise<() => void>((resolve) => {
      this._api.tx.content
        .createVideo(actor, channelId, videoCreationParams)
        .signAndSend(sender, (result) => {
          if (result.status.isFinalized) {
            const error = result.dispatchError
            if (error) {
              const { name } = this._api.registry.findMetaError(error.asModule)
              console.log('error:', name)
            }
            result.events.forEach(({ event: { data, method, section } }) => {
              if (section === 'content' && method === 'VideoCreated') {
                videoId = data[1].toString()
              }
            })
            resolve(unsub)
          }
        })
    })
    return videoId
  }

  public async createChannel(memberId: string, sender: KeyringPair): Promise<string> {
    const storageBuckets = await getStorageBucketsAccordingToPolicy(this._api)
    // FIXME: find a solution like with storage buckets
    const distributionBuckets = this._api.createType('BTreeSet<u64>')
    distributionBuckets.add(this._api.createType('u64', 0))
    const expectedDataObjectStateBloatBond =
      await this._api.query.storage.dataObjectStateBloatBondValue()
    const expectedChannelStateBloatBond = await this._api.query.content.channelStateBloatBondValue()
    const channelOwner = this._api.createType('PalletContentChannelOwner', { Member: memberId })
    const channelCreationParameters = this._api.createType(
      'PalletContentChannelCreationParametersRecord',
      {
        expectedChannelStateBloatBond,
        expectedDataObjectStateBloatBond,
        storageBuckets,
        distributionBuckets,
      }
    )

    let unsub: () => void
    let channelId = ''
    await new Promise<() => void>((resolve) => {
      this._api.tx.content
        .createChannel(channelOwner, channelCreationParameters)
        .signAndSend(sender, (result) => {
          if (result.status.isFinalized) {
            const error = result.dispatchError
            if (error) {
              const { name } = this._api.registry.findMetaError(error.asModule)
              console.log('error:', name)
            }
            result.events.forEach(({ event: { data, method, section } }) => {
              if (section === 'content') {
                channelId = data[0].toString()
              }
            })
            resolve(unsub)
          }
        })
    })
    return channelId
  }

  public async createMember(sender: KeyringPair, handle?: string): Promise<string> {
    let unsub: () => void
    let memberId = ''
    await new Promise<() => void>((resolve) => {
      this._api.tx.members
        .buyMembership({
          rootAccount: sender.address,
          controllerAccount: sender.address,
          handle: handle ?? sender.address.toString(),
        })
        .signAndSend(sender, ({ events = [], status }) => {
          if (status.isFinalized) {
            events.forEach(({ event: { data, section } }) => {
              if (section === 'members') {
                memberId = data[0].toString()
              }
            })
            resolve(unsub)
          }
        })
    })

    return memberId
  }
}
