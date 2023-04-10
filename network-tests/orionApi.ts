import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
  DocumentNode,
  from,
  ApolloLink,
  gql,
} from '@apollo/client/core'
import { Maybe } from './graphql/generated/queries'
import { ErrorLink, onError } from '@apollo/client/link/error'

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

  public async runQueryWithVariables<
    QueryT extends { [k: string]: Maybe<Record<string, unknown>> | undefined },
    VariablesT extends Record<string, unknown>
  >(
    query: DocumentNode,
    variables: VariablesT,
  ): Promise<QueryT | null> {
    return (await this._gqlClient.query<QueryT, VariablesT>({ query, variables })).data || null
  }
}

// Define your GraphQL query
const GET_MEMBERS = gql`
  query MyQuery($id_in: [String!] = ["1"], $handle_in: [String!] = "") {
    memberships(where: {id_in: $id_in, OR: {handle_in: $handle_in}}) {
        id
        handle
    }
  }
`

const squidApi = new SquidClientApi("http://localhost:4350/graphql")
squidApi.runQueryWithVariables(GET_MEMBERS, { id_in: ["1"], handle_in: ["test"] }).then(result => {
  console.log(result)
})
