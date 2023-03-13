import { RequestCheckFunction } from '@subsquid/graphql-server/lib/check'
import { Context as OpenreaderContext } from '@subsquid/openreader/lib/context'
import { TypeormOpenreaderContext } from '@subsquid/graphql-server/lib/typeorm'
import { findActiveSession } from '../utils/http'
import { Account, Session } from '../model'
import { Request } from 'express'
import { EntityManager } from 'typeorm'

type AuthContext = {
  session: Session
  account?: Account
}

export type Context = OpenreaderContext & AuthContext

async function authenticate(req: Request, em: EntityManager): Promise<AuthContext | false> {
  const [, sessionId] = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9+/=]+)$/) || []
  if (!sessionId) {
    return false
  }

  const session = await findActiveSession(req, em, { id: sessionId })
  if (session) {
    const account =
      (await em.getRepository(Account).findOneBy({ userId: session.user.id })) || undefined
    return { session, account }
  }

  return false
}

export const requestCheck: RequestCheckFunction = async (ctx) => {
  const context = ctx.context as Context
  const em = await (context.openreader as unknown as TypeormOpenreaderContext).getEntityManager()

  const authContext = await authenticate(context.req, em)
  if (!authContext) {
    return 'Unauthorized'
  }

  Object.assign(context, authContext)

  if (authContext.session.user.isRoot) {
    // Set search_path accordingly if it's an operator request
    const displayHiddenEntities = context.req.headers['x-display-hidden-entities']
    if (displayHiddenEntities === 'all') {
      await em.query('SET LOCAL search_path TO processor,public')
    }
  }

  return true
}

export default requestCheck
