import { EntityManager } from 'typeorm'
import { GatewayConfig } from '../model'

export enum ConfigVariable {
  SupportNoCategoryVideo = 'SUPPORT_NO_CATEGORY_VIDEOS',
  SupportNewCategories = 'SUPPORT_NEW_CATEGORIES',
  KillSwitch = 'KILL_SWITCH_ON',
}

class Config {
  async get(name: ConfigVariable, em: EntityManager): Promise<boolean> {
    const rawValue = (await em.findOneBy(GatewayConfig, { id: name }))?.value ?? process.env[name]

    if (rawValue === undefined) {
      throw new Error(`Cannot determine value of config variable ${name}`)
    }

    const value = rawValue === 'true' || rawValue === true || rawValue === '1'

    return value
  }

  async set(name: ConfigVariable, value: boolean, em: EntityManager): Promise<void> {
    const configValue = new GatewayConfig({
      id: name,
      updatedAt: new Date(),
      value,
    })

    await em.save(configValue)
  }
}

export const config = new Config()
