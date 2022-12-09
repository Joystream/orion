"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRateLimit = exports.anonymousAuth = exports.createAccountAndSignIn = exports.requestEmailConfirmationToken = exports.confirmEmail = exports.createAccount = exports.signedAction = exports.DEFAULT_PASSWORD = exports.decryptSeed = exports.prepareEncryptionArtifacts = exports.calculateLookupKey = exports.aes256CbcDecrypt = exports.aes256CbcEncrypt = exports.scryptHash = exports.keyring = void 0;
require("./config");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const globalEm_1 = require("../../utils/globalEm");
const model_1 = require("../../model");
const assert_1 = __importDefault(require("assert"));
const keyring_1 = require("@polkadot/keyring");
const config_1 = require("../../utils/config");
const util_1 = require("@polkadot/util");
const types_1 = require("@joystream/types");
const crypto_1 = require("../../utils/crypto");
const crypto_2 = require("crypto");
const auth_1 = require("../../utils/auth");
const rateLimits_1 = require("../rateLimits");
exports.keyring = new keyring_1.Keyring({ type: 'sr25519', ss58Format: types_1.JOYSTREAM_ADDRESS_PREFIX });
async function scryptHash(data, salt, keylen = 32, options = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }) {
    return new Promise((resolve, reject) => {
        (0, crypto_2.scrypt)(data, salt, keylen, options, (err, derivedKey) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(derivedKey);
            }
        });
    });
}
exports.scryptHash = scryptHash;
function aes256CbcEncrypt(data, key, iv) {
    const cipher = (0, crypto_2.createCipheriv)('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
exports.aes256CbcEncrypt = aes256CbcEncrypt;
function aes256CbcDecrypt(encryptedData, key, iv) {
    const decipher = (0, crypto_2.createDecipheriv)('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
exports.aes256CbcDecrypt = aes256CbcDecrypt;
async function calculateLookupKey(email, password) {
    return (await scryptHash(`lookupKey:${email}:${password}`, 'lookupKeySalt')).toString('hex');
}
exports.calculateLookupKey = calculateLookupKey;
async function prepareEncryptionArtifacts(seed, email, password) {
    const id = await calculateLookupKey(email, password);
    const cipherIv = (0, crypto_2.randomBytes)(16);
    const cipherKey = await scryptHash(`cipherKey:${email}:${password}`, cipherIv);
    const encryptedSeed = aes256CbcEncrypt(seed, cipherKey, cipherIv);
    return {
        id,
        cipherIv: cipherIv.toString('hex'),
        encryptedSeed,
    };
}
exports.prepareEncryptionArtifacts = prepareEncryptionArtifacts;
async function decryptSeed(email, password, { cipherIv, encryptedSeed }) {
    const cipherIvBuf = Buffer.from(cipherIv, 'hex');
    const cipherKey = await scryptHash(`cipherKey:${email}:${password}`, cipherIvBuf);
    return aes256CbcDecrypt(encryptedSeed, cipherKey, cipherIvBuf);
}
exports.decryptSeed = decryptSeed;
exports.DEFAULT_PASSWORD = 'TestPassword123!';
async function signedAction(data, keypair) {
    const em = await globalEm_1.globalEm;
    const gatewayName = await config_1.config.get(config_1.ConfigVariable.AppName, em);
    const payload = {
        gatewayName,
        joystreamAccountId: keypair.address,
        timestamp: Date.now(),
        ...data,
    };
    const signature = (0, util_1.u8aToHex)(keypair.sign(JSON.stringify(payload)));
    return {
        payload,
        signature,
    };
}
exports.signedAction = signedAction;
async function insertFakeMember(controllerAccount) {
    const em = await globalEm_1.globalEm;
    return em.getRepository(model_1.Membership).save({
        createdAt: new Date(),
        id: (0, crypto_1.uniqueId)(),
        controllerAccount,
        handle: (0, crypto_1.uniqueId)(),
        totalChannelsCreated: 0,
    });
}
async function createAccount(email = `test.${(0, crypto_1.uniqueId)()}@example.com`, password = exports.DEFAULT_PASSWORD, seed) {
    seed = seed || (0, crypto_1.uniqueId)();
    const keypair = exports.keyring.addFromUri(`//${seed}`);
    const em = await globalEm_1.globalEm;
    const membership = await insertFakeMember(keypair.address);
    const anonSessionId = await anonymousAuth();
    const createAccountReqData = await signedAction({
        action: 'createAccount',
        email,
        memberId: membership.id,
        encryptionArtifacts: await prepareEncryptionArtifacts(seed, email, password),
    }, keypair);
    await (0, supertest_1.default)(index_1.app)
        .post('/api/v1/account')
        .set('Content-Type', 'application/json')
        .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${anonSessionId}`)
        .send(createAccountReqData)
        .expect(200);
    const account = await em.getRepository(model_1.Account).findOneBy({ email });
    (0, assert_1.default)(account, 'Account not found');
    return { accountId: account.id, joystreamAccountId: keypair.address, email, password, seed };
}
exports.createAccount = createAccount;
async function confirmEmail(token, expectedStatus) {
    await (0, supertest_1.default)(index_1.app)
        .post('/api/v1/confirm-email')
        .set('Content-Type', 'application/json')
        .send({ token })
        .expect(expectedStatus);
}
exports.confirmEmail = confirmEmail;
async function requestEmailConfirmationToken(email, expectedStatus) {
    await (0, supertest_1.default)(index_1.app)
        .post('/api/v1/request-email-confirmation-token')
        .set('Content-Type', 'application/json')
        .send({ email })
        .expect(expectedStatus);
}
exports.requestEmailConfirmationToken = requestEmailConfirmationToken;
async function createAccountAndSignIn(email = `test.${(0, crypto_1.uniqueId)()}@example.com`, password = exports.DEFAULT_PASSWORD, seed) {
    const accountData = await createAccount(email, password, seed);
    const keypair = exports.keyring.addFromUri(`//${accountData.seed}`);
    const loginReqData = await signedAction({
        action: 'login',
    }, keypair);
    console.log('Login request data:', loginReqData);
    const loginResp = await (0, supertest_1.default)(index_1.app)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send(loginReqData)
        .expect(200);
    const sessionId = extractSessionId(loginResp);
    const sessionIdRaw = sessionId.split('.')[0].split(':')[1];
    return {
        sessionId: extractSessionId(loginResp),
        sessionIdRaw,
        ...accountData,
    };
}
exports.createAccountAndSignIn = createAccountAndSignIn;
function extractSessionId(response) {
    const setCookieHeader = response.get('Set-Cookie');
    (0, assert_1.default)(setCookieHeader, 'Set-Cookie header not found');
    const [setCookieHeaderStr] = setCookieHeader;
    const [, sessionId] = setCookieHeaderStr.match(new RegExp(`${auth_1.SESSION_COOKIE_NAME}=([^;]+)`)) || [];
    (0, assert_1.default)(sessionId, 'Session id not found');
    return sessionId;
}
async function anonymousAuth() {
    const response = await (0, supertest_1.default)(index_1.app)
        .post('/api/v1/anonymous-auth')
        .set('Content-Type', 'application/json')
        .expect(200);
    return extractSessionId(response);
}
exports.anonymousAuth = anonymousAuth;
async function verifyRateLimit(requestGenerator, rateLimit, resetAfterwards = true) {
    (0, assert_1.default)(rateLimit, 'Rate limit not set');
    let remaining = rateLimit.limit;
    let reset = rateLimit.windowMinutes * 60;
    let i = 0;
    while (remaining > 0) {
        const { req, status } = await requestGenerator(i++);
        const resp = await req.expect(status);
        const limitInHeader = resp.get('ratelimit-limit');
        const resetInHeader = resp.get('ratelimit-reset');
        const remainingInHeader = resp.get('ratelimit-remaining');
        assert_1.default.equal(limitInHeader, rateLimit.limit.toString(), 'Limit header does not match the configured limit');
        (0, assert_1.default)(parseInt(resetInHeader) <= reset, 'Reset time in header has increased since the last request or is greater than the configured reset time');
        (0, assert_1.default)(parseInt(remainingInHeader) < remaining, 'Number of remaining requests in header is not decreasing');
        remaining = parseInt(remainingInHeader);
        reset = parseInt(resetInHeader);
    }
    const { req } = await requestGenerator(i);
    await req.expect(429);
    if (resetAfterwards) {
        (0, rateLimits_1.resetAllLimits)('::ffff:127.0.0.1');
        (0, rateLimits_1.resetAllLimits)('127.0.0.1');
    }
}
exports.verifyRateLimit = verifyRateLimit;
//# sourceMappingURL=common.js.map