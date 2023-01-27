import { EntityManager } from 'typeorm'
import { GatewayConfig } from '../model'

export enum ConfigVariable {
  SupportNoCategoryVideo = 'SUPPORT_NO_CATEGORY_VIDEOS',
  SupportNewCategories = 'SUPPORT_NEW_CATEGORIES',
  KillSwitch = 'KILL_SWITCH_ON',
  VideoViewPerIpTimeLimit = 'VIDEO_VIEW_PER_IP_TIME_LIMIT',
}

const boolType = {
  serialize: (v: boolean) => (v ? '1' : '0'),
  deserialize: (v: string) => v === 'true' || v === '1',
} as const

const numberType = {
  serialize: (v: number) => v.toString(),
  deserialize: (v: string) => parseInt(v),
} as const

export const configVariables = {
  [ConfigVariable.SupportNoCategoryVideo]: boolType,
  [ConfigVariable.SupportNewCategories]: boolType,
  [ConfigVariable.KillSwitch]: boolType,
  [ConfigVariable.VideoViewPerIpTimeLimit]: numberType,
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
