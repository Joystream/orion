"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const offchainState_1 = require("../utils/offchainState");
const globalEm_1 = require("../utils/globalEm");
async function main() {
    const offchainState = new offchainState_1.OffchainState();
    const em = await globalEm_1.globalEm;
    await offchainState.export(em);
}
main()
    .then(() => process.exit(0))
    .catch((e) => {
    console.error(e);
    process.exit(-1);
});
//# sourceMappingURL=export.js.map