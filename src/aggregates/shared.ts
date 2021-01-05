import { GenericEvent } from '../models/shared'

export abstract class GenericAggregate<EventType = GenericEvent> {
  public abstract rebuild(): Promise<void>
  public abstract applyEvent(event: EventType): void
}
