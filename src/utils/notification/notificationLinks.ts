import { ConfigVariable, config } from '../config'
import { EntityManager } from 'typeorm'
import { join } from 'path'

type LinkType =
  | 'video-page'
  | 'nft-page'
  | 'channel-page'
  | 'term-of-sevice-page'
  | 'category-page'
  | 'marketplace-page'
  | 'member-page'
  | 'ypp-dashboard'
  | 'payments-page'
  | 'crt-page'
  | 'portfolio'

export const getNotificationLink = async (
  em: EntityManager,
  type: LinkType,
  params: string[] = []
): Promise<string> => {
  switch (type) {
    case 'video-page':
      return await getLink(em, `video/${params[0]}`, { commentId: params[1] })

    case 'nft-page':
      return await getLink(em, `video/${params[0]}`, { nftWidget: true })

    case 'channel-page':
      return await getLink(em, `channel/${params[0]}`)

    case 'member-page':
      return await getLink(em, `member/id/${params[0]}`)

    case 'category-page':
      return await getLink(em, `category/${params[0]}`)

    case 'marketplace-page':
      return await getLink(em, 'marketplace')

    case 'payments-page':
      return await getLink(em, 'payments')

    case 'crt-page':
      return await getLink(em, 'studio/crtDashboard')

    case 'portfolio':
      return await getLink(em, 'portfolio')

    case 'ypp-dashboard':
      return await getLink(em, 'ypp/dashboard')

    case 'term-of-sevice-page':
      return await getLink(em, 'tos')
  }
}

const getLink = async (
  em: EntityManager,
  pathname: string,
  query?: Record<string, string | boolean>
) => {
  const domain = await config.get(ConfigVariable.AppRootDomain, em) // expected like "gleev.xyz"
  const basePath = `https://${join(domain, pathname)}`

  if (!query) return basePath

  const queryParams = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (typeof value !== 'undefined') queryParams.set(key, String(value))
  })
  return `${basePath}?${queryParams.toString()}`
}
