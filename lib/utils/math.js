"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.median = void 0;
const lodash_1 = __importDefault(require("lodash"));
function median(arr) {
    arr.sort((a, b) => a - b);
    return arr.length % 2
        ? arr[Math.floor(arr.length / 2)]
        : lodash_1.default.mean(arr.slice(arr.length / 2 - 1, arr.length / 2 + 1));
}
exports.median = median;
//# sourceMappingURL=math.js.map