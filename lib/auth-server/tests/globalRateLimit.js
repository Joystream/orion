"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const common_1 = require("./common");
const rateLimits_1 = require("../rateLimits");
describe('global rate limit', () => {
    it("shouldn't be possible to exceed global rate limit", async () => {
        await (0, common_1.verifyRateLimit)((i) => {
            const requestsWithoutSpecificRateLimit = [
                { req: (0, supertest_1.default)(index_1.app).post('/api/v1/logout'), status: 401 },
                { req: (0, supertest_1.default)(index_1.app).post('/api/v1/change-account'), status: 401 },
            ];
            return requestsWithoutSpecificRateLimit[i % requestsWithoutSpecificRateLimit.length];
        }, rateLimits_1.globalRateLimit);
    });
});
//# sourceMappingURL=globalRateLimit.js.map