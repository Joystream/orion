"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmEmail = void 0;
const errors_1 = require("../errors");
const globalEm_1 = require("../../utils/globalEm");
const model_1 = require("../../model");
const typeorm_1 = require("typeorm");
const confirmEmail = async (req, res, next) => {
    try {
        const { token: tokenId } = req.body;
        const em = await globalEm_1.globalEm;
        await em.transaction(async (em) => {
            const token = await em.getRepository(model_1.Token).findOne({
                where: { id: tokenId, expiry: (0, typeorm_1.MoreThan)(new Date()) },
                relations: { issuedFor: true },
            });
            if (!token) {
                throw new errors_1.BadRequestError('Token not found. Possibly expired or already used.');
            }
            if (token.issuedFor.isEmailConfirmed) {
                throw new errors_1.BadRequestError('Email already confirmed');
            }
            const account = token.issuedFor;
            account.isEmailConfirmed = true;
            token.expiry = new Date();
            await em.save([account, token]);
        });
        res.status(200).json({ success: true });
    }
    catch (e) {
        next(e);
    }
};
exports.confirmEmail = confirmEmail;
//# sourceMappingURL=confirmEmail.js.map