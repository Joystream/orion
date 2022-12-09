"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss UTC';
dayjs_1.default.extend(utc_1.default);
function formatDate(date, format = DEFAULT_DATE_FORMAT) {
    return dayjs_1.default.utc(date).format(format);
}
exports.formatDate = formatDate;
//# sourceMappingURL=date.js.map