import { AuthChecker } from 'type-graphql'
import { OrionContext } from '../types'
import config, { ADMIN_ROLE } from '../config'

export const customAuthChecker: AuthChecker<OrionContext> = ({ context }, roles) => {
  if (roles.includes(ADMIN_ROLE)) {
    return context.authorization === config.adminSecret
  }
  return context.authorization === config.featuredContentSecret
}
