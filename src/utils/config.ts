import { EntityManager } from 'typeorm'
import { GatewayConfig } from '../model'

export enum ConfigVariable {
  SupportNoCategoryVideo = 'SUPPORT_NO_CATEGORY_VIDEOS',
  SupportNewCategories = 'SUPPORT_NEW_CATEGORIES',
  KillSwitch = 'KILL_SWITCH_ON',
  VideoViewPerIpTimeLimit = 'VIDEO_VIEW_PER_IP_TIME_LIMIT',
  AppPrivateKey = 'APP_PRIVATE_KEY',
  SessionExpiryAfterInactivityMinutes = 'SESSION_EXPIRY_AFTER_INACTIVITY_MINUTES',
  SessionMaxDurationHours = 'SESSION_MAX_DURATION_HOURS',
  SendgridApiKey = 'SENDGRID_API_KEY',
  SendgridFromEmail = 'SENDGRID_FROM_EMAIL',
  AppName = 'APP_NAME',
  EmailConfirmationRoute = 'EMAIL_CONFIRMATION_ROUTE',
  EmailConfirmationTokenExpiryTimeHours = 'EMAIL_CONFIRMATION_TOKEN_EXPIRY_TIME_HOURS',
  EmailConfirmationTokenRateLimit = 'EMAIL_CONFIRMATION_TOKEN_RATE_LIMIT',
  AccountOwnershipProofExpiryTimeSeconds = 'ACCOUNT_OWNERSHIP_PROOF_EXPIRY_TIME_SECONDS',
  MaxConnectedAccountsPerUser = 'MAX_CONNECTED_ACCOUNTS_PER_USER',
}

const boolType = {
  serialize: (v: boolean) => (v ? '1' : '0'),
  deserialize: (v: string) => v === 'true' || v === '1',
} as const

const intType = {
  serialize: (v: number) => v.toString(),
  deserialize: (v: string) => parseInt(v),
} as const

const stringType = {
  serialize: (v: string) => v,
  deserialize: (v: string) => v,
}

export const configVariables = {
  [ConfigVariable.SupportNoCategoryVideo]: boolType,
  [ConfigVariable.SupportNewCategories]: boolType,
  [ConfigVariable.KillSwitch]: boolType,
  [ConfigVariable.VideoViewPerIpTimeLimit]: intType,
  [ConfigVariable.AppPrivateKey]: stringType,
  [ConfigVariable.SessionMaxDurationHours]: intType,
  [ConfigVariable.SessionExpiryAfterInactivityMinutes]: intType,
  [ConfigVariable.SendgridApiKey]: stringType,
  [ConfigVariable.SendgridFromEmail]: stringType,
  [ConfigVariable.AppName]: stringType,
  [ConfigVariable.EmailConfirmationRoute]: stringType,
  [ConfigVariable.EmailConfirmationTokenExpiryTimeHours]: intType,
  [ConfigVariable.AccountOwnershipProofExpiryTimeSeconds]: intType,
  [ConfigVariable.MaxConnectedAccountsPerUser]: intType,
  [ConfigVariable.EmailConfirmationTokenRateLimit]: intType,
} as const

type TypeOf<C extends ConfigVariable> = ReturnType<typeof configVariables[C]['deserialize']>

class Config {
  async get<C extends ConfigVariable>(name: C, em: EntityManager): Promise<TypeOf<C>> {
    const serialized = (await em.findOneBy(GatewayConfig, { id: name }))?.value ?? process.env[name]

    if (serialized === undefined) {
      throw new Error(`Cannot determine value of config variable ${name}`)
    }

    return configVariables[name].deserialize(serialized) as TypeOf<C>
  }

  async set<C extends ConfigVariable>(name: C, value: TypeOf<C>, em: EntityManager): Promise<void> {
    const serialize = configVariables[name].serialize as (v: TypeOf<C>) => string
    const configValue = new GatewayConfig({
      id: name,
      updatedAt: new Date(),
      value: serialize(value),
    })

    await em.save(configValue)
  }
}

export const config = new Config()
