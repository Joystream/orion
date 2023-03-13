import { Request } from 'express'
import { EntityManager, FindOptionsWhere, MoreThan } from 'typeorm'
import { UAParser } from 'ua-parser-js'
import { Session } from '../model'

export function resolveIP(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'] as string | undefined
  const trustedReverseProxies = parseInt(process.env.TRUSTED_REVERSE_PROXIES || '0')
  return (
    (trustedReverseProxies && forwardedFor?.split(',').splice(-trustedReverseProxies, 1)[0]) ||
    req.ip
  )
}

export type UserAgentData = {
  browser: string
  os: string
  device: string
  deviceType?: string
}

export function getUserAgentData(req: Request) {
  const uaParsed = new UAParser(req.headers['user-agent'])
  return {
    browser: `${uaParsed.getBrowser().name} ${uaParsed.getBrowser().version}`,
    device: `${uaParsed.getDevice().vendor} ${uaParsed.getDevice().model}`,
    os: `${uaParsed.getOS().name} ${uaParsed.getOS().version}`,
    deviceType: uaParsed.getDevice().type,
  }
}

export async function findActiveSession(
  req: Request,
  em: EntityManager,
  where: FindOptionsWhere<Session>
): Promise<Session | undefined> {
  const ip = resolveIP(req)
  const { browser, device, os } = getUserAgentData(req)
  return (
    (await em.getRepository(Session).findOne({
      where: {
        ...where,
        ip,
        os,
        device,
        browser,
        expiry: MoreThan(new Date()),
      },
      relations: { user: true },
    })) || undefined
  )
}
