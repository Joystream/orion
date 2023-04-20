export class AuthApiError extends Error {
  readonly status: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.status = statusCode
  }
}

export class BadRequestError extends AuthApiError {
  constructor(message = 'Bad request') {
    super(message, 400)
  }
}

export class UnauthorizedError extends AuthApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

export class NotFoundError extends AuthApiError {
  constructor(message = 'Not found') {
    super(message, 404)
  }
}
