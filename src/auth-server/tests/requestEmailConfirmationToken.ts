import './config'
import { globalEm } from '../../utils/globalEm'
import { EntityManager, MoreThan } from 'typeorm'
import { confirmEmail, createAccount, requestEmailConfirmationToken } from './common'
import { Account, Token, TokenType } from '../../model'
import assert from 'assert'
import { ConfigVariable, config } from '../../utils/config'
import { cryptoWaitReady } from '@polkadot/util-crypto'

async function findActiveToken(em: EntityManager, account: Account): Promise<Token | null> {
  return em.getRepository(Token).findOneBy({
    type: TokenType.EMAIL_CONFIRMATION,
    issuedForId: account.id,
    expiry: MoreThan(new Date()),
  })
}

async function reloadToken(em: EntityManager, token: Token): Promise<Token> {
  return em.getRepository(Token).findOneByOrFail({ id: token.id })
}

describe('requestEmailConfirmationToken', () => {
  let em: EntityManager
  let account: Account

  before(async () => {
    await cryptoWaitReady()
    em = await globalEm
    account = await createAccount()
  })

  it('should fail if account does not exist', async () => {
    await requestEmailConfirmationToken('non.existing.account@example.com', 404)
  })

  it('should succeed if account exists', async () => {
    await requestEmailConfirmationToken(account.email, 200)
    const token = await findActiveToken(em, account)
    assert(token, 'Token not found')
  })

  it('should fail if account is already confirmed', async () => {
    let oldToken = await findActiveToken(em, account)
    assert(oldToken, 'Pre-existing token not found')
    await confirmEmail(oldToken.id, 200)
    oldToken = await reloadToken(em, oldToken)
    assert(oldToken.expiry.getTime() <= Date.now(), 'Pre-existing token is not expired')
    await requestEmailConfirmationToken(account.email, 400)
  })

  it('should fail if rate limit is exceeded', async () => {
    const account = await createAccount()
    const rateLimit = await config.get(ConfigVariable.EmailConfirmationTokenRateLimit, em)
    let previousToken: Token | null = null
    for (let i = 0; i < rateLimit; i++) {
      await requestEmailConfirmationToken(account.email, 200)
      const newToken = await findActiveToken(em, account)
      assert(newToken, 'Token not found')
      if (previousToken) {
        previousToken = await reloadToken(em, previousToken)
        assert(newToken.id !== previousToken.id, 'Active token id did not change')
        assert(previousToken.expiry.getTime() <= Date.now(), 'Previous token is not expired')
      }
      previousToken = newToken
    }
    await requestEmailConfirmationToken(account.email, 429)
  })
})
