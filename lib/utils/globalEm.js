"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalEm = void 0;
const typeorm_1 = require("typeorm");
const path_1 = __importDefault(require("path"));
const typeorm_config_1 = require("@subsquid/typeorm-config");
const logger_1 = require("@subsquid/logger");
const globalEmLogger = (0, logger_1.createLogger)('globalEm');
const config = {
    ...(0, typeorm_config_1.createOrmConfig)({ projectDir: path_1.default.resolve(__dirname, '../..') }),
    entities: [path_1.default.join(__dirname, '../model/*.{ts,js}')],
    username: process.env.DB_ADMIN_USER,
    password: process.env.DB_ADMIN_PASS,
};
const source = new typeorm_1.DataSource(config);
async function initGlobalEm() {
    try {
        await source.initialize();
    }
    catch (e) {
        globalEmLogger.error(`Error during database connection initialization: ${String(e)}`);
        process.exit(-1); // Exit to trigger docker service restart an re-attempt to connect
    }
    const em = source.manager;
    return em;
}
exports.globalEm = initGlobalEm();
//# sourceMappingURL=globalEm.js.map