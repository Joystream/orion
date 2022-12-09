"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCache = exports.SESSION_CACHE_MINIMUM_TTL = exports.SESSION_CACHE_EXPIRY_TTL_MARGIN = exports.SESSION_CACHE_CHECKPERIOD = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
exports.SESSION_CACHE_CHECKPERIOD = 30;
// How many seconds before the session expires in the database should the related cache entry expire
// (in order to trigger database expiry period update)
// Should be greater than checkperiod!
exports.SESSION_CACHE_EXPIRY_TTL_MARGIN = 45;
// A reasonable minimum TTL, in seconds, of the cached session entry
exports.SESSION_CACHE_MINIMUM_TTL = 15;
exports.sessionCache = new node_cache_1.default({
    checkperiod: exports.SESSION_CACHE_CHECKPERIOD,
    useClones: false,
});
//# sourceMappingURL=cache.js.map