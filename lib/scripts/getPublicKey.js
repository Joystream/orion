"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const crypto_1 = require("../utils/crypto");
const util_1 = require("@polkadot/util");
const util_crypto_1 = require("@polkadot/util-crypto");
async function main() {
    await (0, util_crypto_1.cryptoWaitReady)();
    const string = process_1.argv[2];
    const appKeypair = (0, crypto_1.appKeypairFromString)(string);
    console.log((0, util_1.u8aToHex)(appKeypair.publicKey));
}
main()
    .then(() => process.exit(0))
    .catch((e) => {
    console.error(e);
    process.exit(-1);
});
//# sourceMappingURL=getPublicKey.js.map