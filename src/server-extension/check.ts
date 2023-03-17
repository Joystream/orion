import { RequestCheckFunction } from '@subsquid/graphql-server/lib/check'
import { Context as OpenreaderContext } from '@subsquid/openreader/lib/context'
import { TypeormOpenreaderContext } from '@subsquid/graphql-server/lib/typeorm'
import { AuthContext, authenticate } from '../utils/auth'

export type Context = OpenreaderContext & AuthContext

export const requestCheck: RequestCheckFunction = async (ctx) => {
  const context = ctx.context as Context

  const authContext = await authenticate(context.req)
  if (!authContext) {
    return 'Unauthorized'
  }

  Object.assign(context, authContext)

  if (authContext.user.isRoot) {
    const em = await (context.openreader as unknown as TypeormOpenreaderContext).getEntityManager()
    // Set search_path accordingly if it's an operator request
    const displayHiddenEntities = context.req.headers['x-display-hidden-entities']
    if (displayHiddenEntities === 'all') {
      await em.query('SET LOCAL search_path TO admin,public')
    }
  }

  return true
}

export default requestCheck
