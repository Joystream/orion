"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const globalEm_1 = require("../../utils/globalEm");
const assert_1 = __importDefault(require("assert"));
const config_1 = require("../../utils/config");
const util_1 = require("@polkadot/util");
const common_1 = require("./common");
const util_crypto_1 = require("@polkadot/util-crypto");
const auth_1 = require("../../utils/auth");
const model_1 = require("../../model");
async function changeAccount({ accountId, sessionId, gatewayName, joystreamAccountId, signingKey, expectedStatus, action = 'changeAccount', timestamp = Date.now(), newArtifacts = undefined, }) {
    const payload = {
        joystreamAccountId,
        gatewayAccountId: accountId,
        gatewayName,
        timestamp,
        action: action,
        newArtifacts,
    };
    const signature = (0, util_1.u8aToHex)(signingKey.sign(JSON.stringify(payload)));
    await (0, supertest_1.default)(index_1.app)
        .post('/api/v1/change-account')
        .set('Cookie', sessionId ? `${auth_1.SESSION_COOKIE_NAME}=${sessionId}` : '')
        .set('Content-Type', 'application/json')
        .send({
        payload,
        signature,
    })
        .expect(expectedStatus);
    return signature;
}
describe('changeAccount', () => {
    let accountInfo;
    let gatewayName;
    let em;
    let initialPair;
    let alice;
    let bob;
    before(async () => {
        await (0, util_crypto_1.cryptoWaitReady)();
        accountInfo = await (0, common_1.createAccountAndSignIn)();
        em = await globalEm_1.globalEm;
        gatewayName = await config_1.config.get(config_1.ConfigVariable.AppName, em);
        initialPair = common_1.keyring.addFromUri(`//${accountInfo.seed}`);
        alice = common_1.keyring.addFromUri('//Alice');
        bob = common_1.keyring.addFromUri('//Bob');
    });
    async function assertBlockchainAccountNotChanged() {
        const { seed, email, password, joystreamAccountId, accountId } = accountInfo;
        const account = await em.getRepository(model_1.Account).findOneBy({
            id: accountId,
        });
        const encryptionArtifacts = await em.getRepository(model_1.EncryptionArtifacts).findOneBy({
            accountId,
        });
        (0, assert_1.default)(account?.joystreamAccount === joystreamAccountId, 'Blockchain account unexpectedly changed');
        (0, assert_1.default)(encryptionArtifacts, 'Encryption artifacts unexpectedly deleted');
        (0, assert_1.default)((await (0, common_1.decryptSeed)(email, password, encryptionArtifacts)) === seed, 'Encryption artifacts unexpectedly changed');
    }
    it('should fail with invalid signature', async () => {
        await changeAccount({
            accountId: accountInfo.accountId,
            sessionId: accountInfo.sessionId,
            gatewayName,
            joystreamAccountId: alice.address,
            signingKey: bob,
            expectedStatus: 400,
        });
        await assertBlockchainAccountNotChanged();
    });
    it('should fail with invalid app name', async () => {
        await changeAccount({
            accountId: accountInfo.accountId,
            sessionId: accountInfo.sessionId,
            gatewayName: 'invalid',
            joystreamAccountId: alice.address,
            signingKey: alice,
            expectedStatus: 400,
        });
        await assertBlockchainAccountNotChanged();
    });
    it('should fail if not logged in', async () => {
        await changeAccount({
            accountId: accountInfo.accountId,
            sessionId: undefined,
            gatewayName,
            joystreamAccountId: alice.address,
            signingKey: alice,
            expectedStatus: 401,
        });
        await assertBlockchainAccountNotChanged();
    });
    it('should fail if anonymounsly authenticated', async () => {
        const anonSessionId = await (0, common_1.anonymousAuth)();
        await changeAccount({
            accountId: accountInfo.accountId,
            sessionId: anonSessionId,
            gatewayName,
            joystreamAccountId: alice.address,
            signingKey: alice,
            expectedStatus: 401,
        });
        await assertBlockchainAccountNotChanged();
    });
    it('should fail with invalid gateway account id', async () => {
        await changeAccount({
            accountId: 'invalid',
            sessionId: accountInfo.sessionId,
            gatewayName,
            joystreamAccountId: alice.address,
            signingKey: alice,
            expectedStatus: 400,
        });
        await assertBlockchainAccountNotChanged();
    });
    it('should fail if proof expired', async () => {
        const proofExpiryTime = await config_1.config.get(config_1.ConfigVariable.AccountOwnershipProofExpiryTimeSeconds, em);
        await changeAccount({
            accountId: accountInfo.accountId,
            sessionId: accountInfo.sessionId,
            gatewayName,
            joystreamAccountId: alice.address,
            signingKey: alice,
            expectedStatus: 400,
            timestamp: Date.now() - proofExpiryTime * 1000 - 1,
        });
        await assertBlockchainAccountNotChanged();
    });
    it('should fail if proof timestamp is in the future', async () => {
        await changeAccount({
            accountId: accountInfo.accountId,
            sessionId: accountInfo.sessionId,
            gatewayName,
            joystreamAccountId: alice.address,
            signingKey: alice,
            expectedStatus: 400,
            timestamp: Date.now() + 1000,
        });
        await assertBlockchainAccountNotChanged();
    });
    it('should fail if action is not valid', async () => {
        await changeAccount({
            action: 'invalid',
            accountId: accountInfo.accountId,
            sessionId: accountInfo.sessionId,
            gatewayName,
            joystreamAccountId: alice.address,
            signingKey: alice,
            expectedStatus: 400,
        });
        await assertBlockchainAccountNotChanged();
    });
    it('should work with valid signature, old account and new artifacts', async () => {
        const { email, accountId, sessionId, seed, joystreamAccountId } = accountInfo;
        const newPassword = 'NewPassword123!';
        const newArtifacts = await (0, common_1.prepareEncryptionArtifacts)(seed, email, newPassword);
        await changeAccount({
            accountId,
            sessionId,
            gatewayName,
            joystreamAccountId,
            signingKey: initialPair,
            expectedStatus: 200,
            newArtifacts,
        });
        const account = await em.getRepository(model_1.Account).findOneBy({ id: accountId });
        const encryptionArtifacts = await em
            .getRepository(model_1.EncryptionArtifacts)
            .findOneBy({ accountId });
        (0, assert_1.default)(account?.joystreamAccount === joystreamAccountId, 'Blockchain account unexpectedly changed');
        (0, assert_1.default)(encryptionArtifacts, 'New encryption artifacts not saved');
        (0, assert_1.default)((await (0, common_1.decryptSeed)(email, newPassword, encryptionArtifacts)) === seed, 'Encryption artifacts not correctly updated');
    });
    it('should work with valid signature, new account and new artifacts', async () => {
        const { email, password, accountId, sessionId } = accountInfo;
        const newSeed = 'Alice';
        const newArtifacts = await (0, common_1.prepareEncryptionArtifacts)(newSeed, email, password);
        await changeAccount({
            accountId,
            sessionId,
            gatewayName,
            joystreamAccountId: alice.address,
            signingKey: alice,
            expectedStatus: 200,
            newArtifacts,
        });
        const account = await em.getRepository(model_1.Account).findOneBy({ id: accountId });
        const encryptionArtifacts = await em
            .getRepository(model_1.EncryptionArtifacts)
            .findOneBy({ accountId });
        (0, assert_1.default)(account?.joystreamAccount === alice.address, 'Blockchain account not changed');
        (0, assert_1.default)(encryptionArtifacts, 'Encryption artifacts not saved');
        (0, assert_1.default)((await (0, common_1.decryptSeed)(email, password, encryptionArtifacts)) === newSeed, 'Encryption artifacts not correctly updated');
    });
    it('should work with valid signature and no artifacts', async () => {
        const { accountId, sessionId } = accountInfo;
        await changeAccount({
            accountId,
            sessionId,
            gatewayName,
            joystreamAccountId: bob.address,
            signingKey: bob,
            expectedStatus: 200,
        });
        const account = await em.getRepository(model_1.Account).findOneBy({ id: accountId });
        const encryptionArtifacts = await em
            .getRepository(model_1.EncryptionArtifacts)
            .findOneBy({ accountId });
        (0, assert_1.default)(account?.joystreamAccount === bob.address, 'Blockchain account not changed');
        (0, assert_1.default)(!encryptionArtifacts, 'Encryption artifacts not deleted');
    });
    it('should fail if joystream account is already connected to a different gateway account', async () => {
        const { accountId, sessionId } = await (0, common_1.createAccountAndSignIn)();
        await changeAccount({
            accountId,
            sessionId,
            gatewayName,
            joystreamAccountId: bob.address,
            signingKey: bob,
            expectedStatus: 409,
        });
    });
});
//# sourceMappingURL=changeAccount.js.map