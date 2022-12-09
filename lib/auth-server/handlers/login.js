"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const model_1 = require("../../model");
const globalEm_1 = require("../../utils/globalEm");
const errors_1 = require("../errors");
const auth_1 = require("../../utils/auth");
const utils_1 = require("../utils");
const login = async (req, res, next) => {
    try {
        const { payload: { joystreamAccountId }, } = req.body;
        const em = await globalEm_1.globalEm;
        await (0, utils_1.verifyActionExecutionRequest)(em, req.body);
        const [sessionData, account] = await em.transaction(async (em) => {
            const account = await em
                .getRepository(model_1.Account)
                .findOneBy({ joystreamAccount: joystreamAccountId });
            if (!account) {
                throw new errors_1.UnauthorizedError('Invalid credentials');
            }
            const sessionData = await (0, auth_1.getOrCreateSession)(em, req, account.userId, account.id);
            return [sessionData, account];
        });
        (0, auth_1.setSessionCookie)(res, sessionData.session.id, sessionData.sessionMaxDurationHours);
        res.status(200).json({
            accountId: account.id,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.login = login;
//# sourceMappingURL=login.js.map