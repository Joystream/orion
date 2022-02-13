export interface GenericAggregate<EventType> {
  applyEvent: (event: EventType) => void
}
