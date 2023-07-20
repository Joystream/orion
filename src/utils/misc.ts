import _ from 'lodash'

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

// Converts id as number to id as string (radix 36, with leading zeros)
export function idStringFromNumber(idNum: number) {
  const idStr = idNum.toString(36)
  // Add leading zeros to simplify sorting
  return _.repeat('0', 8 - idStr.length) + idStr
}
