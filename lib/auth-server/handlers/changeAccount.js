"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeAccount = void 0;
const errors_1 = require("../errors");
const globalEm_1 = require("../../utils/globalEm");
const model_1 = require("../../model");
const utils_1 = require("../utils");
const changeAccount = async (req, res, next) => {
    try {
        const { body: { payload }, } = req;
        const { locals: { authContext }, } = res;
        if (!authContext?.account) {
            throw new errors_1.UnauthorizedError();
        }
        const { account } = authContext;
        const em = await globalEm_1.globalEm;
        await (0, utils_1.verifyActionExecutionRequest)(em, req.body);
        if (payload.gatewayAccountId !== account.id) {
            throw new errors_1.BadRequestError('Invalid gateway account id provided in payload.');
        }
        await em.transaction(async (em) => {
            const existingGatewayAccount = await em.findOne(model_1.Account, {
                where: { joystreamAccount: payload.joystreamAccountId },
            });
            if (existingGatewayAccount && existingGatewayAccount.id !== account.id) {
                throw new errors_1.ConflictError('Provided account is already assigned to some other gateway account.');
            }
            // Update the assigned blockchain account
            await em.update(model_1.Account, { id: account.id }, { joystreamAccount: payload.joystreamAccountId });
            // Remove the old encryption artifacts
            await em.delete(model_1.EncryptionArtifacts, { accountId: account.id });
            // Optionally save new encryption artifacts
            if (payload.newArtifacts) {
                // We don't check if artifacts already exist by this id, becasue that opens up
                // a brute-force attack vector. Instead, in this case the existing artifacts will
                // be overwritten.
                await em.save(model_1.EncryptionArtifacts, {
                    accountId: account.id,
                    ...payload.newArtifacts,
                });
            }
        });
        res.status(200).json({ success: true });
    }
    catch (err) {
        next(err);
    }
};
exports.changeAccount = changeAccount;
//# sourceMappingURL=changeAccount.js.map