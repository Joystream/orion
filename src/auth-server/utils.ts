import { components } from './generated/api-types'
import { sr25519Verify, decodeAddress, cryptoWaitReady } from '@polkadot/util-crypto'
import { BadRequestError } from './errors'
import { config, ConfigVariable } from '../utils/config'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import { Account } from '../model'
import { EntityManager } from 'typeorm'

export async function verifyConnectOrDisconnectAccountPayload(
  em: EntityManager,
  payload: components['schemas']['ConnectOrDisconnectAccountRequestData']['payload'],
  userAccount: Account,
  signature: string
): Promise<void> {
  await cryptoWaitReady()
  if (
    !sr25519Verify(
      JSON.stringify(payload),
      signature,
      decodeAddress(payload.joystreamAccountId, false, JOYSTREAM_ADDRESS_PREFIX)
    )
  ) {
    throw new BadRequestError('Payload signature is invalid.')
  }

  const appName = await config.get(ConfigVariable.AppName, em)
  const proofExpiryTimeSeconds = await config.get(
    ConfigVariable.AccountOwnershipProofExpiryTimeSeconds,
    em
  )

  if (payload.gatewayAccountId !== userAccount.id) {
    throw new BadRequestError('Payload gatewayAccountId does not match the account id.')
  }

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
