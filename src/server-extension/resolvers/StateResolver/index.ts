import { Resolver, Root, Subscription } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { ProcessorState } from './types'
import _, { isObject } from 'lodash'
import { getEm } from '../../../utils/orm'
import { has } from '../../../utils/misc'

class ProcessorStateRetriever {
  public state: ProcessorState
  private em: EntityManager

  public run(intervalMs: number) {
    this.updateLoop(intervalMs)
      .then(() => {
        /* Do nothing */
      })
      .catch((err) => {
        console.error(err)
        process.exit(-1)
      })
  }

  private async updateLoop(intervalMs: number) {
    this.em = await getEm()
    while (true) {
      try {
        this.state = await this.getUpdatedState()
      } catch (e) {
        console.error('Cannot get updated state', e)
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }

  private async getUpdatedState() {
    const dbResult: unknown = await this.em.query('SELECT "height" FROM "squid_processor"."status"')
    return {
      lastProcessedBlock:
        Array.isArray(dbResult) &&
        isObject(dbResult[0]) &&
        has(dbResult[0], 'height') &&
        typeof dbResult[0].height === 'number'
          ? dbResult[0].height
          : -1,
    }
  }
}

const processorStateRetriever = new ProcessorStateRetriever()
processorStateRetriever.run(1000)

async function* processorStateGenerator(): AsyncGenerator<ProcessorState> {
  let lastState: ProcessorState | undefined
  while (1) {
    const currentState = processorStateRetriever.state
    if (!_.isEqual(currentState, lastState)) {
      yield currentState
      lastState = currentState
    }
    // 100ms interval when checking for updates
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

@Resolver()
export class StateResolver {
  // Set by depenency injection
  constructor(private tx: () => Promise<EntityManager>) {}

  @Subscription({
    subscribe: () => processorStateGenerator(),
  })
  processorState(@Root() state: ProcessorState): ProcessorState {
    return state
  }
}
