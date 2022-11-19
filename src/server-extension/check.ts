import { RequestCheckFunction } from '@subsquid/graphql-server/lib/check'

// TODO: This is just an example, implement actual auth here.
export const requestCheck: RequestCheckFunction = async (req) => {
  if (req.operation.operation === 'mutation' && !req.http.headers.get('x-admin')) {
    return 'Access denied'
  }
  return true
}
