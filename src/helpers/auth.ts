import { AuthChecker } from 'type-graphql'
import { OrionContext } from '../types'
import config from '../config'

export const customAuthChecker: AuthChecker<OrionContext> = ({ context }, roles) => {
  if (roles.includes(config.killerRole)) {
    return context.authorization === config.killSwitchSecret
  }
  return context.authorization === config.featuredContentSecret
}
