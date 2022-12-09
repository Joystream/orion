"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anonymousAuth = void 0;
const model_1 = require("../../model");
const crypto_1 = require("../../utils/crypto");
const globalEm_1 = require("../../utils/globalEm");
const errors_1 = require("../errors");
const auth_1 = require("../../utils/auth");
const anonymousAuth = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const em = await globalEm_1.globalEm;
        const { user, sessionData } = await em.transaction(async (em) => {
            const user = userId
                ? await em.getRepository(model_1.User).findOneBy({
                    id: userId,
                })
                : await em.save(new model_1.User({
                    id: (0, crypto_1.uniqueId)(),
                    isRoot: false,
                }));
            if (!user) {
                throw new errors_1.UnauthorizedError('User not found by provided userId');
            }
            const account = await em.getRepository(model_1.Account).findOneBy({ userId: user.id });
            if (account) {
                throw new errors_1.UnauthorizedError('Cannot use anonymous auth for registered users');
            }
            const sessionData = await (0, auth_1.getOrCreateSession)(em, req, user.id);
            return { user, sessionData };
        });
        (0, auth_1.setSessionCookie)(res, sessionData.session.id, sessionData.sessionMaxDurationHours);
        res.status(200).json({
            success: true,
            userId: user.id,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.anonymousAuth = anonymousAuth;
//# sourceMappingURL=anonymousAuth.js.map