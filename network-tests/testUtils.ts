import { ApiPromise, WsProvider } from '@polkadot/api'
import { JsNodeApi } from './joystreamNodeApi'
import { HttpLink, ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core'
import fetch from 'cross-fetch'

export function waitMilliSec(milliseconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, milliseconds) // 5000 milliseconds = 5 seconds
  })
}

export class TestContext {
  private _waitTimeForBlockProductionMs = 5000
  private _jsNode: JsNodeApi | undefined
  private _treasuryUri = ''
  private _provider: WsProvider | undefined
  private _apolloClient: ApolloClient<NormalizedCacheObject> | undefined

  public setWaitTimeForBlockProduction(milliSec: number) {
    this._waitTimeForBlockProductionMs = milliSec
  }

  public setTreasuryUri(uri: string) {
    this._treasuryUri = uri
  }

  public async connectToJsNodeEndpoint(url: string): Promise<void> {
    if (this._treasuryUri === '') {
      console.error('treasury uri not set, impossible to continue testing')
      process.exit(-1)
    }
    this._provider = new WsProvider(url)
    const api = await ApiPromise.create({ provider: this._provider! })
    try {
      await api.isReadyOrError
    } catch (error) {
      console.error(error)
      process.exit(-1)
    }
    this._jsNode = new JsNodeApi(this._treasuryUri, api)
    await waitMilliSec(this._waitTimeForBlockProductionMs)
  }

  get jsNodeApi(): JsNodeApi {
    return this._jsNode!
  }

  get orionClient(): ApolloClient<NormalizedCacheObject> {
    return this._apolloClient!
  }

  public connectToGraphqlEndpoint(orionUrl: string) {
    this._apolloClient = new ApolloClient({
      link: new HttpLink({ uri: orionUrl, fetch }),
      cache: new InMemoryCache({ addTypename: false }),
      defaultOptions: { query: { fetchPolicy: 'no-cache', errorPolicy: 'all' } },
    })
  }

  public disconnectJsNode() {
    if (this._provider !== undefined) {
      this._provider!.disconnect().catch(() => {})
    }
  }
}
