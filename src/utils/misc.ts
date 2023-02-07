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

export function has<T extends object, P extends string>(
  o: T,
  p: P
): o is T & { [K in P]: unknown } {
  return p in o
}
