import { AuthChecker } from 'type-graphql'
import { OrionContext } from '../types'
import config from '../config'

export const customAuthChecker: AuthChecker<OrionContext> = ({ context }) => {
  return context.authorization === config.featuredContentSecret
}
