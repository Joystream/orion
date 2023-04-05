import { describe, test, beforeAll } from '@jest/globals';
import { ApiPromise, Keyring } from '@polkadot/api';
import { ContentContext } from './contexts/Content';
import { CouncilContext } from './contexts/Council';
import { AccountFactory, Sender } from './Sender';

const factory = new AccountFactory(
  new Keyring({ type: 'sr25519' })
)

const api = new ApiPromise(/*options*/)

describe('channel + token scenario', async () => {
  beforeAll(async () => {
    describe('setting up council context', async () => {
      const councilPallet = new CouncilContext(api)
      const alice = factory.createSenderFromSuri("\\Alice")
      await councilPallet.setupCouncilFromAccounts(factory, ["//Alice","//Bob","//Carl"])

      describe('setting up content context', async () => {
        const contentPallet = new ContentContext(api)
        const alice = factory.createSenderFromSuri("\\Alice")
        await contentPallet.setupMemberChannelCreatedBy(alice)
      })
    })
  })
  describe('channel section', async () => {
    describe('creator token section', async () => {
      test('creator token issuing works as expected', async () => {
      })
    })
  })
});

