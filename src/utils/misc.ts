export function assertAssignable<T>(type: T) {
  return type
}

export function criticalError(message: string, metadata?: Record<string, unknown>): never {
  metadata ? console.error(message, metadata) : console.error(message)
  throw new Error(message)
}

export function isObject(o: unknown): o is object {
  return typeof o === 'object' && !Array.isArray(o) && !!o
}
