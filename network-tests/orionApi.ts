import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
  DocumentNode,
  from,
  ApolloLink,
} from '@apollo/client/core'
import { Maybe, SalesTestQuery } from './graphql/generated/queries'
import { ErrorLink, onError } from '@apollo/client/link/error'
import { SalesConnection } from './graphql/generated/queries'

export default class SquidClientApi {
  private _gqlClient: ApolloClient<NormalizedCacheObject>

  public constructor(uri?: string, errorHandler?: ErrorLink.ErrorHandler) {
    const links: ApolloLink[] = []
    if (errorHandler) {
      links.push(onError(errorHandler))
    }
    links.push(new HttpLink({ uri, fetch }))
    this._gqlClient = new ApolloClient({
      link: from(links),
      cache: new InMemoryCache({ addTypename: false }),
      defaultOptions: { query: { fetchPolicy: 'no-cache', errorPolicy: 'all' } },
    })
  }
}

const squidApi = new SquidClientApi("http://localhost:3450/graphql")
console.log(squidApi)
