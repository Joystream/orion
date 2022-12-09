"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestEmailConfirmationToken = void 0;
const errors_1 = require("../errors");
const globalEm_1 = require("../../utils/globalEm");
const model_1 = require("../../model");
const typeorm_1 = require("typeorm");
const config_1 = require("../../utils/config");
const utils_1 = require("../utils");
const requestEmailConfirmationToken = async (req, res, next) => {
    try {
        const { email } = req.body;
        const em = await globalEm_1.globalEm;
        await em.transaction(async (em) => {
            const emailConfirmationTokenExpiryTimeHours = await config_1.config.get(config_1.ConfigVariable.EmailConfirmationTokenExpiryTimeHours, em);
            const emailConfirmationTokenRateLimit = await config_1.config.get(config_1.ConfigVariable.EmailConfirmationTokenRateLimit, em);
            const account = await em.getRepository(model_1.Account).findOne({
                where: { email },
                lock: { mode: 'pessimistic_write' },
            });
            if (!account) {
                throw new errors_1.NotFoundError('Account not found');
            }
            if (account.isEmailConfirmed) {
                throw new errors_1.BadRequestError('Email already confirmed');
            }
            const tokensInTimeframeCount = await em.getRepository(model_1.Token).count({
                where: {
                    issuedForId: account.id,
                    type: model_1.TokenType.EMAIL_CONFIRMATION,
                    issuedAt: (0, typeorm_1.MoreThan)(new Date(Date.now() - emailConfirmationTokenExpiryTimeHours * 3600 * 1000)),
                },
            });
            if (tokensInTimeframeCount >= emailConfirmationTokenRateLimit) {
                throw new errors_1.TooManyRequestsError();
            }
            // Deactivate all currently active email confirmation tokens for this account
            await em.getRepository(model_1.Token).update({
                issuedForId: account.id,
                type: model_1.TokenType.EMAIL_CONFIRMATION,
                expiry: (0, typeorm_1.MoreThan)(new Date()),
            }, { expiry: new Date() });
            await (0, utils_1.sendWelcomeEmail)(account, em);
        });
        res.status(200).json({ success: true });
    }
    catch (e) {
        next(e);
    }
};
exports.requestEmailConfirmationToken = requestEmailConfirmationToken;
//# sourceMappingURL=requestEmailConfirmationToken.js.map