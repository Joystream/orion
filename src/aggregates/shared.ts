import { GenericEvent } from '../models/shared'

export interface GenericAggregate<EventType = GenericEvent> {
  applyEvent: (event: EventType) => void
}
