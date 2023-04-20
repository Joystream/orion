import './config'
import { globalEm } from '../../utils/globalEm'
import { EntityManager, MoreThan } from 'typeorm'
import { confirmEmail, register, requestEmailConfirmationToken } from './common'
import { Account, Token, TokenType } from '../../model'
import assert from 'assert'
import { ConfigVariable, config } from '../../utils/config'

async function findActiveToken(em: EntityManager, account: Account): Promise<Token | null> {
  return em.getRepository(Token).findOneBy({
    type: TokenType.EMAIL_CONFIRMATION,
    issuedFor: account,
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
    em = await globalEm
    account = await register()
  })

  it('should fail if account does not exist', async () => {
    await requestEmailConfirmationToken('non.existing.account@example.com', 404)
  })

  it('should succeed if account exists', async () => {
    let oldToken = await findActiveToken(em, account)
    assert(oldToken, 'Pre-existing token not found')
    await requestEmailConfirmationToken(account.email, 200)
    const newToken = await findActiveToken(em, account)
    oldToken = await reloadToken(em, oldToken)
    assert(newToken, 'Newly created token not found')
    assert.notStrictEqual(oldToken.id, newToken.id, 'Token IDs are the same')
    assert(oldToken.expiry.getTime() <= Date.now(), 'Pre-existing token is not expired')
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
    const account = await register()
    const rateLimit = await config.get(ConfigVariable.EmailConfirmationTokenRateLimit, em)
    // We substract 1 from rateLimit, because register() already requests a token
    for (let i = 0; i < rateLimit - 1; i++) {
      await requestEmailConfirmationToken(account.email, 200)
    }
    await requestEmailConfirmationToken(account.email, 429)
  })
})
