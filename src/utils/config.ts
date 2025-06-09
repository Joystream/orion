import { EntityManager } from 'typeorm'
import { CommentTipTier, GatewayConfig } from '../model'
import { withHiddenEntities } from './sql'

export enum ConfigVariable {
  SupportNoCategoryVideo = 'SUPPORT_NO_CATEGORY_VIDEOS',
  SupportNewCategories = 'SUPPORT_NEW_CATEGORIES',
  CrtMarketCapMinVolumeJoy = 'CRT_MARKET_CAP_MIN_VOLUME_JOY',
  KillSwitch = 'KILL_SWITCH_ON',
  VideoViewPerUserTimeLimit = 'VIDEO_VIEW_PER_USER_TIME_LIMIT',
  VideoRelevanceViewsTick = 'VIDEO_RELEVANCE_VIEWS_TICK',
  RelevanceWeights = 'RELEVANCE_WEIGHTS',
  RelevanceServiceConfig = 'RELEVANCE_SERVICE_CONFIG',
  AppPrivateKey = 'APP_PRIVATE_KEY',
  AppRootDomain = 'APP_ROOT_DOMAIN',
  SessionExpiryAfterInactivityMinutes = 'SESSION_EXPIRY_AFTER_INACTIVITY_MINUTES',
  SessionMaxDurationHours = 'SESSION_MAX_DURATION_HOURS',
  SendgridApiKey = 'SENDGRID_API_KEY',
  SendgridFromEmail = 'SENDGRID_FROM_EMAIL',
  AppName = 'APP_NAME',
  EmailConfirmationRoute = 'EMAIL_CONFIRMATION_ROUTE',
  EmailConfirmationTokenExpiryTimeHours = 'EMAIL_CONFIRMATION_TOKEN_EXPIRY_TIME_HOURS',
  EmailConfirmationTokenRateLimit = 'EMAIL_CONFIRMATION_TOKEN_RATE_LIMIT',
  AccountOwnershipProofExpiryTimeSeconds = 'ACCOUNT_OWNERSHIP_PROOF_EXPIRY_TIME_SECONDS',
  EmailNotificationDeliveryMaxAttempts = 'EMAIL_NOTIFICATION_DELIVERY_MAX_ATTEMPTS',
  AppAssetStorage = 'APP_ASSET_STORAGE',
  AppNameAlt = 'APP_NAME_ALT',
  NotificationAssetRoot = 'NOTIFICATION_ASSET_ROOT',
  CommentTipTiers = 'COMMENT_TIP_TIERS',
  ChannelWeightFollowsTick = 'CHANNEL_WEIGHT_FOLLOWS_TICK',
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

const jsonType = <T>() => ({
  serialize: (v: T) => JSON.stringify(v),
  deserialize: (v: string) => JSON.parse(v) as T,
})

export type CommentTipTiers = { [key in CommentTipTier]: number }

export type RelevanceWeights = {
  channel: {
    crtVolumeWeight: number
    crtLiquidityWeight: number
    followersWeight: number
    revenueWeight: number
    yppTierWeight: number
  }
  video: {
    ageWeight: number
    viewsWeight: number
    commentsWeight: number
    reactionsWeight: number
    ageSubWeights: {
      joystreamAgeWeight: number
      youtubeAgeWeight: number
    }
    // TODO: Tips
  }
}

export type RelevanceServiceConfig = {
  populateBackgroundQueueInterval: number
  updateLoopInterval: number
  channelsPerIteration: number
  videosPerChannel: number
  ageScoreHalvingDays: number
}

export const configVariables = {
  [ConfigVariable.SupportNoCategoryVideo]: boolType,
  [ConfigVariable.SupportNewCategories]: boolType,
  [ConfigVariable.CrtMarketCapMinVolumeJoy]: intType,
  [ConfigVariable.KillSwitch]: boolType,
  [ConfigVariable.VideoViewPerUserTimeLimit]: intType,
  [ConfigVariable.VideoRelevanceViewsTick]: intType,
  [ConfigVariable.ChannelWeightFollowsTick]: intType,
  [ConfigVariable.RelevanceWeights]: jsonType<RelevanceWeights>(),
  [ConfigVariable.RelevanceServiceConfig]: jsonType<RelevanceServiceConfig>(),
  [ConfigVariable.AppPrivateKey]: stringType,
  [ConfigVariable.SessionMaxDurationHours]: intType,
  [ConfigVariable.SessionExpiryAfterInactivityMinutes]: intType,
  [ConfigVariable.SendgridApiKey]: stringType,
  [ConfigVariable.SendgridFromEmail]: stringType,
  [ConfigVariable.AppName]: stringType,
  [ConfigVariable.EmailConfirmationRoute]: stringType,
  [ConfigVariable.EmailConfirmationTokenExpiryTimeHours]: intType,
  [ConfigVariable.AccountOwnershipProofExpiryTimeSeconds]: intType,
  [ConfigVariable.EmailConfirmationTokenRateLimit]: intType,
  [ConfigVariable.AppRootDomain]: stringType,
  [ConfigVariable.EmailNotificationDeliveryMaxAttempts]: intType,
  [ConfigVariable.AppAssetStorage]: stringType,
  [ConfigVariable.AppNameAlt]: stringType,
  [ConfigVariable.NotificationAssetRoot]: stringType,
  [ConfigVariable.CommentTipTiers]: jsonType<CommentTipTiers>(),
} as const

type TypeOf<C extends ConfigVariable> = ReturnType<(typeof configVariables)[C]['deserialize']>

export const configDefaults: { [C in ConfigVariable]?: TypeOf<C> } = {
  [ConfigVariable.RelevanceWeights]: {
    channel: {
      crtVolumeWeight: 0.2,
      crtLiquidityWeight: 0.2,
      followersWeight: 0.2,
      revenueWeight: 0.2,
      yppTierWeight: 0.2,
    },
    video: {
      ageWeight: 0.6,
      ageSubWeights: {
        joystreamAgeWeight: 0.1,
        youtubeAgeWeight: 0.9,
      },
      viewsWeight: 0.1,
      commentsWeight: 0.15,
      reactionsWeight: 0.15,
    },
  },
  [ConfigVariable.RelevanceServiceConfig]: {
    populateBackgroundQueueInterval: 12 * 60 * 60 * 1_000, // 12 hours
    updateLoopInterval: 6 * 1_000, // 6 seconds
    channelsPerIteration: 1_000,
    videosPerChannel: 10,
    ageScoreHalvingDays: 30,
  },
}

class Config {
  getDefault<C extends ConfigVariable>(name: C) {
    // Use env value if exists
    const serializedValue = process.env[name]
    if (serializedValue === undefined) {
      // Otherwise fallback to hardcoded value
      if (configDefaults[name] !== undefined) {
        return configDefaults[name] as TypeOf<C>
      }
      throw new Error(`${name} has no default value`)
    }
    return configVariables[name].deserialize(serializedValue) as TypeOf<C>
  }

  async get<C extends ConfigVariable>(name: C, em: EntityManager): Promise<TypeOf<C>> {
    const dbValue = await withHiddenEntities(em, async () => {
      return (await em.findOneBy(GatewayConfig, { id: name }))?.value
    })

    // Fallback to default value if not found in DB
    if (dbValue === undefined) {
      try {
        return this.getDefault(name)
      } catch (e) {
        throw new Error(`Missing value of config variable: ${name}`)
      }
    }

    return configVariables[name].deserialize(dbValue) as TypeOf<C>
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
