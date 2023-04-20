import './config'
import request from 'supertest'
import { app } from '../index'
import { globalEm } from '../../utils/globalEm'
import { Token, TokenType, Account } from '../../model'
import assert from 'assert'

export type AccountInfo = {
  sessionId: string
  accountId: string
}

export const DEFAULT_PASSWORD = 'TestPassword123!'

export async function register(
  email = `test.${Date.now()}@example.com`,
  password = DEFAULT_PASSWORD
): Promise<Account> {
  const em = await globalEm
  const {
    body: { sessionId: anonSessionId },
  } = await request(app)
    .post('/api/v1/anonymous-auth')
    .set('Content-Type', 'application/json')
    .expect(200)
  console.log('Resquest data:', { email, password })
  await request(app)
    .post('/api/v1/register')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${anonSessionId}`)
    .send({ email, password })
    .expect(200)
  const account = await em.getRepository(Account).findOneBy({ email })
  assert(account, 'Account not found')
  return account
}

export async function confirmEmail(token: string, expectedStatus: number): Promise<void> {
  await request(app)
    .post('/api/v1/confirm-email')
    .set('Content-Type', 'application/json')
    .send({ token })
    .expect(expectedStatus)
}

export async function requestEmailConfirmationToken(
  email: string,
  expectedStatus: number
): Promise<void> {
  await request(app)
    .post('/api/v1/request-email-confirmation-token')
    .set('Content-Type', 'application/json')
    .send({ email })
    .expect(expectedStatus)
}

export async function setupAccount(): Promise<AccountInfo> {
  const em = await globalEm
  const account = await register()
  const token = await em.getRepository(Token).findOneBy({
    type: TokenType.EMAIL_CONFIRMATION,
    issuedFor: account,
  })
  assert(token, 'Token not found')
  await confirmEmail(token.id, 200)
  const {
    body: { sessionId: userSessionId },
  } = await request(app)
    .post('/api/v1/login')
    .set('Content-Type', 'application/json')
    .send({
      email: account.email,
      password: DEFAULT_PASSWORD,
    })
    .expect(200)

  return { sessionId: userSessionId, accountId: account.id }
}
