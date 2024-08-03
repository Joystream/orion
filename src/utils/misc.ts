import _ from 'lodash'

export function assertAssignable<T>(type: T) {
  return type
}

export function criticalError(message: string, metadata?: Record<string, unknown>): never {
  if (metadata) {
    console.error(message, metadata)
  } else {
    console.error(message)
  }
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

export async function pWaitFor(
  conditionFunction: () => Promise<boolean>,
  checkInterval = 100,
  timeout = 5000, // Default timeout of 5000 milliseconds
  errorMessage = 'Condition timed out'
): Promise<void> {
  return new Promise((resolve, reject) => {
    let elapsedTime = 0

    const interval = setInterval(() => {
      conditionFunction()
        .then((isConditionMet) => {
          if (isConditionMet) {
            clearInterval(interval)
            resolve()
          } else if (elapsedTime > timeout) {
            clearInterval(interval)
            reject(new Error(errorMessage))
          } else {
            elapsedTime += checkInterval // Update the elapsed time
          }
        })
        .catch((error) => {
          clearInterval(interval)
          reject(error)
        })
    }, checkInterval)
  })
}
