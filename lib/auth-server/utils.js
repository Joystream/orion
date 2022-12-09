"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.issueEmailConfirmationToken = exports.verifyActionExecutionRequest = void 0;
const util_crypto_1 = require("@polkadot/util-crypto");
const errors_1 = require("./errors");
const config_1 = require("../utils/config");
const types_1 = require("@joystream/types");
const model_1 = require("../model");
const crypto_1 = require("../utils/crypto");
const mail_1 = require("../utils/mail");
const emails_1 = require("./emails");
const date_1 = require("../utils/date");
async function verifyActionExecutionRequest(em, { payload, signature }) {
    await (0, util_crypto_1.cryptoWaitReady)();
    const signatureVerifyResult = (0, util_crypto_1.signatureVerify)(JSON.stringify(payload), signature, (0, util_crypto_1.decodeAddress)(payload.joystreamAccountId, false, types_1.JOYSTREAM_ADDRESS_PREFIX));
    if (!signatureVerifyResult.isValid || signatureVerifyResult.crypto !== 'sr25519') {
        throw new errors_1.BadRequestError('Payload signature is invalid.');
    }
    const appName = await config_1.config.get(config_1.ConfigVariable.AppName, em);
    const proofExpiryTimeSeconds = await config_1.config.get(config_1.ConfigVariable.AccountOwnershipProofExpiryTimeSeconds, em);
    if (payload.gatewayName !== appName) {
        throw new errors_1.BadRequestError('Payload gatewayName does not match the app name.');
    }
    if (payload.timestamp < Date.now() - proofExpiryTimeSeconds * 1000) {
        throw new errors_1.BadRequestError(`Payload timestamp cannot be older than ${proofExpiryTimeSeconds} seconds.`);
    }
    if (payload.timestamp > Date.now()) {
        throw new errors_1.BadRequestError('Payload timestamp is in the future.');
    }
}
exports.verifyActionExecutionRequest = verifyActionExecutionRequest;
async function issueEmailConfirmationToken(account, em) {
    const issuedAt = new Date();
    const lifetimeMs = (await config_1.config.get(config_1.ConfigVariable.EmailConfirmationTokenExpiryTimeHours, em)) * 3600000;
    const expiry = new Date(issuedAt.getTime() + lifetimeMs);
    const token = new model_1.Token({
        id: (0, crypto_1.uniqueId)(),
        type: model_1.TokenType.EMAIL_CONFIRMATION,
        expiry,
        issuedAt,
        issuedForId: account.id,
    });
    return em.save(token);
}
exports.issueEmailConfirmationToken = issueEmailConfirmationToken;
async function sendWelcomeEmail(account, em) {
    const emailConfirmationToken = await issueEmailConfirmationToken(account, em);
    const appName = await config_1.config.get(config_1.ConfigVariable.AppName, em);
    const confirmEmailRoute = await config_1.config.get(config_1.ConfigVariable.EmailConfirmationRoute, em);
    const emailConfirmationLink = confirmEmailRoute.replace('{token}', emailConfirmationToken.id);
    await (0, mail_1.sendMail)({
        from: await config_1.config.get(config_1.ConfigVariable.SendgridFromEmail, em),
        to: account.email,
        ...(0, emails_1.registerEmailData)({
            link: emailConfirmationLink,
            linkExpiryDate: (0, date_1.formatDate)(emailConfirmationToken.expiry),
            appName,
        }),
    });
}
exports.sendWelcomeEmail = sendWelcomeEmail;
//# sourceMappingURL=utils.js.map