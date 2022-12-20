import { Resolver, Root, Subscription } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import { ProcessorState } from './types'
import axios from 'axios'
import _ from 'lodash'

class ProcessorStateRetriever {
  public state: ProcessorState

  public run(intervalMs: number) {
    this.updateLoop(intervalMs)
      .then(() => {
        /* Do nothing */
      })
      .catch(console.error)
  }

  private async updateLoop(intervalMs: number) {
    while (true) {
      this.state = await this.getUpdatedState()
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }

  private async getUpdatedState() {
    return {
      lastProcessedBlock: await this.getMetric('sqd_processor_last_block'),
      chainHead: await this.getMetric('sqd_processor_chain_height'),
    }
  }

  private async getMetric(metricName: string) {
    const resp = await axios.get(
      `http://localhost:${process.env.PROCESSOR_PROMETHEUS_PORT}/metrics/${metricName}`,
      { headers: { 'Connection': 'keep-alive' } }
    )
    return parseInt(resp.data.match(new RegExp(`${metricName} ([0-9]+)`))[1])
  }
}

const processorStateRetriever = new ProcessorStateRetriever()
processorStateRetriever.run(100)

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
