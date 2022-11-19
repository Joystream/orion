import { Resolver, Root, Subscription } from 'type-graphql'
import type { EntityManager } from 'typeorm'
import 'reflect-metadata'
import { ProcessorState } from './types'

// TODO: Just for testing purposes, real implementation TBD
async function* processorStateGenerator(): AsyncGenerator<ProcessorState> {
  let val = 0
  while (1) {
    const promise = new Promise<ProcessorState>((resolve) =>
      setTimeout(
        () =>
          resolve({
            lastProcessedBlock: val,
            chainHead: val + 1,
          }),
        1000
      )
    )
    yield await promise
    ++val
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
