"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config");
const globalEm_1 = require("../../utils/globalEm");
const typeorm_1 = require("typeorm");
const common_1 = require("./common");
const model_1 = require("../../model");
const assert_1 = __importDefault(require("assert"));
const config_1 = require("../../utils/config");
const util_crypto_1 = require("@polkadot/util-crypto");
async function findActiveToken(em, accountId) {
    return em.getRepository(model_1.Token).findOneBy({
        type: model_1.TokenType.EMAIL_CONFIRMATION,
        issuedForId: accountId,
        expiry: (0, typeorm_1.MoreThan)(new Date()),
    });
}
async function reloadToken(em, token) {
    return em.getRepository(model_1.Token).findOneByOrFail({ id: token.id });
}
describe('requestEmailConfirmationToken', () => {
    let em;
    let accountInfo;
    before(async () => {
        await (0, util_crypto_1.cryptoWaitReady)();
        em = await globalEm_1.globalEm;
        accountInfo = await (0, common_1.createAccount)();
    });
    it('should fail if account does not exist', async () => {
        await (0, common_1.requestEmailConfirmationToken)('non.existing.account@example.com', 404);
    });
    it('should succeed if account exists', async () => {
        await (0, common_1.requestEmailConfirmationToken)(accountInfo.email, 200);
        const token = await findActiveToken(em, accountInfo.accountId);
        (0, assert_1.default)(token, 'Token not found');
    });
    it('should fail if account is already confirmed', async () => {
        let oldToken = await findActiveToken(em, accountInfo.accountId);
        (0, assert_1.default)(oldToken, 'Pre-existing token not found');
        await (0, common_1.confirmEmail)(oldToken.id, 200);
        oldToken = await reloadToken(em, oldToken);
        (0, assert_1.default)(oldToken.expiry.getTime() <= Date.now(), 'Pre-existing token is not expired');
        await (0, common_1.requestEmailConfirmationToken)(accountInfo.email, 400);
    });
    it('should fail if rate limit is exceeded', async () => {
        const { email, accountId } = await (0, common_1.createAccount)();
        const rateLimit = await config_1.config.get(config_1.ConfigVariable.EmailConfirmationTokenRateLimit, em);
        let previousToken = null;
        for (let i = 0; i < rateLimit; i++) {
            await (0, common_1.requestEmailConfirmationToken)(email, 200);
            const newToken = await findActiveToken(em, accountId);
            (0, assert_1.default)(newToken, 'Token not found');
            if (previousToken) {
                previousToken = await reloadToken(em, previousToken);
                (0, assert_1.default)(newToken.id !== previousToken.id, 'Active token id did not change');
                (0, assert_1.default)(previousToken.expiry.getTime() <= Date.now(), 'Previous token is not expired');
            }
            previousToken = newToken;
        }
        await (0, common_1.requestEmailConfirmationToken)(email, 429);
    });
});
//# sourceMappingURL=requestEmailConfirmationToken.js.map