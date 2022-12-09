"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appKeypairFromString = exports.uniqueId = void 0;
const util_crypto_1 = require("@polkadot/util-crypto");
const crypto_1 = require("crypto");
function uniqueId(byteSize = 32) {
    return (0, util_crypto_1.base64Encode)((0, crypto_1.randomBytes)(byteSize));
}
exports.uniqueId = uniqueId;
function appKeypairFromString(secret) {
    return (0, util_crypto_1.ed25519PairFromString)(secret);
}
exports.appKeypairFromString = appKeypairFromString;
//# sourceMappingURL=crypto.js.map