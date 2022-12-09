"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config");
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const globalEm_1 = require("../../utils/globalEm");
const model_1 = require("../../model");
const assert_1 = __importDefault(require("assert"));
const common_1 = require("./common");
const util_crypto_1 = require("@polkadot/util-crypto");
const crypto_1 = require("crypto");
const auth_1 = require("../../utils/auth");
const rateLimits_1 = require("../rateLimits");
describe('artifacts', () => {
    let em;
    before(async () => {
        await (0, util_crypto_1.cryptoWaitReady)();
        em = await globalEm_1.globalEm;
    });
    describe('encryptionArtifacts', () => {
        const email = 'encryption.artifacts.test@example.com';
        const password = 'SomeSuperSecurePassword123!';
        const seed = (0, crypto_1.randomBytes)(16).toString('hex');
        before(async () => {
            await (0, common_1.createAccountAndSignIn)(email, password, seed);
        });
        it('should be possible to retrieve saved encryption artifacts and decrypt the seed', async () => {
            const urlParms = new URLSearchParams({
                email,
                id: await (0, common_1.calculateLookupKey)(email, password),
            });
            const response = await (0, supertest_1.default)(index_1.app)
                .get(`/api/v1/artifacts?${urlParms.toString()}`)
                .expect(200);
            const decryptedSeed = await (0, common_1.decryptSeed)(email, password, response.body);
            (0, assert_1.default)(decryptedSeed === seed, 'Decrypted seed does not match');
        });
        it('should not be possible to retrieve enecryption artifacts by invalid id', async () => {
            const urlParms = new URLSearchParams({
                email,
                id: await (0, common_1.calculateLookupKey)(email, 'invalid password'),
            });
            await (0, supertest_1.default)(index_1.app).get(`/api/v1/artifacts?${urlParms.toString()}`).expect(404);
        });
        it('should not be possible to retrieve enecryption artifacts if invalid email was provided', async () => {
            const otherAccount = await (0, common_1.createAccount)();
            const urlParms = new URLSearchParams({
                email: otherAccount.email,
                id: await (0, common_1.calculateLookupKey)(email, password),
            });
            await (0, supertest_1.default)(index_1.app).get(`/api/v1/artifacts?${urlParms.toString()}`).expect(404);
        });
        it('should not be possible to retrieve enecryption artifacts if no email was provided', async () => {
            await (0, supertest_1.default)(index_1.app)
                .get(`/api/v1/artifacts?id=${await (0, common_1.calculateLookupKey)(email, password)}`)
                .expect(400);
        });
        it('should not be possible to retrieve enecryption artifacts if no id was provided', async () => {
            const urlParms = new URLSearchParams({ email });
            await (0, supertest_1.default)(index_1.app).get(`/api/v1/artifacts?${urlParms.toString()}`).expect(400);
        });
        it('should not be possible to retrieve encryption artifacts if neither an email nor an id was provided', async () => {
            await (0, supertest_1.default)(index_1.app).get(`/api/v1/artifacts`).expect(400);
        });
        it('should not be possible to exceed rate limit when retrieving artifacts (brute-force)', async () => {
            await (0, common_1.verifyRateLimit)(async (i) => {
                // We speficially test 404 status, as this would be the typical brute-force scenario
                const id = await (0, common_1.calculateLookupKey)(email, `Attempt${i}`);
                const urlParms = new URLSearchParams({
                    email,
                    id,
                });
                return {
                    req: (0, supertest_1.default)(index_1.app).get(`/api/v1/artifacts?${urlParms.toString()}`),
                    status: 404,
                };
            }, rateLimits_1.rateLimitsPerRoute['/artifacts']?.get);
        });
    });
    describe('sessionEncryptionArtifacts', () => {
        let loggedInAccountInfo;
        let sessionEncryptedSeed;
        const seed = (0, crypto_1.randomBytes)(16).toString('hex');
        let artifacts;
        before(async () => {
            loggedInAccountInfo = await (0, common_1.createAccountAndSignIn)(undefined, undefined, seed);
            const cipherIv = (0, crypto_1.randomBytes)(16);
            const cipherKey = (0, crypto_1.randomBytes)(32);
            artifacts = { cipherIv: cipherIv.toString('hex'), cipherKey: cipherKey.toString('hex') };
            sessionEncryptedSeed = (0, common_1.aes256CbcEncrypt)(seed, cipherKey, cipherIv);
        });
        it('should not be possible to post session encryption artifacts when not authenticated', async () => {
            await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/session-artifacts')
                .set('Content-Type', 'application/json')
                .send(artifacts)
                .expect(401);
        });
        it('should not be possible to post session encryption artifacts when authenticated anonymously', async () => {
            const sessionId = await (0, common_1.anonymousAuth)();
            await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/session-artifacts')
                .set('Content-Type', 'application/json')
                .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${sessionId}`)
                .send(artifacts)
                .expect(401);
        });
        for (const missingField of ['cipherIv', 'cipherKey']) {
            it(`should not be possible to post session encryption artifacts without ${missingField}`, async () => {
                const { [missingField]: _, ...artifactsWithoutField } = artifacts;
                await (0, supertest_1.default)(index_1.app)
                    .post('/api/v1/session-artifacts')
                    .set('Content-Type', 'application/json')
                    .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
                    .send(artifactsWithoutField)
                    .expect(400);
            });
        }
        it('should not be possible to post empty encryption artifacts', async () => {
            await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/session-artifacts')
                .set('Content-Type', 'application/json')
                .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
                .send({})
                .expect(400);
        });
        it('should not be possible to retrieve session encryption artifacts if not posted', async () => {
            await (0, supertest_1.default)(index_1.app)
                .get(`/api/v1/session-artifacts`)
                .set('Content-Type', 'application/json')
                .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
                .expect(404);
        });
        it('should be possible to post valid encryption artifacts', async () => {
            await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/session-artifacts')
                .set('Content-Type', 'application/json')
                .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
                .send(artifacts)
                .expect(200);
            const savedArtifacts = await em.getRepository(model_1.SessionEncryptionArtifacts).findOneBy({
                sessionId: loggedInAccountInfo.sessionIdRaw,
            });
            (0, assert_1.default)(savedArtifacts, 'Encryption artifacts not saved');
        });
        it('should not be possible to override existing session encryption artifacts', async () => {
            await (0, supertest_1.default)(index_1.app)
                .post('/api/v1/session-artifacts')
                .set('Content-Type', 'application/json')
                .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
                .send(artifacts)
                .expect(409);
        });
        it('should be possible to retrieve saved session encryption artifacts and decrypt the seed', async () => {
            const response = await (0, supertest_1.default)(index_1.app)
                .get(`/api/v1/session-artifacts`)
                .set('Content-Type', 'application/json')
                .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
                .expect(200);
            const { cipherIv, cipherKey } = response.body;
            const decryptedSeed = (0, common_1.aes256CbcDecrypt)(sessionEncryptedSeed, Buffer.from(cipherKey, 'hex'), Buffer.from(cipherIv, 'hex'));
            (0, assert_1.default)(decryptedSeed === seed, 'Decrypted seed does not match');
        });
        it('should not be possible to retrieve session encryption artifacts when authenticated anonymously', async () => {
            const sessionId = await (0, common_1.anonymousAuth)();
            await (0, supertest_1.default)(index_1.app)
                .get('/api/v1/session-artifacts')
                .set('Content-Type', 'application/json')
                .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${sessionId}`)
                .expect(401);
        });
        it('should not be possible to retrieve session encryption artifacts when not authenticated', async () => {
            await (0, supertest_1.default)(index_1.app)
                .get('/api/v1/session-artifacts')
                .set('Content-Type', 'application/json')
                .expect(401);
        });
        it('should not be possible to exceed rate limit when posting artifacts', async () => {
            await (0, common_1.verifyRateLimit)(() => {
                const cipherIv = (0, crypto_1.randomBytes)(16).toString('hex');
                const cipherKey = (0, crypto_1.randomBytes)(32).toString('hex');
                const req = (0, supertest_1.default)(index_1.app)
                    .post('/api/v1/session-artifacts')
                    .set('Content-Type', 'application/json')
                    .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`)
                    .send({ cipherIv, cipherKey });
                return { req, status: 409 };
            }, rateLimits_1.rateLimitsPerRoute['/session-artifacts']?.post);
        });
        it('should not be possible to exceed rate limit when retrieving artifacts', async () => {
            await (0, common_1.verifyRateLimit)(() => {
                const req = (0, supertest_1.default)(index_1.app)
                    .get('/api/v1/session-artifacts')
                    .set('Content-Type', 'application/json')
                    .set('Cookie', `${auth_1.SESSION_COOKIE_NAME}=${loggedInAccountInfo.sessionId}`);
                return { req, status: 200 };
            }, rateLimits_1.rateLimitsPerRoute['/session-artifacts']?.get);
        });
    });
});
//# sourceMappingURL=artifacts.js.map