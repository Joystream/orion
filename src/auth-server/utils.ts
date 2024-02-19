import { components } from './generated/api-types'
import { decodeAddress, cryptoWaitReady, signatureVerify } from '@polkadot/util-crypto'
import { BadRequestError } from './errors'
import { config, ConfigVariable } from '../utils/config'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import { Account, Token, TokenType } from '../model'
import { EntityManager } from 'typeorm'
import { uniqueId } from '../utils/crypto'
import { sgSendMail } from '../utils/mail'
import { formatDate } from '../utils/date'
import { registerEmailContent } from './emails'

export async function verifyActionExecutionRequest(
  em: EntityManager,
  { payload, signature }: components['schemas']['ActionExecutionRequestData']
): Promise<void> {
  await cryptoWaitReady()
  const signatureVerifyResult = signatureVerify(
    JSON.stringify(payload),
    signature,
    decodeAddress(payload.joystreamAccountId, false, JOYSTREAM_ADDRESS_PREFIX)
  )
  if (!signatureVerifyResult.isValid || signatureVerifyResult.crypto !== 'sr25519') {
    throw new BadRequestError('Payload signature is invalid.')
  }

  const appName = await config.get(ConfigVariable.AppName, em)
  const proofExpiryTimeSeconds = await config.get(
    ConfigVariable.AccountOwnershipProofExpiryTimeSeconds,
    em
  )

  if (payload.gatewayName !== appName) {
    throw new BadRequestError('Payload gatewayName does not match the app name.')
  }

  if (payload.timestamp < Date.now() - proofExpiryTimeSeconds * 1000) {
    throw new BadRequestError(
      `Payload timestamp cannot be older than ${proofExpiryTimeSeconds} seconds.`
    )
  }

  if (payload.timestamp > Date.now()) {
    throw new BadRequestError('Payload timestamp is in the future.')
  }
}

export async function issueEmailConfirmationToken(
  account: Account,
  em: EntityManager
): Promise<Token> {
  const issuedAt = new Date()
  const lifetimeMs =
    (await config.get(ConfigVariable.EmailConfirmationTokenExpiryTimeHours, em)) * 3_600_000
  const expiry = new Date(issuedAt.getTime() + lifetimeMs)
  const token = new Token({
    id: uniqueId(),
    type: TokenType.EMAIL_CONFIRMATION,
    expiry,
    issuedAt,
    issuedForId: account.id,
  })
  return em.save(token)
}

export async function sendWelcomeEmail(account: Account, em: EntityManager): Promise<void> {
  const emailConfirmationToken = await issueEmailConfirmationToken(account, em)
  const appName = await config.get(ConfigVariable.AppName, em)
  const confirmEmailRoute = await config.get(ConfigVariable.EmailConfirmationRoute, em)
  const emailConfirmationLink = confirmEmailRoute.replace('{token}', emailConfirmationToken.id)

  const emailContent = registerEmailContent({
    link: emailConfirmationLink,
    linkExpiryDate: formatDate(emailConfirmationToken.expiry),
    appName,
  })
  await sgSendMail({
    from: await config.get(ConfigVariable.SendgridFromEmail, em),
    to: account.email,
    subject: `Welcome to ${appName}!`,
    content: emailContent,
  })
}
