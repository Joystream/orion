"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsError = exports.ConflictError = exports.NotFoundError = exports.UnauthorizedError = exports.BadRequestError = exports.AuthApiError = void 0;
class AuthApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }
}
exports.AuthApiError = AuthApiError;
class BadRequestError extends AuthApiError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AuthApiError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends AuthApiError {
    constructor(message = 'Not found') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AuthApiError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class TooManyRequestsError extends AuthApiError {
    constructor(message = 'Too many requests') {
        super(message, 429);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
//# sourceMappingURL=errors.js.map