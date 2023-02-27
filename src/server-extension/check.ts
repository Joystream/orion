import { RequestCheckFunction } from '@subsquid/graphql-server/lib/check'
import { Context } from '@subsquid/openreader/lib/context'
import { TypeormOpenreaderContext } from '@subsquid/graphql-server/lib/typeorm'
import { isOperatorRequest } from './resolvers/middleware'

export type ContextWithIP = Context & { ip: string }

export const requestCheck: RequestCheckFunction = async (ctx) => {
  const context = ctx.context as Context

  // Add client IP to the context
  console.log(context.req.headers['x-forwarded-for'])
  const forwardedFor = context.req.headers['x-forwarded-for'] as string | undefined
  const trustedReverseProxies = parseInt(process.env.TRUSTED_REVERSE_PROXIES || '0')
  ;(context as ContextWithIP).ip =
    (trustedReverseProxies && forwardedFor?.split(',').splice(-trustedReverseProxies, 1)[0]) ||
    context.req.ip

  // Set search_path accordingly if it's an operator request
  if (isOperatorRequest(context.req)) {
    const displayHiddenEntities = context.req.headers['x-display-hidden-entities']
    if (displayHiddenEntities === 'all') {
      const em = await (
        context.openreader as unknown as TypeormOpenreaderContext
      ).getEntityManager()
      await em.query('SET LOCAL search_path TO processor,public')
    }
  }

  return true
}

export default requestCheck