interface LoggerImpl {
  info: (message: string, ...args: unknown[]) => void
  debug: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
}

class DefaultLogger implements LoggerImpl {
  info(message: string, ...args: unknown[]) {
    console.log(message, ...args)
  }

  debug(message: string, ...args: unknown[]) {
    console.log(message, ...args)
  }

  warn(message: string, ...args: unknown[]) {
    console.warn(message, ...args)
  }

  error(message: string, ...args: unknown[]) {
    console.error(message, ...args)
  }
}

export class Logger {
  private static implementation = new DefaultLogger()

  public static set(impl: LoggerImpl) {
    Logger.implementation = impl
  }

  public static get(): LoggerImpl {
    return Logger.implementation
  }
}
