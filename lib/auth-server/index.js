"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.logger = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const types_1 = require("express-openapi-validator/dist/framework/types");
const path_1 = __importDefault(require("path"));
const errors_1 = require("./errors");
const logger_1 = require("@subsquid/logger");
const auth_1 = require("../utils/auth");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const rateLimits_1 = require("./rateLimits");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
exports.logger = (0, logger_1.createLogger)('auth-api');
exports.app = (0, express_1.default)();
function authHandler(type) {
    return async (req) => {
        const authContext = await (0, auth_1.authenticate)(req, type);
        if (req.res) {
            req.res.locals.authContext = authContext;
        }
        return true;
    };
}
exports.app.set('trust proxy', process.env.TRUST_PROXY || false);
exports.app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: (0, auth_1.getCorsOrigin)(),
    credentials: true,
}));
(0, rateLimits_1.applyRateLimits)(exports.app, rateLimits_1.globalRateLimit, rateLimits_1.rateLimitsPerRoute);
if (process.env.OPENAPI_PLAYGROUND === 'true' || process.env.OPENAPI_PLAYGROUND === '1') {
    const spec = js_yaml_1.default.load(fs_1.default.readFileSync(path_1.default.join(__dirname, 'openapi.yml')).toString());
    exports.logger.info('Running playground at /playground');
    console.log('Spec', spec);
    exports.app.use('/playground', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spec));
}
exports.app.use(OpenApiValidator.middleware({
    apiSpec: path_1.default.join(__dirname, 'openapi.yml'),
    operationHandlers: path_1.default.join(__dirname, 'handlers'),
    validateSecurity: {
        handlers: {
            bearerAuth: authHandler('header'),
            cookieAuth: authHandler('cookie'),
        },
    },
}));
// TODO: Logging
exports.app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    exports.logger.error(String(err));
    const message = err instanceof types_1.HttpError || err instanceof errors_1.AuthApiError ? err.message : 'Internal server error';
    const status = err instanceof types_1.HttpError || err instanceof errors_1.AuthApiError ? err.status : 500;
    res.status(status).json({ message });
});
const port = parseInt(process.env.AUTH_API_PORT || '4704');
exports.app.listen(port, () => exports.logger.info(`Listening on port ${port}`));
//# sourceMappingURL=index.js.map