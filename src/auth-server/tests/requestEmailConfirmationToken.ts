import './config'
import { globalEm } from '../../utils/globalEm'
import { EntityManager, MoreThan } from 'typeorm'
import {
  AccountAccessData,
  confirmEmail,
  createAccount,
  requestEmailConfirmationToken,
} from './common'
import { Token, TokenType } from '../../model'
import assert from 'assert'
import { ConfigVariable, config } from '../../utils/config'
import { cryptoWaitReady } from '@polkadot/util-crypto'

async function findActiveToken(em: EntityManager, accountId: string): Promise<Token | null> {
  return em.getRepository(Token).findOneBy({
    type: TokenType.EMAIL_CONFIRMATION,
    issuedForId: accountId,
    expiry: MoreThan(new Date()),
  })
}

async function reloadToken(em: EntityManager, token: Token): Promise<Token> {
  return em.getRepository(Token).findOneByOrFail({ id: token.id })
}

describe('requestEmailConfirmationToken', () => {
  let em: EntityManager
  let accountInfo: AccountAccessData

  before(async () => {
    await cryptoWaitReady()
    em = await globalEm
    accountInfo = await createAccount()
  })

  it('should fail if account does not exist', async () => {
    await requestEmailConfirmationToken('non.existing.account@example.com', 404)
  })

  it('should succeed if account exists', async () => {
    await requestEmailConfirmationToken(accountInfo.email, 200)
    const token = await findActiveToken(em, accountInfo.accountId)
    assert(token, 'Token not found')
  })

  it('should fail if account is already confirmed', async () => {
    let oldToken = await findActiveToken(em, accountInfo.accountId)
    assert(oldToken, 'Pre-existing token not found')
    await confirmEmail(oldToken.id, 200)
    oldToken = await reloadToken(em, oldToken)
    assert(oldToken.expiry.getTime() <= Date.now(), 'Pre-existing token is not expired')
    await requestEmailConfirmationToken(accountInfo.email, 400)
  })

  it('should fail if rate limit is exceeded', async () => {
    const { email, accountId } = await createAccount()
    const rateLimit = await config.get(ConfigVariable.EmailConfirmationTokenRateLimit, em)
    let previousToken: Token | null = null
    for (let i = 0; i < rateLimit; i++) {
      await requestEmailConfirmationToken(email, 200)
      const newToken = await findActiveToken(em, accountId)
      assert(newToken, 'Token not found')
      if (previousToken) {
        previousToken = await reloadToken(em, previousToken)
        assert(newToken.id !== previousToken.id, 'Active token id did not change')
        assert(previousToken.expiry.getTime() <= Date.now(), 'Previous token is not expired')
      }
      previousToken = newToken
    }
    await requestEmailConfirmationToken(email, 429)
  })
})
