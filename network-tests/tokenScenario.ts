import { describe, test, beforeAll } from '@jest/globals';
import { ApiPromise, Keyring } from '@polkadot/api';
import { AccountFactory, Sender, SenderFactory } from './Sender';

const factory = new AccountFactory(
  new Keyring({ type: 'sr25519' })
)

const api = new ApiPromise(/*options*/)

describe('channel + token scenario', async () => {
  beforeAll(() => {
    console.log('set up council')
  })
  describe('channel section', async () => {
    test('channel creation works as expected', async () => {
      const result = factory.createSenderFromSuri("//Alice").signAndSend(api.tx.members.createMembership('test'))

    })
    describe('creator token section', async () => {
      test('creator token issuing works as expected', async () => {
      })
    })
  })
});

