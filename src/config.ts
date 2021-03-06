import dotenv from 'dotenv'

const isDev = process.env.NODE_ENV === 'development'

type LoadEnvVarOpts = {
  defaultValue?: string
  devDefaultValue?: string
}
const loadEnvVar = (name: string, { defaultValue, devDefaultValue }: LoadEnvVarOpts): string => {
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
  private _bucketSize: number
  private _mongoDBUri: string

  get port(): number {
    return this._port
  }

  get bucketSize(): number {
    return this._bucketSize
  }

  get mongoDBUri(): string {
    return this._mongoDBUri
  }

  loadConfig() {
    dotenv.config()

    const rawPort = loadEnvVar('ORION_PORT', { defaultValue: '6116' })
    this._port = parseInt(rawPort)

    const rawBucketSize = loadEnvVar('ORION_BUCKET_SIZE', { defaultValue: '50000' })
    this._bucketSize = parseInt(rawBucketSize)

    const mongoHostname = loadEnvVar('ORION_MONGO_HOSTNAME', { devDefaultValue: 'localhost' })
    const rawMongoPort = loadEnvVar('ORION_MONGO_PORT', { defaultValue: '27017' })
    const mongoDatabase = loadEnvVar('ORION_MONGO_DATABASE', { defaultValue: 'orion' })

    this._mongoDBUri = `mongodb://${mongoHostname}:${rawMongoPort}/${mongoDatabase}`
  }
}

const config = new Config()
export default config
