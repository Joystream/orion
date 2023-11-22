import { Api } from './Api'
import { OrionApi } from './OrionApi'
import { ResourceLocker } from './Resources'

export type FlowProps = {
  api: Api
  env: NodeJS.ProcessEnv
  query: OrionApi
  lock: ResourceLocker
}
export type Flow = (args: FlowProps) => Promise<void>
