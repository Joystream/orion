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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Codec = exports.codec = exports.registry = void 0;
const codec_1 = require("./codec");
Object.defineProperty(exports, "Codec", { enumerable: true, get: function () { return codec_1.Codec; } });
const registry_1 = require("./registry");
const ss58_registry_json_1 = __importDefault(require("./ss58-registry.json"));
__exportStar(require("@subsquid/ss58-codec"), exports);
__exportStar(require("./registry"), exports);
exports.registry = new registry_1.Registry(ss58_registry_json_1.default.registry);
function codec(networkOrPrefix) {
    let prefix = typeof networkOrPrefix == 'string' ? exports.registry.get(networkOrPrefix).prefix : networkOrPrefix;
    return new codec_1.Codec(prefix);
}
exports.codec = codec;
//# sourceMappingURL=index.js.map