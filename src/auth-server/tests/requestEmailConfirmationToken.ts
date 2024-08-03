import { cryptoWaitReady } from '@polkadot/util-crypto'
import assert from 'assert'
import { EntityManager, MoreThan } from 'typeorm'
import { EmailConfirmationToken } from '../../model'
import { ConfigVariable, config } from '../../utils/config'
import { globalEm } from '../../utils/globalEm'
import { anonymousAuth, requestEmailConfirmationToken } from './common'
import './config'

export async function findActiveToken(
  em: EntityManager,
  email: string
): Promise<EmailConfirmationToken | null> {
  return em.getRepository(EmailConfirmationToken).findOneBy({
    email,
    expiry: MoreThan(new Date()),
  })
}

async function reloadToken(
  em: EntityManager,
  token: EmailConfirmationToken
): Promise<EmailConfirmationToken> {
  return em.getRepository(EmailConfirmationToken).findOneByOrFail({ id: token.id })
}

describe('requestEmailConfirmationToken', () => {
  let em: EntityManager
  const email = `email@example.com`
  let anonSessionId: string

  before(async () => {
    await cryptoWaitReady()
    em = await globalEm
    anonSessionId = await anonymousAuth()
  })

  it('Token should exist', async () => {
    await requestEmailConfirmationToken(email, anonSessionId, 200)
    const token = await findActiveToken(em, email)
    assert(token, 'Token not found')
  })

  it('should fail if rate limit is exceeded', async () => {
    const rateLimit = await config.get(ConfigVariable.EmailConfirmationTokenRateLimit, em)
    let previousToken: EmailConfirmationToken | null = null
    for (let i = 1; i < rateLimit; i++) {
      await requestEmailConfirmationToken(email, anonSessionId, 200)
      const newToken = await findActiveToken(em, email)
      assert(newToken, 'Token not found')
      if (previousToken) {
        previousToken = await reloadToken(em, previousToken)
        assert(newToken.id !== previousToken.id, 'Active token id did not change')
        assert(previousToken.expiry.getTime() <= Date.now(), 'Previous token is not expired')
      }
      previousToken = newToken
    }
    await requestEmailConfirmationToken(email, anonSessionId, 429)
  })
})
