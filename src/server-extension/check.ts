import { RequestCheckFunction } from '@subsquid/graphql-server/lib/check'
import { Context } from '@subsquid/openreader/lib/context'
import { TypeormOpenreaderContext } from '@subsquid/graphql-server/lib/typeorm'

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

  // Set search_path accordingly to x-allow-excluded header
  const em = await (context.openreader as unknown as TypeormOpenreaderContext).getEntityManager()
  const allowExcluded = context.req.headers['x-allow-excluded']
  if (allowExcluded) {
    await em.query('SET LOCAL search_path TO with_excluded,public')
  }

  return true
}

export default requestCheck
