import { AuthApiError } from '../auth-server/errors'

export class InteractionsApiError extends Error {
  readonly status: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.status = statusCode
  }
}

export class TooManyRequestsFromIp extends InteractionsApiError {
  constructor(message = 'Bad request') {
    super(message, 400)
  }
}

export class BadRequestError extends AuthApiError {
  constructor(message = 'Bad request') {
    super(message, 400)
  }
}

export class UnauthorizedError extends InteractionsApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

export class TooManyRequestsError extends InteractionsApiError {
  constructor(message = 'Too many requests') {
    super(message, 429)
  }
}
