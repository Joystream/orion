export class AuthApiError extends Error {
  readonly status: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.status = statusCode
  }
}

export class UnauthorizedError extends AuthApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}
