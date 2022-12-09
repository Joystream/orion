"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idStringFromNumber = exports.has = exports.isObject = exports.criticalError = exports.assertAssignable = void 0;
const lodash_1 = __importDefault(require("lodash"));
function assertAssignable(type) {
    return type;
}
exports.assertAssignable = assertAssignable;
function criticalError(message, metadata) {
    metadata ? console.error(message, metadata) : console.error(message);
    throw new Error(message);
}
exports.criticalError = criticalError;
function isObject(o) {
    return typeof o === 'object' && !Array.isArray(o) && !!o;
}
exports.isObject = isObject;
function has(o, p) {
    return p in o;
}
exports.has = has;
// Converts id as number to id as string (radix 36, with leading zeros)
function idStringFromNumber(idNum) {
    const idStr = idNum.toString(36);
    // Add leading zeros to simplify sorting
    return lodash_1.default.repeat('0', 8 - idStr.length) + idStr;
}
exports.idStringFromNumber = idStringFromNumber;
//# sourceMappingURL=misc.js.map