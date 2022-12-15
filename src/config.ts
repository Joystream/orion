import dotenv from 'dotenv'

const isDev = process.env.NODE_ENV === 'development'
export const ADMIN_ROLE = 'ADMIN'

type LoadEnvVarOpts = {
  defaultValue?: string
  devDefaultValue?: string
}
const loadEnvVar = (name: string, { defaultValue, devDefaultValue }: LoadEnvVarOpts = {}): string => {
  const value = process.env[name]
  if (value) {
    return value
  }

  if (isDev && devDefaultValue) {
    return devDefaultValue
  }

  if (defaultValue) {
    return defaultValue
  }

  throw new Error(`Required env variable "${name}" is missing from the environment`)
}

export class Config {
  private _port: number
  private _mongoDBUri: string
  private _featuredContentSecret: string
  private _adminSecret: string
  private _appPrivateKey: string
  private _queryNodeUrl: string
  private _isDebugging: boolean

  get port(): number {
    return this._port
  }

  get mongoDBUri(): string {
    return this._mongoDBUri
  }

  get featuredContentSecret(): string {
    return this._featuredContentSecret
  }

  get adminSecret(): string {
    return this._adminSecret
  }

  get appPrivateKey(): string {
    return this._appPrivateKey
  }

  get queryNodeUrl(): string {
    return this._queryNodeUrl
  }

  get isDebugging(): boolean {
    return this._isDebugging
  }

  loadConfig() {
    dotenv.config()

    const rawPort = loadEnvVar('ORION_PORT', { defaultValue: '6116' })
    this._port = parseInt(rawPort)

    const mongoHostname = loadEnvVar('ORION_MONGO_HOSTNAME', { devDefaultValue: '127.0.0.1' })
    const rawMongoPort = loadEnvVar('ORION_MONGO_PORT', { defaultValue: '27017' })
    const mongoDatabase = loadEnvVar('ORION_MONGO_DATABASE', { defaultValue: 'orion' })

    this._mongoDBUri = `mongodb://${mongoHostname}:${rawMongoPort}/${mongoDatabase}`

    this._featuredContentSecret = loadEnvVar('ORION_FEATURED_CONTENT_SECRET')
    this._adminSecret = loadEnvVar('ORION_ADMIN_SECRET')
    // SR25519 32 bytes private key to create signature on App actions
    this._appPrivateKey = loadEnvVar('APP_PRIVATE_KEY')
    this._queryNodeUrl = loadEnvVar('ORION_QUERY_NODE_URL')

    this._isDebugging = loadEnvVar('ORION_DEBUGGING', { defaultValue: 'false' }) === 'true'
  }
}

const config = new Config()
export default config
