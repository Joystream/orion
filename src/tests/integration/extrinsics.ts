// Import the keyring as required
import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { u64, BTreeSet } from '@polkadot/types'

export async function getStorageBucketsAccordingToPolicy(api: ApiPromise): Promise<BTreeSet<u64>> {
  const { numberOfStorageBuckets } = await api.query.storage.dynamicBagCreationPolicies('Channel')
  const storageBuckets = api.createType('BTreeSet<u64>')
  for (let i = 0; numberOfStorageBuckets.toBn().gtn(i); ++i) {
    storageBuckets.add(api.createType('u64', 0))
  }
  return storageBuckets
}

export async function createChannel(api: ApiPromise, memberId: string, sender: KeyringPair): Promise<string> {
  const storageBuckets = await getStorageBucketsAccordingToPolicy(api)
  const expectedDataObjectStateBloatBond = await api.query.storage.dataObjectStateBloatBondValue()
  const expectedChannelStateBloatBond = await api.query.content.channelStateBloatBondValue()
  const channelOwner = api.createType('PalletContentChannelOwner', { Member: memberId })
  const channelCreationParameters = api.createType('PalletContentChannelCreationParametersRecord', {
    expectedChannelStateBloatBond,
    expectedDataObjectStateBloatBond,
    storageBuckets,
  })

  let unsub: () => void
  let channelId = ''
  await new Promise<() => void>((resolve) => {
    api.tx.content.createChannel(channelOwner, channelCreationParameters).signAndSend(sender, ({ events = [], status }) => {
      if (status.isFinalized) {
        events.forEach(({ event: { data, method, section } }) => {
          if (section === 'content' && method === 'ChannelCreated') {
            channelId = data[0].toString()
          }
        })
        resolve(unsub)
      }
    })
  })
  return channelId
}

export async function createMember(api: ApiPromise, sender: KeyringPair, handle?: string): Promise<string> {
  let unsub: () => void
  let memberId = ''
  await new Promise<() => void>((resolve) => {
    api.tx.members.buyMembership({
      rootAccount: sender.address,
      controllerAccount: sender.address,
      handle: handle ?? sender.address.toString(),
    }).signAndSend(sender, ({ events = [], status }) => {
      if (status.isFinalized) {
        events.forEach(({ event: { data, section } }) => {
          if (section === 'members') {
            memberId = data[0].toString();
          }
        })
        resolve(unsub)
      }
    })
  })

  return memberId

}


