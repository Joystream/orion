import { createLogger } from '@subsquid/logger'
import BN from 'bn.js'

export let JOYSTREAM_USD_PRICE: number | null = null

const HAPI_TO_JOY_RATE = 10 ** 10
const HAPI_TO_JOY_RATE_BN = new BN(HAPI_TO_JOY_RATE)
const MAX_SAFE_NUMBER_BN = new BN(Number.MAX_SAFE_INTEGER)

const log = createLogger('price')

export const updateJoystreamPrice = async () => {
  // we don't care if the request fails, app should continue to work w/o joy price
  const data = await fetch('https://status.joystream.org/price').catch(() =>
    log.error('Fetching JOYSTREAM price failed')
  )
  if (data) {
    const json = await data.json()
    JOYSTREAM_USD_PRICE = +json.price ?? 0
  }
}

export const schedulePriceUpdate = async (): Promise<void> => {
  while (true) {
    await updateJoystreamPrice()
    log.info(`Price refetched: ${JOYSTREAM_USD_PRICE}`)
    await new Promise((resolve) => setTimeout(resolve, 1_000 * 60 * 5)) // 5mins
  }
}

export const convertHapiToUSD = (hapis: BN | bigint, round = true) => {
  if (!JOYSTREAM_USD_PRICE) return null
  const tokens = hapiBnToTokenNumber(new BN(hapis.toString()))
  const amount = tokens * JOYSTREAM_USD_PRICE
  return round ? Math.round(amount) : amount
}

const hapiBnToTokenNumber = (bn: BN, roundUpToTwoDecimalPlaces?: boolean) => {
  const wholeUnitsBn = bn.div(HAPI_TO_JOY_RATE_BN)
  const fractionalUnitsBn = bn.mod(HAPI_TO_JOY_RATE_BN)

  if (wholeUnitsBn.gt(MAX_SAFE_NUMBER_BN)) {
    throw new Error('Trying to convert unsafe number from BN to number')
  }

  const wholeUnits = wholeUnitsBn.toNumber()
  const fractionalHapiUnits = fractionalUnitsBn.toNumber()
  const fractionalJoyUnits = fractionalHapiUnits / HAPI_TO_JOY_RATE
  if (roundUpToTwoDecimalPlaces) {
    return Math.ceil((wholeUnits + fractionalJoyUnits) * 100) / 100
  }
  return wholeUnits + fractionalJoyUnits
}
