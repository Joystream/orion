import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import {
  checkAddress,
  cryptoWaitReady,
  decodeAddress,
  signatureVerify,
} from '@polkadot/util-crypto'
import { EntityManager } from 'typeorm'
import { EmailConfirmationToken } from '../model'
import { ConfigVariable, config } from '../utils/config'
import { uniqueId } from '../utils/crypto'
import { formatDate } from '../utils/date'
import { sgSendMail } from '../utils/mail'
import { registerEmailContent } from './emails'
import { BadRequestError } from './errors'
import { components } from './generated/api-types'

export async function verifyActionExecutionRequest(
  em: EntityManager,
  { payload, signature }: components['schemas']['ActionExecutionRequestData']
): Promise<void> {
  await cryptoWaitReady()

  const [isValid, error] = checkAddress(payload.joystreamAccountId, JOYSTREAM_ADDRESS_PREFIX)
  if (!isValid) {
    throw new BadRequestError(`Payload joystreamAccountId is invalid. Error: ${error}`)
  }

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

async function issueEmailConfirmationToken(
  email: string,
  em: EntityManager
): Promise<EmailConfirmationToken> {
  const issuedAt = new Date()
  const lifetimeMs =
    (await config.get(ConfigVariable.EmailConfirmationTokenExpiryTimeHours, em)) * 3_600_000
  const expiry = new Date(issuedAt.getTime() + lifetimeMs)
  const token = new EmailConfirmationToken({
    id: uniqueId(),
    expiry,
    issuedAt,
    email,
  })
  return em.save(token)
}

export async function sendWelcomeEmail(email: string, em: EntityManager): Promise<void> {
  const emailConfirmationToken = await issueEmailConfirmationToken(email, em)
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
    to: email,
    subject: `Welcome to ${appName}!`,
    content: emailContent,
  })
}

export async function sendLoginOrChangePasswordEmail(
  email: string,
  em: EntityManager
): Promise<void> {
  // TODO: implement this
}
