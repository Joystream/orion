import { components } from './generated/api-types'
import { sr25519Verify, decodeAddress, cryptoWaitReady } from '@polkadot/util-crypto'
import { BadRequestError } from './errors'
import { config, ConfigVariable } from '../utils/config'
import { JOYSTREAM_ADDRESS_PREFIX } from '@joystream/types'
import { Account, ConnectedAccount, ConnectedAccountProof } from '../model'
import { EntityManager } from 'typeorm'
import { uniqueId } from '../utils/crypto'

export async function verifyActionExecutionRequest(
  em: EntityManager,
  { payload, signature }: components['schemas']['ActionExecutionRequestData']
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

export async function connectAccount(
  em: EntityManager,
  account: Account,
  {
    payload: { gatewayName, timestamp, joystreamAccountId },
    signature,
  }:
    | components['schemas']['ConnectAccountRequestData']
    | components['schemas']['CreateAccountRequestData']
): Promise<[ConnectedAccountProof, ConnectedAccount]> {
  const proof = new ConnectedAccountProof({
    id: uniqueId(),
    gatewayAppName: gatewayName,
    signature,
    timestamp: new Date(timestamp),
  })

  const connectedAccount = new ConnectedAccount({
    id: joystreamAccountId,
    accountId: account.id,
    connectedAt: new Date(),
    isLoginAllowed: true,
    proofId: proof.id,
  })

  return (await em.save([proof, connectedAccount])) as [ConnectedAccountProof, ConnectedAccount]
}
