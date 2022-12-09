"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRateLimits = exports.resetAllLimits = exports.rateLimitsPerRoute = exports.globalRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const defaultRateLimitOptions = {
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after a while',
    statusCode: 429,
};
// Global limit is 300 auth API requests per 15 minutes per IP,
// it applies to all routes that don't have a specific limit set
exports.globalRateLimit = {
    windowMinutes: 15,
    limit: 300,
};
// Route-specific rate limits
exports.rateLimitsPerRoute = {
    '/anonymous-auth': {
        post: {
            windowMinutes: 5,
            limit: 10,
        },
    },
    '/login': {
        post: {
            windowMinutes: 5,
            limit: 10,
        },
    },
    '/artifacts': {
        get: {
            windowMinutes: 5,
            limit: 10,
        },
    },
    '/account': {
        post: {
            windowMinutes: 30,
            limit: 10,
        },
    },
    '/session-artifacts': {
        get: {
            windowMinutes: 5,
            limit: 100,
        },
        post: {
            windowMinutes: 5,
            limit: 10,
        },
    },
    '/request-email-confirmation-token': {
        post: {
            windowMinutes: 5,
            limit: 10,
        },
    },
    '/confirm-email': {
        post: {
            windowMinutes: 5,
            limit: 10,
        },
    },
};
const limiters = [];
function resetAllLimits(key) {
    limiters.forEach((limiter) => {
        limiter.resetKey(key);
    });
}
exports.resetAllLimits = resetAllLimits;
function applyRateLimits(app, globalLimit, limitsPerRoute) {
    const globalLimiter = (0, express_rate_limit_1.default)({
        ...defaultRateLimitOptions,
        windowMs: globalLimit.windowMinutes * 60 * 1000,
        max: globalLimit.limit,
    });
    limiters.push(globalLimiter);
    app.use('/', globalLimiter);
    for (const [path, pathConfig] of Object.entries(limitsPerRoute)) {
        for (const [method, config] of Object.entries(pathConfig)) {
            const limiter = (0, express_rate_limit_1.default)({
                ...defaultRateLimitOptions,
                windowMs: config.windowMinutes * 60 * 1000,
                max: config.limit,
            });
            limiters.push(limiter);
            app[method](`/api/v1${path}`, limiter);
        }
    }
}
exports.applyRateLimits = applyRateLimits;
//# sourceMappingURL=rateLimits.js.map